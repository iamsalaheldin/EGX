export type Language = "ar" | "en";

export interface Translations {
  appName: string;
  appTagline: string;
  navEgx: string;
  navCurrencies: string;
  navGold: string;
  navEconomy: string;
  cairoTime: string;
  lastUpdated: string;
  refreshing: string;
  refreshBtn: string;
  statusLive: string;
  statusDelayed: string;
  statusEstimated: string;
  statusStale: string;
  statusUnavailable: string;
  marketOpen: string;
  marketClosed: string;
  marketPreOpen: string;
  marketWeekend: string;
  
  // KPI Strip
  kpiEgx30: string;
  kpiEgx70: string;
  kpiUsdEgp: string;
  kpiSarEgp: string;
  kpiGold21: string;
  kpiGoldSpot: string;
  kpiInflation: string;
  kpiInterestRate: string;

  // EGX Section
  egxSectionTitle: string;
  egxSectionSubtitle: string;
  chartEgx30: string;
  chartEgx70: string;
  chartEgx100: string;
  chartGoldSpot: string;
  chartUsdEgp: string;
  egxNotice: string;
  tradingHoursLabel: string;
  officialExchangeLink: string;

  // Currencies Section
  currenciesSectionTitle: string;
  currenciesSectionSubtitle: string;
  searchCurrencyPlaceholder: string;
  colCurrency: string;
  colRateToEgp: string;
  colInvertedRate: string;
  colStatus: string;
  sourceGoogle: string;
  sourceCbe: string;
  sourceCompare: string;
  colGoogleRate: string;
  colCbeBuy: string;
  colCbeSell: string;
  cbeNoticeText: string;
  currencyChartTitle: string;
  currencyChartSubtitle: string;
  toggleChartShow: string;
  toggleChartHide: string;
  calculatorTitle: string;
  calculatorSubtitle: string;
  amountLabel: string;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: string;
  swapBtn: string;
  rateFormulaLabel: string;
  cbeRatesNotice: string;
  viewCbeRates: string;

  // Gold Section
  goldSectionTitle: string;
  goldSectionSubtitle: string;
  retailSellPrice: string;
  retailBuyPrice: string;
  intrinsicValue: string;
  localPremium: string;
  perGram: string;
  perOunce: string;
  goldCalculatorTitle: string;
  goldCalculatorSubtitle: string;
  selectKarat: string;
  weightGrams: string;
  workmanshipFee: string;
  workmanshipHint: string;
  totalEstimatedCost: string;
  goldPoundUnits: string;
  intrinsicDisclaimer: string;

  // Economy Section
  economySectionTitle: string;
  economySectionSubtitle: string;
  headlineInflationTitle: string;
  coreInflationTitle: string;
  depositRateTitle: string;
  lendingRateTitle: string;
  mainOperationRateTitle: string;
  discountRateTitle: string;
  reportingDateLabel: string;
  nextMeetingLabel: string;
  policySummaryTitle: string;
  officialCbeLink: string;

  // Footer & Status
  footerReliabilityTitle: string;
  footerReliabilityText: string;
  sourcesTitle: string;
  disclaimerText: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: "نبض الأسواق المصرية",
    appTagline: "لوحة المتابعة اللحظية للاقتصاد والبورصة والعملات والذهب في مصر",
    navEgx: "البورصة المصرية",
    navCurrencies: "أسعار العملات",
    navGold: "سوق الذهب",
    navEconomy: "المؤشرات الاقتصادية",
    cairoTime: "توقيت القاهرة",
    lastUpdated: "آخر تحديث",
    refreshing: "جاري التحديث...",
    refreshBtn: "تحديث البيانات",
    statusLive: "مباشر",
    statusDelayed: "متأخر 15 دقيقة",
    statusEstimated: "قيمة تقديرية",
    statusStale: "بيانات سابقة",
    statusUnavailable: "غير متاح حالياً",
    marketOpen: "جلسة التداول مفتوحة",
    marketClosed: "السوق مغلق",
    marketPreOpen: "مزاد جلسة الفتح",
    marketWeekend: "عطلة نهاية الأسبوع",

    kpiEgx30: "إيجي إكس 30",
    kpiEgx70: "إيجي إكس 70",
    kpiUsdEgp: "الدولار مقابل الجنيه",
    kpiSarEgp: "الريال مقابل الجنيه",
    kpiGold21: "ذهب عيار 21",
    kpiGoldSpot: "أوقية الذهب عالمياً",
    kpiInflation: "التضخم السنوي",
    kpiInterestRate: "عائد الإيداع بالمركزي",

    egxSectionTitle: "البورصة المصرية (EGX)",
    egxSectionSubtitle: "مخططات بيانية تفاعلية متقدمة للمؤشرات الرئيسية مدعومة من TradingView",
    chartEgx30: "مؤشر EGX 30",
    chartEgx70: "مؤشر EGX 70 EWI",
    chartEgx100: "مؤشر EGX 100 EWI",
    chartGoldSpot: "الذهب عالمياً (XAU/USD)",
    chartUsdEgp: "الدولار / الجنيه (USD/EGP)",
    egxNotice: "بيانات أسعار الأسهم والمؤشرات تخضع لسياسة التأخير المعمول بها في البورصة المصرية (15 دقيقة خلال الجلسة). مواعيد التداول من الأحد إلى الخميس من 10:00 ص إلى 2:30 م بتوقيت القاهرة.",
    tradingHoursLabel: "مواعيد التداول",
    officialExchangeLink: "الموقع الرسمي للبورصة المصرية",

    currenciesSectionTitle: "أسعار صرف العملات مقابل الجنيه المصري",
    currenciesSectionSubtitle: "أسعار الصرف المرجعية بين البنوك وحاسبة تحويل العملات اللحظية",
    searchCurrencyPlaceholder: "ابحث باسم العملة أو الرمز (مثال: USD, ريال, يورو)...",
    colCurrency: "العملة",
    colRateToEgp: "السعر بالجنيه (EGP)",
    colInvertedRate: "الجنيه الواحد يعادل",
    colStatus: "حالة البيانات",
    sourceGoogle: "جوجل فاينانس (سعر السوق المباشر)",
    sourceCbe: "البنك المركزي المصري (الأسعار الرسمية)",
    sourceCompare: "مقارنة المصدرين معاً",
    colGoogleRate: "سعر جوجل (EGP)",
    colCbeBuy: "شراء المركزي",
    colCbeSell: "بيع المركزي",
    cbeNoticeText: "نشرة أسعار الصرف الرسمية المعلنة من البنك المركزي المصري بالبنوك العاملة في مصر.",
    currencyChartTitle: "مخطط التداول المباشر للعملات (TradingView)",
    currencyChartSubtitle: "تحليل حركة سعر صرف العملات مقابل الجنيه المصري لحظياً من خلال منصة TradingView",
    toggleChartShow: "عرض مخطط TradingView",
    toggleChartHide: "إخفاء المخطط",
    calculatorTitle: "حاسبة تحويل العملات",
    calculatorSubtitle: "تحويل فوري ودقيق بين الجنيه المصري والعملات العالمية",
    amountLabel: "المبلغ",
    fromCurrency: "من",
    toCurrency: "إلى",
    convertedAmount: "القيمة المحولة",
    swapBtn: "تبديل",
    rateFormulaLabel: "سعر الصرف المطبق",
    cbeRatesNotice: "هذه أسعار صرف مرجعية بين البنوك. للاطلاع على أسعار شراء وبيع البنوك الرسمية المعتمدة من البنك المركزي المصري:",
    viewCbeRates: "نشرة أسعار الصرف بالبنك المركزي المصري",

    goldSectionTitle: "سوق الذهب والعيارات",
    goldSectionSubtitle: "مقارنة دقيقة بين أسعار الصاغة المصرية والقيمة الجوهرية وفقاً للبورصة العالمية",
    retailSellPrice: "سعر البيع (للعميل)",
    retailBuyPrice: "سعر الشراء (من العميل)",
    intrinsicValue: "القيمة الجوهرية العالمية",
    localPremium: "الفارق السعري المحلي",
    perGram: "جنيه / جرام",
    perOunce: "دولار / أوقية",
    goldCalculatorTitle: "حاسبة تكلفة الذهب والجرامات",
    goldCalculatorSubtitle: "احسب القيمة الإجمالية للذهب مع تقدير متوسط المصنعية",
    selectKarat: "العيار المطلوب",
    weightGrams: "الوزن بالجرام",
    workmanshipFee: "المصنعية التقديرية للجرام (جنيه)",
    workmanshipHint: "تتراوح المصنعية عادة بين 80 إلى 250 جنيهاً حسب نوع المشغولات والشركة",
    totalEstimatedCost: "التكلفة الإجمالية التقديرية",
    goldPoundUnits: "عدد الجنيهات الذهبية",
    intrinsicDisclaimer: "القيمة الجوهرية التقديرية محسوبة استناداً إلى سعر الأوقية في البورصة العالمية (XAU/USD) وسعر الدولار، ولا تتضمن المصنعية أو الدمغة أو ضريبة القيمة المضافة. أسعار الصاغة معتمدة من سوق الذهب المحلي.",

    economySectionTitle: "المؤشرات الاقتصادية للبنك المركزي المصري",
    economySectionSubtitle: "أسعار الفائدة الرسمية ومعدلات التضخم وفقاً لقرارات لجنة السياسة النقدية وبيانات الجهاز المركزي",
    headlineInflationTitle: "التضخم العام السنوي",
    coreInflationTitle: "التضخم الأساسي السنوي",
    depositRateTitle: "سعر عائد الإيداع (Overnight)",
    lendingRateTitle: "سعر عائد الإقراض (Overnight)",
    mainOperationRateTitle: "العملية الرئيسية للبنك المركزي",
    discountRateTitle: "سعر الائتمان والخصم",
    reportingDateLabel: "تاريخ البيان / القرار",
    nextMeetingLabel: "الاجتماع القادم للجنة السياسة النقدية",
    policySummaryTitle: "ملخص موقف السياسة النقدية",
    officialCbeLink: "بوابة الأبحاث الاقتصادية بالبنك المركزي المصري",

    footerReliabilityTitle: "ميثاق دقة البيانات والشفافية",
    footerReliabilityText: "يلتزم تطبيق 'نبض الأسواق المصرية' بالفصل الصارم بين البيانات اللحظية والبيانات التقديرية والمتأخرة. لا يتم استخدام أي قيم مصطنعة، ويتم عرض توقيت الرصد الدقيق لكل مؤشر مع روابط المصادر الرسمية.",
    sourcesTitle: "المصادر المعتمدة",
    disclaimerText: "المعلومات المعروضة للأغراض الإرشادية والمعرفية الشخصية فقط ولا تشكل توصية مالية أو استثمارية بالبيع أو الشراء. الأسعار الفعلية في البنوك ومحال الصاغة قد تختلف بحسب العمولات والمصنعيات.",
  },
  en: {
    appName: "Egypt Markets Pulse",
    appTagline: "Real-time personal financial dashboard for the Egyptian economy, stock exchange, currencies & gold",
    navEgx: "Stock Exchange",
    navCurrencies: "Exchange Rates",
    navGold: "Gold Market",
    navEconomy: "Economic Indicators",
    cairoTime: "Cairo Time",
    lastUpdated: "Last Updated",
    refreshing: "Refreshing...",
    refreshBtn: "Refresh Data",
    statusLive: "Live",
    statusDelayed: "Delayed 15m",
    statusEstimated: "Estimated Value",
    statusStale: "Cached (Stale)",
    statusUnavailable: "Unavailable",
    marketOpen: "Market Open",
    marketClosed: "Market Closed",
    marketPreOpen: "Pre-Opening Auction",
    marketWeekend: "Weekend Closed",

    kpiEgx30: "EGX 30 Index",
    kpiEgx70: "EGX 70 EWI",
    kpiUsdEgp: "USD / EGP",
    kpiSarEgp: "SAR / EGP",
    kpiGold21: "Gold 21K Gram",
    kpiGoldSpot: "Gold Spot (XAU/USD)",
    kpiInflation: "Annual Inflation",
    kpiInterestRate: "CBE Deposit Rate",

    egxSectionTitle: "The Egyptian Exchange (EGX)",
    egxSectionSubtitle: "Advanced interactive charts for benchmark indices powered by TradingView",
    chartEgx30: "EGX 30 Index",
    chartEgx70: "EGX 70 EWI",
    chartEgx100: "EGX 100 EWI",
    chartGoldSpot: "Gold Spot (XAU/USD)",
    chartUsdEgp: "USD / EGP (Fx Rate)",
    egxNotice: "Stock and index price feeds are subject to Egyptian Exchange delay policies (15 minutes during continuous trading). Regular trading hours are Sunday to Thursday from 10:00 AM to 2:30 PM Cairo Time.",
    tradingHoursLabel: "Trading Hours",
    officialExchangeLink: "Official Egyptian Exchange Portal",

    currenciesSectionTitle: "Foreign Exchange Rates vs Egyptian Pound",
    currenciesSectionSubtitle: "Interbank indicative exchange rates and real-time bidirectional currency conversion",
    searchCurrencyPlaceholder: "Search by currency name or code (e.g., USD, Riyal, EUR)...",
    colCurrency: "Currency",
    colRateToEgp: "Rate in EGP",
    colInvertedRate: "1 EGP Equals",
    colStatus: "Data Status",
    sourceGoogle: "Google Finance (Live Market)",
    sourceCbe: "Central Bank of Egypt (Official)",
    sourceCompare: "Compare Both Sources",
    colGoogleRate: "Google Rate (EGP)",
    colCbeBuy: "CBE Buy",
    colCbeSell: "CBE Sell",
    cbeNoticeText: "Official commercial banking exchange rates published by the Central Bank of Egypt.",
    currencyChartTitle: "TradingView Currency Exchange Chart",
    currencyChartSubtitle: "Real-time technical analysis and candlestick charts for foreign currencies vs EGP powered by TradingView",
    toggleChartShow: "Show TradingView Chart",
    toggleChartHide: "Hide Chart",
    calculatorTitle: "Currency Conversion Calculator",
    calculatorSubtitle: "Instant, precision calculation between EGP and major global currencies",
    amountLabel: "Amount",
    fromCurrency: "From",
    toCurrency: "To",
    convertedAmount: "Converted Value",
    swapBtn: "Swap",
    rateFormulaLabel: "Applied Exchange Rate",
    cbeRatesNotice: "These are interbank reference rates. To view official buying and selling prices published by the Central Bank of Egypt:",
    viewCbeRates: "Central Bank of Egypt Exchange Rates Bulletin",

    goldSectionTitle: "Gold Market & Karat Pricing",
    goldSectionSubtitle: "Comprehensive comparison between Egyptian retail jewelry quotes and intrinsic global bullion value",
    retailSellPrice: "Dealer Selling Price",
    retailBuyPrice: "Dealer Buying Price",
    intrinsicValue: "Global Intrinsic Value",
    localPremium: "Local Price Spread",
    perGram: "EGP / Gram",
    perOunce: "USD / Troy Oz",
    goldCalculatorTitle: "Gold Weight & Cost Calculator",
    goldCalculatorSubtitle: "Calculate total gold price with custom gram weight and estimated workmanship fees",
    selectKarat: "Selected Karat",
    weightGrams: "Weight in Grams",
    workmanshipFee: "Est. Workmanship (Masna'iyya) per Gram",
    workmanshipHint: "Fabrication fees typically range between 80 to 250 EGP/gram depending on craftsmanship and manufacturer",
    totalEstimatedCost: "Estimated Total Cost",
    goldPoundUnits: "Number of Gold Pounds",
    intrinsicDisclaimer: "Estimated intrinsic gold value is derived from the international spot price (XAU/USD) and USD/EGP exchange rate. It excludes retail jeweler markup, workmanship (masna'iyya), hallmark stamp taxes, and VAT. Egyptian retail prices are sourced from the local gold market.",

    economySectionTitle: "Central Bank of Egypt Macroeconomic Indicators",
    economySectionSubtitle: "Official policy interest rates and inflation figures from Monetary Policy Committee decisions and CAPMAS",
    headlineInflationTitle: "Headline Inflation (Urban)",
    coreInflationTitle: "Core Inflation (CBE Metric)",
    depositRateTitle: "Overnight Deposit Rate",
    lendingRateTitle: "Overnight Lending Rate",
    mainOperationRateTitle: "Main Operation 7-Day Rate",
    discountRateTitle: "CBE Discount Rate",
    reportingDateLabel: "Release / Effective Date",
    nextMeetingLabel: "Next Monetary Policy Committee Meeting",
    policySummaryTitle: "Monetary Policy Assessment",
    officialCbeLink: "Central Bank of Egypt Economic Portal",

    footerReliabilityTitle: "Data Reliability & Transparency Charter",
    footerReliabilityText: "Egypt Markets Pulse strictly separates live feeds from delayed, estimated, and cached indicators. No artificial values are fabricated. Observation timestamps and official provider references are published for every data point.",
    sourcesTitle: "Verified Providers",
    disclaimerText: "Data is presented for personal informational and educational purposes only and does not constitute financial advice. Actual execution rates at banks and gold shops may vary according to retail commissions and fabrication fees.",
  },
};
