/**
 * Exchange Rate Provider for EGP vs Foreign Currencies
 * Validated via Zod, with multiple resilient fallback providers
 */
import { z } from "zod";
import { CurrencyItem, CurrencyRatesData, MarketData } from "../types.js";
import { MarketCache } from "../cache.js";

// Zod schemas
const ErApiResponseSchema = z.object({
  result: z.string(),
  base_code: z.string(),
  time_last_update_unix: z.number().optional(),
  time_last_update_utc: z.string().optional(),
  time_next_update_unix: z.number().optional(),
  rates: z.record(z.string(), z.number()),
});

const ExchangeRateApiV4Schema = z.object({
  base: z.string(),
  date: z.string(),
  rates: z.record(z.string(), z.number()),
});

const FawazAhmedSchema = z.object({
  date: z.string(),
  usd: z.record(z.string(), z.number()),
});

const CURRENCY_METADATA: Record<
  string,
  { nameEn: string; nameAr: string; symbol: string; flag: string }
> = {
  USD: { nameEn: "US Dollar", nameAr: "دولار أمريكي", symbol: "$", flag: "🇺🇸" },
  EUR: { nameEn: "Euro", nameAr: "يورو", symbol: "€", flag: "🇪🇺" },
  GBP: { nameEn: "British Pound", nameAr: "جنيه إسترليني", symbol: "£", flag: "🇬🇧" },
  SAR: { nameEn: "Saudi Riyal", nameAr: "ريال سعودي", symbol: "ر.س", flag: "🇸🇦" },
  AED: { nameEn: "UAE Dirham", nameAr: "درهم إماراتي", symbol: "د.إ", flag: "🇦🇪" },
  KWD: { nameEn: "Kuwaiti Dinar", nameAr: "دينار كويتي", symbol: "د.ك", flag: "🇰🇼" },
  QAR: { nameEn: "Qatari Riyal", nameAr: "ريال قطري", symbol: "ر.ق", flag: "🇶🇦" },
  BHD: { nameEn: "Bahraini Dinar", nameAr: "دينار بحريني", symbol: "د.ب", flag: "🇧🇭" },
  OMR: { nameEn: "Omani Rial", nameAr: "ريال عماني", symbol: "ر.ع", flag: "🇴🇲" },
  CAD: { nameEn: "Canadian Dollar", nameAr: "دولار كندي", symbol: "C$", flag: "🇨🇦" },
  CHF: { nameEn: "Swiss Franc", nameAr: "فرنك سويسري", symbol: "CHF", flag: "🇨🇭" },
  JPY: { nameEn: "Japanese Yen", nameAr: "ين ياباني", symbol: "¥", flag: "🇯🇵" },
};

export class CurrencyService {
  private static CACHE_KEY = "market_currencies";
  private static CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * Main entry point with caching and fallbacks
   */
  static async getCurrencyRates(): Promise<MarketData<CurrencyRatesData>> {
    return MarketCache.wrap<CurrencyRatesData>({
      key: CurrencyService.CACHE_KEY,
      ttlMs: CurrencyService.CACHE_TTL_MS,
      defaultSource: "Open Exchange Rates API",
      defaultSourceUrl: "https://open.er-api.com/v6/latest/USD",
      fetcher: () => CurrencyService.fetchFromProviders(),
    });
  }

  /**
   * Fetch from primary provider, falling back to alternates if needed
   */
  private static async fetchFromProviders(): Promise<MarketData<CurrencyRatesData>> {
    // 1. Try Primary: open.er-api.com
    try {
      const primaryData = await CurrencyService.fetchOpenErApi();
      if (primaryData) return primaryData;
    } catch (err) {
      console.warn("[CurrencyService] Primary open.er-api.com failed:", err);
    }

    // 2. Try Fallback 1: exchangerate-api.com v4
    try {
      const fallback1Data = await CurrencyService.fetchExchangeRateV4();
      if (fallback1Data) return fallback1Data;
    } catch (err) {
      console.warn("[CurrencyService] Fallback exchangerate-api v4 failed:", err);
    }

    // 3. Try Fallback 2: jsdelivr FawazAhmed CDN mirror
    try {
      const fallback2Data = await CurrencyService.fetchFawazAhmed();
      if (fallback2Data) return fallback2Data;
    } catch (err) {
      console.warn("[CurrencyService] Fallback FawazAhmed CDN failed:", err);
    }

    return {
      value: null,
      source: "Open Exchange Rates API",
      sourceUrl: "https://open.er-api.com/v6/latest/USD",
      asOf: null,
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
      error: "All foreign exchange rate providers are temporarily unreachable.",
    };
  }

  /**
   * Primary: open.er-api.com
   */
  private static async fetchOpenErApi(): Promise<MarketData<CurrencyRatesData> | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const rawJson = await response.json();
      const parsed = ErApiResponseSchema.safeParse(rawJson);

      if (!parsed.success || parsed.data.result !== "success") {
        throw new Error(`Invalid schema from open.er-api: ${parsed.error?.message}`);
      }

      const rates = parsed.data.rates;
      const egpRate = rates["EGP"];
      if (!egpRate || egpRate <= 0) {
        throw new Error("Missing or invalid EGP rate in response");
      }

      const currencyList = CurrencyService.calculateCrossRates(rates, egpRate);

      return {
        value: {
          base: "USD",
          usdToEgp: Number(egpRate.toFixed(4)),
          currencies: currencyList,
          supportedCodes: currencyList.map((c) => c.code),
        },
        source: "Open Exchange Rates (open.er-api.com)",
        sourceUrl: "https://open.er-api.com/v6/latest/USD",
        asOf: parsed.data.time_last_update_utc || new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        status: "live",
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Fallback 1: api.exchangerate-api.com v4
   */
  private static async fetchExchangeRateV4(): Promise<MarketData<CurrencyRatesData> | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const rawJson = await response.json();
      const parsed = ExchangeRateApiV4Schema.safeParse(rawJson);

      if (!parsed.success) {
        throw new Error(`Invalid schema from exchangerate-api v4: ${parsed.error.message}`);
      }

      const rates = parsed.data.rates;
      const egpRate = rates["EGP"];
      if (!egpRate || egpRate <= 0) {
        throw new Error("Missing or invalid EGP rate in response");
      }

      const currencyList = CurrencyService.calculateCrossRates(rates, egpRate);

      return {
        value: {
          base: "USD",
          usdToEgp: Number(egpRate.toFixed(4)),
          currencies: currencyList,
          supportedCodes: currencyList.map((c) => c.code),
        },
        source: "ExchangeRate-API (v4)",
        sourceUrl: "https://api.exchangerate-api.com/v4/latest/USD",
        asOf: parsed.data.date,
        fetchedAt: new Date().toISOString(),
        status: "live",
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Fallback 2: jsdelivr currency-api mirror
   */
  private static async fetchFawazAhmed(): Promise<MarketData<CurrencyRatesData> | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
        {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const rawJson = await response.json();
      const parsed = FawazAhmedSchema.safeParse(rawJson);

      if (!parsed.success) {
        throw new Error(`Invalid schema from jsdelivr currency-api: ${parsed.error.message}`);
      }

      // Rates are in lowercase in fawazahmed
      const usdMap: Record<string, number> = {};
      for (const [k, v] of Object.entries(parsed.data.usd)) {
        usdMap[k.toUpperCase()] = v;
      }

      const egpRate = usdMap["EGP"];
      if (!egpRate || egpRate <= 0) {
        throw new Error("Missing or invalid EGP rate in response");
      }

      const currencyList = CurrencyService.calculateCrossRates(usdMap, egpRate);

      return {
        value: {
          base: "USD",
          usdToEgp: Number(egpRate.toFixed(4)),
          currencies: currencyList,
          supportedCodes: currencyList.map((c) => c.code),
        },
        source: "Currency-API Mirror (jsdelivr)",
        sourceUrl: "https://github.com/fawazahmed0/currency-api",
        asOf: parsed.data.date,
        fetchedAt: new Date().toISOString(),
        status: "live",
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Calculate cross rates relative to EGP:
   * e.g. EUR to EGP = rates.EGP / rates.EUR
   */
  public static calculateCrossRates(rates: Record<string, number>, egpRate: number): CurrencyItem[] {
    const trackedOrder = [
      "USD",
      "EUR",
      "GBP",
      "SAR",
      "AED",
      "KWD",
      "QAR",
      "BHD",
      "OMR",
      "CAD",
      "CHF",
      "JPY",
    ];

    const items: CurrencyItem[] = [];

    for (const code of trackedOrder) {
      const meta = CURRENCY_METADATA[code];
      if (!meta) continue;

      let rateToEgp = 0;
      if (code === "USD") {
        rateToEgp = egpRate;
      } else {
        const rateAgainstUsd = rates[code];
        if (rateAgainstUsd && rateAgainstUsd > 0) {
          rateToEgp = egpRate / rateAgainstUsd;
        }
      }

      if (rateToEgp > 0) {
        items.push({
          code,
          nameEn: meta.nameEn,
          nameAr: meta.nameAr,
          symbol: meta.symbol,
          rateToEgp: Number(rateToEgp.toFixed(4)),
          invertedRate: Number((1 / rateToEgp).toFixed(6)),
          flag: meta.flag,
        });
      }
    }

    return items;
  }
}
