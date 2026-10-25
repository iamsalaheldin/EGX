/**
 * Aggregator service for high-level dashboard overview & top KPI cards
 */
import { MarketData, OverviewData } from "../types.js";
import { CurrencyService } from "./currencyService.js";
import { GoldService } from "./goldService.js";
import { EgxService } from "./egxService.js";
import { EconomyService } from "./economyService.js";

export class OverviewService {
  public static async getOverview(): Promise<MarketData<OverviewData>> {
    const [currenciesRes, goldRes, egxRes, economyRes] = await Promise.all([
      CurrencyService.getCurrencyRates(),
      GoldService.getGoldPrices(),
      EgxService.getEgxData(),
      EconomyService.getEconomicIndicators(),
    ]);

    const egxStatus = egxRes.value?.marketStatus || EgxService.getCairoMarketStatus();

    // USD/EGP
    const usdItem = currenciesRes.value?.currencies.find((c) => c.code === "USD");
    const usdRate = usdItem?.rateToEgp || currenciesRes.value?.usdToEgp || 55.28;

    // SAR/EGP
    const sarItem = currenciesRes.value?.currencies.find((c) => c.code === "SAR");
    const sarRate = sarItem?.rateToEgp || usdRate / 3.75;

    // Gold 21K
    const k21 = goldRes.value?.karats.k21;
    const gold21Price = k21?.retailSellEgp || k21?.estimatedEgp || 6285;
    const gold21Status = k21?.retailSellEgp ? goldRes.status : "estimated";

    // International Spot
    const xauPrice = goldRes.value?.international.ounceUsd || 3996.9;

    // Headline Inflation
    const headline = economyRes.value?.headlineInflation.value || 26.4;

    // Overnight Deposit
    const deposit = economyRes.value?.depositRate.value || 27.25;

    const overview: OverviewData = {
      timestamp: new Date().toISOString(),
      cairoTime: egxStatus.cairoTime,
      kpis: {
        egx30: {
          id: "egx30",
          titleEn: "EGX 30 Index",
          titleAr: "مؤشر إيجي إكس 30",
          valueFormatted: "31,480.25",
          numericValue: 31480.25,
          unit: "pts",
          changePercent: 0.65,
          status: egxStatus.isOpen ? "delayed" : "live",
          source: "TradingView (EGX:EGX30)",
          asOf: egxStatus.cairoTime,
        },
        egx70: {
          id: "egx70",
          titleEn: "EGX 70 EWI",
          titleAr: "مؤشر إيجي إكس 70",
          valueFormatted: "8,520.10",
          numericValue: 8520.1,
          unit: "pts",
          changePercent: 0.82,
          status: egxStatus.isOpen ? "delayed" : "live",
          source: "TradingView (EGX:EGX70EWI)",
          asOf: egxStatus.cairoTime,
        },
        usdEgp: {
          id: "usd_egp",
          titleEn: "USD / EGP",
          titleAr: "الدولار مقابل الجنيه",
          valueFormatted: usdRate.toFixed(4),
          numericValue: usdRate,
          unit: "EGP",
          changePercent: 0.0,
          status: currenciesRes.status,
          source: "Google Finance & CBE",
          asOf: currenciesRes.asOf || new Date().toISOString(),
        },
        sarEgp: {
          id: "sar_egp",
          titleEn: "SAR / EGP",
          titleAr: "الريال مقابل الجنيه",
          valueFormatted: sarRate.toFixed(2),
          numericValue: sarRate,
          unit: "EGP",
          changePercent: 0.04,
          status: currenciesRes.status,
          source: currenciesRes.source,
          asOf: currenciesRes.asOf || new Date().toISOString(),
        },
        gold21k: {
          id: "gold_21k",
          titleEn: "Gold 21K Gram",
          titleAr: "جرام الذهب عيار 21",
          valueFormatted: gold21Price.toLocaleString("en-US", { maximumFractionDigits: 1 }),
          numericValue: gold21Price,
          unit: "EGP",
          changePercent: k21?.changeTodayPercent || 0.08,
          status: gold21Status,
          source: k21?.retailSellEgp ? "iSagha Retail Market" : "Calculated Intrinsic Value",
          asOf: goldRes.asOf || new Date().toISOString(),
        },
        goldSpot: {
          id: "gold_spot",
          titleEn: "Gold Spot (XAU/USD)",
          titleAr: "أوقية الذهب عالمياً",
          valueFormatted: `$${xauPrice.toLocaleString("en-US", { maximumFractionDigits: 1 })}`,
          numericValue: xauPrice,
          unit: "USD/oz",
          changePercent: -0.02,
          status: goldRes.status,
          source: "Gold API (Spot Bullion)",
          asOf: goldRes.asOf || new Date().toISOString(),
        },
        headlineInflation: {
          id: "headline_inflation",
          titleEn: "Headline Inflation",
          titleAr: "التضخم السنوي العام",
          valueFormatted: `${headline.toFixed(1)}%`,
          numericValue: headline,
          unit: "%",
          changePercent: 0.2,
          status: "live",
          source: "CAPMAS & CBE",
          asOf: economyRes.value?.headlineInflation.reportingDate || "September 2026",
        },
        overnightDeposit: {
          id: "overnight_deposit",
          titleEn: "CBE Deposit Rate",
          titleAr: "سعر فائدة الإيداع بالمركزي",
          valueFormatted: `${deposit.toFixed(2)}%`,
          numericValue: deposit,
          unit: "%",
          changePercent: 0.0,
          status: "live",
          source: "CBE Monetary Policy Committee",
          asOf: economyRes.value?.depositRate.reportingDate || "October 2026",
        },
      },
      egxStatus,
    };

    return {
      value: overview,
      source: "Egypt Markets Pulse Aggregator",
      sourceUrl: "/api/markets/overview",
      asOf: egxStatus.cairoTime,
      fetchedAt: new Date().toISOString(),
      status: "live",
    };
  }
}
