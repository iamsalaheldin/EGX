/**
 * Egyptian Stock Exchange (EGX) Provider & Market Status Engine
 * Handles index definitions, TradingView configuration, and Cairo session state
 */
import { EGXData, EGXIndexInfo, EGXMarketStatus, MarketData } from "../types.js";

export class EgxService {
  /**
   * Calculate exact Egyptian stock market status using Africa/Cairo timezone
   */
  public static getCairoMarketStatus(date: Date = new Date()): EGXMarketStatus {
    // Format date in Africa/Cairo timezone
    const cairoFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    const parts = cairoFormatter.formatToParts(date);
    let weekdayStr = "";
    let hour = 0;
    let minute = 0;

    for (const p of parts) {
      if (p.type === "weekday") weekdayStr = p.value;
      if (p.type === "hour") hour = parseInt(p.value, 10);
      if (p.type === "minute") minute = parseInt(p.value, 10);
    }

    // Days in Egypt: Friday & Saturday are weekend
    const isWeekend = weekdayStr === "Fri" || weekdayStr === "Sat";

    const totalMinutes = hour * 60 + minute;
    // Pre-opening: 09:30 (570m) to 10:00 (600m)
    // Continuous trading: 10:00 (600m) to 14:30 (870m)
    const isPreOpen = !isWeekend && totalMinutes >= 570 && totalMinutes < 600;
    const isOpen = !isWeekend && totalMinutes >= 600 && totalMinutes <= 870;

    let sessionState: "open" | "pre_open" | "closed" | "weekend" = "closed";
    let sessionStateEn = "Closed";
    let sessionStateAr = "مغلقة";

    if (isWeekend) {
      sessionState = "weekend";
      sessionStateEn = "Weekend Closed";
      sessionStateAr = "عطلة نهاية الأسبوع (مغلقة)";
    } else if (isPreOpen) {
      sessionState = "pre_open";
      sessionStateEn = "Pre-Opening Auction (09:30 - 10:00)";
      sessionStateAr = "جلسة ما قبل التداول (مزاد الفتح)";
    } else if (isOpen) {
      sessionState = "open";
      sessionStateEn = "Market Open (Trading Active)";
      sessionStateAr = "الجلسة مفتوحة (تداول نشط)";
    } else {
      sessionState = "closed";
      sessionStateEn = "Closed (Next session opens at 10:00 AM Cairo)";
      sessionStateAr = "مغلقة (تبدأ الجلسة القادمة 10:00 صباحاً بتوقيت القاهرة)";
    }

    const cairoTimeFormatted = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(date);

    return {
      isOpen,
      isPreOpen,
      isWeekend,
      sessionState,
      sessionStateEn,
      sessionStateAr,
      cairoTime: cairoTimeFormatted,
      tradingHours: "Sun - Thu: 10:00 AM – 2:30 PM (Cairo Time)",
    };
  }

  /**
   * Get EGX metadata, index definitions, and verified TradingView symbols
   */
  public static async getEgxData(): Promise<MarketData<EGXData>> {
    const marketStatus = EgxService.getCairoMarketStatus();

    const indices: EGXIndexInfo[] = [
      {
        id: "egx30",
        name: "EGX 30",
        nameAr: "المؤشر الرئيسي إيجي إكس 30",
        tradingViewSymbol: "EGX:EGX30",
        descriptionEn: "Benchmark index tracking the 30 most liquid & capitalized companies",
        descriptionAr: "المؤشر الرئيسي للبورصة يقيس أداء أنشط 30 شركة من حيث السيولة ورأس المال",
        benchmark: true,
      },
      {
        id: "egx70",
        name: "EGX 70 EWI",
        nameAr: "مؤشر الشركات الصغيرة والمتوسطة إيجي إكس 70 متساوي الأوزان",
        tradingViewSymbol: "EGX:EGX70EWI",
        descriptionEn: "Equal-weighted index tracking small and mid-cap companies",
        descriptionAr: "مؤشر متساوي الأوزان يقيس أداء 70 شركة متوسطة وصغيرة",
        benchmark: false,
      },
      {
        id: "egx100",
        name: "EGX 100 EWI",
        nameAr: "مؤشر السوق الواسع إيجي إكس 100 متساوي الأوزان",
        tradingViewSymbol: "EGX:EGX100EWI",
        descriptionEn: "Broad-market equal-weighted index combining EGX 30 & EGX 70",
        descriptionAr: "المؤشر الأوسع نطاقاً يضم الشركات المكونة لمؤشري إيجي إكس 30 و 70",
        benchmark: false,
      },
    ];

    const value: EGXData = {
      marketStatus,
      indices,
      exchangeName: "The Egyptian Exchange (EGX)",
      exchangeUrl: "https://www.egx.com.eg/",
      tradingViewNotice:
        "Charts are rendered directly via official TradingView advanced widgets with verified EGX symbols. EGX market data is subject to exchange delay policy during sessions.",
    };

    return {
      value,
      source: "TradingView & Egyptian Exchange (EGX)",
      sourceUrl: "https://www.tradingview.com/markets/stocks-egypt/",
      asOf: marketStatus.cairoTime,
      fetchedAt: new Date().toISOString(),
      status: marketStatus.isOpen ? "delayed" : "live",
    };
  }
}
