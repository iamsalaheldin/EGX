/**
 * Standardized market data contracts & types for Egypt Markets Pulse
 */

export type DataStatus = "live" | "delayed" | "estimated" | "stale" | "unavailable";

export interface MarketData<T> {
  value: T | null;
  source: string;
  sourceUrl: string;
  asOf: string | null;
  fetchedAt: string;
  status: DataStatus;
  error?: string;
}

export interface CurrencyItem {
  code: string;
  nameEn: string;
  nameAr: string;
  symbol: string;
  rateToEgp: number;
  invertedRate: number; // 1 EGP = ? currency
  change24h?: number;
  change24hPercent?: number;
  flag: string;
}

export interface CurrencyRatesData {
  base: string;
  usdToEgp: number;
  currencies: CurrencyItem[];
  supportedCodes: string[];
}

export interface GoldKaratDetail {
  karat: string; // e.g. "24K", "21K", "18K", "Gold Pound"
  labelEn: string;
  labelAr: string;
  // Intrinsic calculated value based on global spot
  estimatedEgp: number;
  // Actual retail market quotes in Egypt (if available)
  retailSellEgp: number | null;
  retailBuyEgp: number | null;
  differenceEgp: number | null; // retailSell - estimatedEgp (local premium/spread)
  changeTodayEgp?: number;
  changeTodayPercent?: number;
}

export interface GoldData {
  international: {
    symbol: string;
    ounceUsd: number;
    updatedAt: string;
  };
  usdToEgpUsed: number;
  karats: {
    k24: GoldKaratDetail;
    k21: GoldKaratDetail;
    k18: GoldKaratDetail;
    pound: GoldKaratDetail;
  };
  hasLocalRetail: boolean;
  notes: {
    intrinsicDisclaimerEn: string;
    intrinsicDisclaimerAr: string;
    retailSourceEn: string;
    retailSourceAr: string;
  };
}

export interface EGXMarketStatus {
  isOpen: boolean;
  isPreOpen: boolean;
  isWeekend: boolean;
  sessionState: "open" | "pre_open" | "closed" | "weekend";
  sessionStateEn: string;
  sessionStateAr: string;
  cairoTime: string;
  tradingHours: string;
}

export interface EGXIndexInfo {
  id: string;
  name: string;
  nameAr: string;
  tradingViewSymbol: string;
  descriptionEn: string;
  descriptionAr: string;
  benchmark: boolean;
  latestValue?: number;
  change?: number;
  changePercent?: number;
}

export interface EGXData {
  marketStatus: EGXMarketStatus;
  indices: EGXIndexInfo[];
  exchangeName: string;
  exchangeUrl: string;
  tradingViewNotice: string;
}

export interface EconomicIndicatorItem {
  id: string;
  titleEn: string;
  titleAr: string;
  value: number;
  unit: string;
  frequency: "Monthly" | "Policy Decision" | "Quarterly";
  frequencyAr: string;
  reportingDate: string;
  periodLabelEn: string;
  periodLabelAr: string;
  changeFromPrior?: number;
  sourceAuthority: string;
  sourceUrl: string;
  noteEn?: string;
  noteAr?: string;
}

export interface EconomicData {
  headlineInflation: EconomicIndicatorItem;
  coreInflation: EconomicIndicatorItem;
  depositRate: EconomicIndicatorItem;
  lendingRate: EconomicIndicatorItem;
  mainOperationRate: EconomicIndicatorItem;
  discountRate: EconomicIndicatorItem;
  nextMpcMeeting: string;
  monetaryPolicySummaryEn: string;
  monetaryPolicySummaryAr: string;
}

export interface OverviewKpi {
  id: string;
  titleEn: string;
  titleAr: string;
  valueFormatted: string;
  numericValue: number;
  unit: string;
  changePercent?: number;
  status: DataStatus;
  source: string;
  asOf: string;
}

export interface OverviewData {
  timestamp: string;
  cairoTime: string;
  kpis: {
    egx30: OverviewKpi;
    egx70: OverviewKpi;
    usdEgp: OverviewKpi;
    sarEgp: OverviewKpi;
    gold21k: OverviewKpi;
    goldSpot: OverviewKpi;
    headlineInflation: OverviewKpi;
    overnightDeposit: OverviewKpi;
  };
  egxStatus: EGXMarketStatus;
}
