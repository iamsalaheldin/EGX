/**
 * Gold Market Provider
 * Handles International Gold Spot (XAU/USD) via api.gold-api.com
 * Handles Egyptian Local Retail Gold via iSagha parser
 * Calculates intrinsic karat values (24K, 21K, 18K, Gold Pound)
 */
import { z } from "zod";
import { GoldData, GoldKaratDetail, MarketData } from "../types.js";
import { MarketCache } from "../cache.js";
import { CurrencyService } from "./currencyService.js";

const GoldApiResponseSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  currency: z.string(),
  updatedAt: z.string().optional(),
  name: z.string().optional(),
});

// Standard troy ounce in grams
export const TROY_OUNCE_IN_GRAMS = 31.1034768;

export interface RetailQuotes {
  k24?: { sell: number; buy: number; changeEgp?: number; changePercent?: number };
  k21?: { sell: number; buy: number; changeEgp?: number; changePercent?: number };
  k18?: { sell: number; buy: number; changeEgp?: number; changePercent?: number };
  pound?: { sell: number; buy: number; changeEgp?: number; changePercent?: number };
}

export class GoldService {
  private static CACHE_KEY = "market_gold";
  private static CACHE_TTL_MS = 60 * 1000; // 60 seconds

  /**
   * Main entry point
   */
  static async getGoldPrices(): Promise<MarketData<GoldData>> {
    return MarketCache.wrap<GoldData>({
      key: GoldService.CACHE_KEY,
      ttlMs: GoldService.CACHE_TTL_MS,
      defaultSource: "Gold API & Local Egyptian Retail Market",
      defaultSourceUrl: "https://gold-api.com",
      fetcher: () => GoldService.fetchAndCompute(),
    });
  }

  /**
   * Fetch spot price, fetch local quotes, and compute intrinsic figures
   */
  private static async fetchAndCompute(): Promise<MarketData<GoldData>> {
    // 1. Fetch USD/EGP rate for conversion
    let usdToEgp = 55.28;
    try {
      const curData = await CurrencyService.getCurrencyRates();
      if (curData.value && curData.value.usdToEgp > 0) {
        usdToEgp = curData.value.usdToEgp;
      }
    } catch (err) {
      console.warn("[GoldService] Could not get live USD/EGP for gold conversion, using baseline:", err);
    }

    // 2. Fetch International Gold Spot
    const spotResult = await GoldService.fetchInternationalSpot();

    // 3. Fetch Egyptian Local Retail Quotes (iSagha)
    const localQuotes = await GoldService.fetchLocalRetailQuotes();

    let goldOunceUsd = 3996.9;
    let updatedAt = new Date().toISOString();
    let spotStatus: "live" | "stale" = "live";

    if (spotResult.success && spotResult.price) {
      goldOunceUsd = spotResult.price;
      updatedAt = spotResult.updatedAt || new Date().toISOString();
    } else {
      console.warn("[GoldService] Live spot fetch failed, using verified baseline snapshot:", spotResult.error);
      spotStatus = "stale";
    }

    // Formulas:
    // gold24EGP = (goldOunceUSD / 31.1034768) * usdToEgp
    // gold21EGP = gold24EGP * (21 / 24)
    // gold18EGP = gold24EGP * (18 / 24)
    // goldPoundEGP = gold21EGP * 8
    const gold24Est = (goldOunceUsd / TROY_OUNCE_IN_GRAMS) * usdToEgp;
    const gold21Est = gold24Est * (21 / 24);
    const gold18Est = gold24Est * (18 / 24);
    const goldPoundEst = gold21Est * 8;

    const buildKarat = (
      karat: string,
      labelEn: string,
      labelAr: string,
      estEgp: number,
      retail?: { sell: number; buy: number; changeEgp?: number; changePercent?: number }
    ): GoldKaratDetail => {
      const roundedEst = Number(estEgp.toFixed(2));
      const sell = retail ? retail.sell : null;
      const buy = retail ? retail.buy : null;
      const diff = sell ? Number((sell - roundedEst).toFixed(2)) : null;

      return {
        karat,
        labelEn,
        labelAr,
        estimatedEgp: roundedEst,
        retailSellEgp: sell,
        retailBuyEgp: buy,
        differenceEgp: diff,
        changeTodayEgp: retail?.changeEgp,
        changeTodayPercent: retail?.changePercent,
      };
    };

    const hasLocal = !!(localQuotes && (localQuotes.k21?.sell || localQuotes.k24?.sell));

    const goldData: GoldData = {
      international: {
        symbol: "XAU",
        ounceUsd: Number(goldOunceUsd.toFixed(2)),
        updatedAt,
      },
      usdToEgpUsed: usdToEgp,
      karats: {
        k24: buildKarat("24K", "Gold 24K (Fine Gold)", "ذهب عيار 24 (ذهب بندقي خالص)", gold24Est, localQuotes?.k24),
        k21: buildKarat("21K", "Gold 21K (Egyptian Standard)", "ذهب عيار 21 (الأكثر تداولاً)", gold21Est, localQuotes?.k21),
        k18: buildKarat("18K", "Gold 18K (Jewelry Standard)", "ذهب عيار 18 (المجوهرات)", gold18Est, localQuotes?.k18),
        pound: buildKarat("Pound", "Egyptian Gold Pound (8g 21K)", "الجنيه الذهب (8 جرام عيار 21)", goldPoundEst, localQuotes?.pound),
      },
      hasLocalRetail: hasLocal,
      notes: {
        intrinsicDisclaimerEn:
          "Estimated intrinsic gold value — not an Egyptian retail quotation. Excludes dealer premiums, fabrication charges (masna'iyya), local taxes, and retail stamp duties.",
        intrinsicDisclaimerAr:
          "القيمة الجوهرية التقديرية للذهب بناءً على البورصة العالمية — وليست تسعيرة تجزئة لمحال الصاغة المصرية. لا تشمل المصنعية، الدمغة، أو ضريبة القيمة المضافة.",
        retailSourceEn: hasLocal ? "iSagha Live Egyptian Retail Market" : "Calculated from Global Spot",
        retailSourceAr: hasLocal ? "منصة آي صاغة للتسعير المحلي في مصر" : "محسوبة رياضياً من سعر الأوقية العالمية",
      },
    };

    return {
      value: goldData,
      source: hasLocal
        ? "Gold API (Spot) & iSagha (Local Retail)"
        : "Gold API (api.gold-api.com)",
      sourceUrl: "https://gold-api.com/price/XAU",
      asOf: updatedAt,
      fetchedAt: new Date().toISOString(),
      status: spotStatus === "stale" ? "stale" : hasLocal ? "live" : "estimated",
    };
  }

  /**
   * Fetch spot price from gold-api.com
   */
  private static async fetchInternationalSpot(): Promise<{
    success: boolean;
    price?: number;
    updatedAt?: string;
    error?: string;
  }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch("https://api.gold-api.com/price/XAU", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const raw = await response.json();
      const parsed = GoldApiResponseSchema.safeParse(raw);

      if (!parsed.success) {
        throw new Error(`Invalid schema from gold-api: ${parsed.error.message}`);
      }

      return {
        success: true,
        price: parsed.data.price,
        updatedAt: parsed.data.updatedAt,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Fetch Egyptian Local Retail Prices from iSagha
   */
  public static async fetchLocalRetailQuotes(): Promise<RetailQuotes | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch("https://market.isagha.com/prices", {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml",
        },
      });

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      return GoldService.parseIsaghaHtml(html);
    } catch (err) {
      console.warn("[GoldService] iSagha scrape attempt failed:", err);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Robust parser for iSagha prices table
   */
  public static parseIsaghaHtml(html: string): RetailQuotes | null {
    if (!html || !html.includes("عيار")) {
      return null;
    }

    // Find main table to avoid matching meta tags or navigation
    const tableStart = html.indexOf("<table");
    const tableEnd = html.indexOf("</table>", tableStart);
    if (tableStart === -1 || tableEnd === -1) {
      return null;
    }

    const tableHtml = html.slice(tableStart, tableEnd + 8);
    const cleanTable = tableHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

    const quotes: RetailQuotes = {};

    // Helper for 24K, 21K, 18K where karat number is at index 0
    const extractGramKarat = (
      label: string
    ): { sell: number; buy: number; changeEgp?: number; changePercent?: number } | null => {
      const idx = cleanTable.indexOf(label);
      if (idx === -1) return null;

      const snippet = cleanTable.slice(idx, idx + 150);
      const nums = snippet.match(/\d+(?:\.\d+)?/g);
      if (!nums || nums.length < 4) return null;

      // nums[0] is karat (e.g. 24, 21, 18)
      // nums[1] is sell price
      // nums[2] is sell gap
      // nums[3] is buy price
      // nums[5] is change EGP
      // nums[6] is change %
      const sell = parseFloat(nums[1]);
      const buy = parseFloat(nums[3]);

      if (isNaN(sell) || sell <= 0) return null;

      return {
        sell,
        buy: isNaN(buy) ? sell * 0.985 : buy,
        changeEgp: nums[5] ? parseFloat(nums[5]) : undefined,
        changePercent: nums[6] ? parseFloat(nums[6]) : undefined,
      };
    };

    // Helper for Gold Pound (8g 21k) where there is no karat prefix
    const extractPound = (): {
      sell: number;
      buy: number;
      changeEgp?: number;
      changePercent?: number;
    } | null => {
      const idx = cleanTable.indexOf("جنيه ذهب");
      if (idx === -1) return null;

      const snippet = cleanTable.slice(idx, idx + 150);
      const nums = snippet.match(/\d+(?:\.\d+)?/g);
      if (!nums || nums.length < 3) return null;

      // nums[0] is sell price (e.g. 50280)
      // nums[1] is sell gap
      // nums[2] is buy price (e.g. 49880)
      // nums[4] is change EGP
      // nums[5] is change %
      const sell = parseFloat(nums[0]);
      const buy = parseFloat(nums[2]);

      if (isNaN(sell) || sell <= 0) return null;

      return {
        sell,
        buy: isNaN(buy) ? sell * 0.985 : buy,
        changeEgp: nums[4] ? parseFloat(nums[4]) : undefined,
        changePercent: nums[5] ? parseFloat(nums[5]) : undefined,
      };
    };

    const k24 = extractGramKarat("عيار 24");
    if (k24) quotes.k24 = k24;

    const k21 = extractGramKarat("عيار 21");
    if (k21) quotes.k21 = k21;

    const k18 = extractGramKarat("عيار 18");
    if (k18) quotes.k18 = k18;

    const pound = extractPound();
    if (pound) quotes.pound = pound;

    return Object.keys(quotes).length > 0 ? quotes : null;
  }
}
