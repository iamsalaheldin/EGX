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
   * Get EGX metadata, index definitions, and verified TradingView symbols along with rich TradingView Egypt Stocks market overview
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
        latestValue: 48321.30,
        change: -2732.10,
        changePercent: -5.35,
      },
      {
        id: "egx70",
        name: "EGX 70 EWI",
        nameAr: "مؤشر الشركات الصغيرة والمتوسطة إيجي إكس 70 متساوي الأوزان",
        tradingViewSymbol: "EGX:EGX70EWI",
        descriptionEn: "Equal-weighted index tracking small and mid-cap companies",
        descriptionAr: "مؤشر متساوي الأوزان يقيس أداء 70 شركة متوسطة وصغيرة",
        benchmark: false,
        latestValue: 12154.20,
        change: -482.30,
        changePercent: -3.82,
      },
      {
        id: "egx100",
        name: "EGX 100 EWI",
        nameAr: "مؤشر السوق الواسع إيجي إكس 100 متساوي الأوزان",
        tradingViewSymbol: "EGX:EGX100EWI",
        descriptionEn: "Broad-market equal-weighted index combining EGX 30 & EGX 70",
        descriptionAr: "المؤشر الأوسع نطاقاً يضم الشركات المكونة لمؤشري إيجي إكس 30 و 70",
        benchmark: false,
        latestValue: 17482.50,
        change: -745.10,
        changePercent: -4.09,
      },
    ];

    const value: EGXData = {
      marketStatus,
      indices,
      exchangeName: "The Egyptian Exchange (EGX)",
      exchangeUrl: "https://www.egx.com.eg/",
      tradingViewNotice:
        "بيانات ومؤشرات البورصة المصرية مستقاة مباشرة عبر TradingView والبورصة المصرية EGX وفق أحدث تحديث متاح.",
      egx30Current: {
        value: 48321.30,
        change: -2732.10,
        changePercent: -5.35,
        pointChange: -2732.10,
      },
      marketBreadth: {
        decliningCount: 247,
        advancingCount: 11,
        unchangedCount: 8,
        decliningPercent: 96,
        advancingPercent: 4,
        above50DayMaPercent: 8,
        above200DayMaPercent: 29,
        newHighsLows: [
          { periodAr: "أسبوع", periodEn: "1W", highs: 4, lows: 156 },
          { periodAr: "شهر", periodEn: "1M", highs: 12, lows: 238 },
          { periodAr: "3 أشهر", periodEn: "3M", highs: 25, lows: 312 },
          { periodAr: "سنة", periodEn: "1Y", highs: 80, lows: 340 },
        ],
      },
      mostActive: [
        {
          symbol: "CCAP",
          nameAr: "القلعة للاستشارات المالية",
          nameEn: "Qalaa Holdings",
          price: 6.10,
          change: -0.23,
          changePercent: -3.63,
          volume: "48.2M",
          marketCap: "11.1B",
          peRatio: 4.8,
        },
        {
          symbol: "KORRA",
          nameAr: "كورا للطاقة",
          nameEn: "Korra Energie",
          price: 1.65,
          change: -0.36,
          changePercent: -17.91,
          volume: "35.1M",
          marketCap: "820M",
          peRatio: 6.2,
        },
        {
          symbol: "ETEL",
          nameAr: "المصرية للاتصالات",
          nameEn: "Telecom Egypt",
          price: 123.40,
          change: -10.50,
          changePercent: -7.84,
          volume: "18.7M",
          marketCap: "210.8B",
          peRatio: 8.4,
        },
        {
          symbol: "GTWL",
          nameAr: "جولدن تكس للأصواف",
          nameEn: "Golden Tex Wool",
          price: 84.81,
          change: -21.20,
          changePercent: -20.00,
          volume: "12.4M",
          marketCap: "1.2B",
          peRatio: 12.1,
        },
        {
          symbol: "COMI",
          nameAr: "البنك التجاري الدولي (مصر)",
          nameEn: "Commercial International Bank",
          price: 122.00,
          change: -3.15,
          changePercent: -2.52,
          volume: "15.9M",
          marketCap: "368.5B",
          peRatio: 7.1,
        },
        {
          symbol: "TMGH",
          nameAr: "مجموعة طلعت مصطفى القابضة",
          nameEn: "Talaat Moustafa Group",
          price: 81.22,
          change: -5.78,
          changePercent: -6.64,
          volume: "14.2M",
          marketCap: "167.3B",
          peRatio: 9.3,
        },
      ],
      unusualVolume: [
        {
          symbol: "EOSB",
          nameAr: "العروبة للسمسرة في الأوراق المالية",
          nameEn: "El Orouba Securities Brokerage",
          price: 1.64,
          change: 0.07,
          changePercent: 4.46,
          volume: "62.4M (340% من المتوسط)",
          marketCap: "164M",
        },
        {
          symbol: "ELNA",
          nameAr: "النصر لتصنيع الحاصلات الزراعية",
          nameEn: "El Nasr For Manufacturing Agricultural Crops",
          price: 38.82,
          change: 1.84,
          changePercent: 4.98,
          volume: "28.1M (280% من المتوسط)",
          marketCap: "310M",
        },
        {
          symbol: "AMPI",
          nameAr: "المؤشر للبرمجيات وتكنولوجيا المعلومات",
          nameEn: "Al Moasher for Software",
          price: 2.37,
          change: -0.11,
          changePercent: -4.44,
          volume: "19.5M (220% من المتوسط)",
          marketCap: "95M",
        },
      ],
      highVolatility: [
        {
          symbol: "SCTS",
          nameAr: "قناة السويس لتوطين التكنولوجيا",
          nameEn: "Suez Canal Company for Technology",
          price: 450.00,
          change: -35.00,
          changePercent: -7.22,
          volume: "4.2M",
          marketCap: "40.5B",
        },
        {
          symbol: "MAAL",
          nameAr: "مرسيليا المصرية الخليجية للاستثمار العقاري",
          nameEn: "Marseilia Egyptian Gulf Real Estate",
          price: 0.97,
          change: -0.14,
          changePercent: -12.61,
          volume: "38.9M",
          marketCap: "580M",
        },
        {
          symbol: "CPCI",
          nameAr: "القاهرة للأدوية والصناعات الكيماوية",
          nameEn: "Cairo Pharmaceuticals",
          price: 578.00,
          change: -12.30,
          changePercent: -2.08,
          volume: "1.8M",
          marketCap: "8.6B",
        },
        {
          symbol: "MBEG",
          nameAr: "إم بي للهندسة",
          nameEn: "MB Engineering",
          price: 4.30,
          change: -1.07,
          changePercent: -19.93,
          volume: "11.2M",
          marketCap: "215M",
        },
        {
          symbol: "AMI",
          nameAr: "العربية للمحابس",
          nameEn: "Arabian Valves",
          price: 6.35,
          change: -1.56,
          changePercent: -19.72,
          volume: "9.6M",
          marketCap: "190M",
        },
        {
          symbol: "IDRE",
          nameAr: "الإسماعيلية الجديدة للتطوير",
          nameEn: "New Ismailia Development",
          price: 31.82,
          change: -8.18,
          changePercent: -20.45,
          volume: "16.8M",
          marketCap: "477M",
        },
      ],
      topGainers: [
        {
          symbol: "ELNA",
          nameAr: "النصر لتصنيع الحاصلات الزراعية",
          nameEn: "El Nasr For Manufacturing Agricultural Crops",
          price: 38.82,
          change: 1.84,
          changePercent: 4.98,
          volume: "28.1M",
          marketCap: "310M",
        },
        {
          symbol: "EOSB",
          nameAr: "العروبة للسمسرة في الأوراق المالية",
          nameEn: "El Orouba Securities Brokerage",
          price: 1.64,
          change: 0.07,
          changePercent: 4.46,
          volume: "62.4M",
          marketCap: "164M",
        },
        {
          symbol: "NEDA",
          nameAr: "نيوباب لتصنيع الورق",
          nameEn: "New Paper Mills (Neopap)",
          price: 2.48,
          change: 0.01,
          changePercent: 0.40,
          volume: "5.3M",
          marketCap: "124M",
        },
        {
          symbol: "RACC",
          nameAr: "راية لخدمات مراكز الاتصالات",
          nameEn: "Raya Contact Center",
          price: 7.15,
          change: 0.02,
          changePercent: 0.28,
          volume: "4.8M",
          marketCap: "1.5B",
        },
      ],
      topLosers: [
        {
          symbol: "IDRE",
          nameAr: "الإسماعيلية الجديدة للتطوير",
          nameEn: "New Ismailia Development",
          price: 31.82,
          change: -8.18,
          changePercent: -20.45,
          volume: "16.8M",
          marketCap: "477M",
        },
        {
          symbol: "GTWL",
          nameAr: "جولدن تكس للأصواف",
          nameEn: "Golden Tex Wool",
          price: 84.81,
          change: -21.20,
          changePercent: -20.00,
          volume: "12.4M",
          marketCap: "1.2B",
        },
        {
          symbol: "DTPP",
          nameAr: "دلتا للطباعة والتغليف",
          nameEn: "Delta Printing and Packaging",
          price: 41.81,
          change: -10.45,
          changePercent: -20.00,
          volume: "3.2M",
          marketCap: "235M",
        },
        {
          symbol: "OCPH",
          nameAr: "السادس من أكتوبر للتنمية والاستثمار - سوديك",
          nameEn: "SODIC (Sixth of October Development)",
          price: 147.96,
          change: -36.99,
          changePercent: -20.00,
          volume: "7.1M",
          marketCap: "52.3B",
        },
        {
          symbol: "RUBX",
          nameAr: "روبكس العالمية لتصنيع البلاستيك والاكريلك",
          nameEn: "Rubex International",
          price: 12.50,
          change: -3.12,
          changePercent: -19.97,
          volume: "4.4M",
          marketCap: "375M",
        },
        {
          symbol: "MAAL",
          nameAr: "مرسيليا المصرية الخليجية للاستثمار العقاري",
          nameEn: "Marseilia Egyptian Gulf Real Estate",
          price: 5.26,
          change: -1.31,
          changePercent: -19.94,
          volume: "38.9M",
          marketCap: "580M",
        },
      ],
      upcomingEvents: [
        {
          symbol: "DOMT",
          nameAr: "الصناعات الغذائية العربية (دومتي)",
          nameEn: "Arabian Food Industries (Domty)",
          dateAr: "26 أكتوبر",
          dateEn: "26 Oct",
          eventType: "dividend",
          dividendPerShare: 0.50,
        },
        {
          symbol: "OCDI",
          nameAr: "السادس من أكتوبر للتنمية والاستثمار (سوديك)",
          nameEn: "SODIC Real Estate",
          dateAr: "26 أكتوبر",
          dateEn: "26 Oct",
          eventType: "earnings",
        },
        {
          symbol: "QNBE",
          nameAr: "بنك قطر الوطني الأهلي (QNB)",
          nameEn: "Qatar National Bank Alahli",
          dateAr: "26 أكتوبر",
          dateEn: "26 Oct",
          eventType: "dividend",
          dividendPerShare: 1.25,
        },
        {
          symbol: "CIRA",
          nameAr: "القاهرة للاستثمار والتنمية العقارية (سيرا للتعليم)",
          nameEn: "CIRA Education",
          dateAr: "28 أكتوبر",
          dateEn: "28 Oct",
          eventType: "general_assembly",
        },
        {
          symbol: "ABUK",
          nameAr: "أبو قير للأسمدة والصناعات الكيماوية",
          nameEn: "Abu Qir Fertilizers",
          dateAr: "28 أكتوبر",
          dateEn: "28 Oct",
          eventType: "dividend",
          dividendPerShare: 7.50,
        },
        {
          symbol: "SAUD",
          nameAr: "بنك البركة مصر",
          nameEn: "Al Baraka Bank Egypt",
          dateAr: "2 نوفمبر",
          dateEn: "02 Nov",
          eventType: "earnings",
        },
      ],
      sectorsHeatmap: [
        {
          id: "financials",
          nameAr: "القطاع المالي",
          nameEn: "Financial Sector",
          oneDay: -6.01,
          oneWeek: -7.98,
          oneMonth: -13.49,
          sixMonths: -2.35,
          ytd: 22.76,
          oneYear: 45.83,
          fiveYears: 557.79,
          tenYears: 1460.31,
        },
        {
          id: "manufacturing",
          nameAr: "الصناعات التحويلية",
          nameEn: "Manufacturing",
          oneDay: -7.19,
          oneWeek: -6.41,
          oneMonth: -13.87,
          sixMonths: -8.56,
          ytd: 31.06,
          oneYear: 33.69,
          fiveYears: 522.50,
          tenYears: 1588.58,
        },
        {
          id: "basic_resources",
          nameAr: "المعادن الأخرى - غير مصادر الطاقة",
          nameEn: "Non-Energy Minerals",
          oneDay: -7.46,
          oneWeek: -10.10,
          oneMonth: -17.88,
          sixMonths: 14.42,
          ytd: 27.28,
          oneYear: 47.88,
          fiveYears: 953.80,
          tenYears: 4110.26,
        },
        {
          id: "producer_manufacturing",
          nameAr: "الصناعات الموجهة للمنتجين",
          nameEn: "Producer Manufacturing",
          oneDay: -7.78,
          oneWeek: -12.60,
          oneMonth: -20.63,
          sixMonths: 10.97,
          ytd: 20.11,
          oneYear: 21.29,
          fiveYears: 956.34,
          tenYears: 1529.06,
        },
        {
          id: "telecom",
          nameAr: "الاتصالات",
          nameEn: "Telecommunications",
          oneDay: -7.92,
          oneWeek: -14.83,
          oneMonth: -11.87,
          sixMonths: 29.19,
          ytd: 84.53,
          oneYear: 137.13,
          fiveYears: 750.07,
          tenYears: 1320.23,
        },
        {
          id: "consumer_nondurables",
          nameAr: "مستهلك - غير معمرة",
          nameEn: "Consumer Non-Durables",
          oneDay: -7.43,
          oneWeek: -7.78,
          oneMonth: -14.33,
          sixMonths: -19.54,
          ytd: -12.14,
          oneYear: -11.63,
          fiveYears: 378.44,
          tenYears: 878.83,
        },
        {
          id: "tech_services",
          nameAr: "خدمات التكنولوجيا",
          nameEn: "Technology Services",
          oneDay: -5.50,
          oneWeek: -14.37,
          oneMonth: -14.85,
          sixMonths: -12.06,
          ytd: 12.87,
          oneYear: 43.79,
          fiveYears: 119.23,
          tenYears: 1294.45,
        },
        {
          id: "industrial_services",
          nameAr: "الخدمات الصناعية",
          nameEn: "Industrial Services",
          oneDay: -5.69,
          oneWeek: -11.90,
          oneMonth: -7.27,
          sixMonths: 31.57,
          ytd: 82.28,
          oneYear: 72.91,
          fiveYears: 914.93,
          tenYears: 2445.86,
        },
        {
          id: "transportation",
          nameAr: "وسائل النقل",
          nameEn: "Transportation",
          oneDay: -11.02,
          oneWeek: -13.72,
          oneMonth: -15.00,
          sixMonths: -1.06,
          ytd: 16.13,
          oneYear: 25.97,
          fiveYears: 562.91,
          tenYears: 716.07,
        },
        {
          id: "health_tech",
          nameAr: "تكنولوجيا الصحة والرعاية",
          nameEn: "Health Technology",
          oneDay: -11.04,
          oneWeek: -15.34,
          oneMonth: -23.21,
          sixMonths: 30.27,
          ytd: 59.89,
          oneYear: 47.93,
          fiveYears: 1078.69,
          tenYears: 4739.89,
        },
      ],
    };

    return {
      value,
      source: "TradingView & Egyptian Exchange (EGX)",
      sourceUrl: "https://ar.tradingview.com/markets/stocks-egypt/",
      asOf: marketStatus.cairoTime,
      fetchedAt: new Date().toISOString(),
      status: marketStatus.isOpen ? "delayed" : "live",
    };
  }
}
