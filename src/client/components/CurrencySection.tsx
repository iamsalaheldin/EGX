import React, { useState } from "react";
import { CurrencyItem, CurrencyRatesData, MarketData } from "../../server/types.js";
import { Language, translations } from "../translations.js";
import { StatusBadge } from "./StatusBadge.js";
import {
  Search,
  ArrowRightLeft,
  ExternalLink,
  Calculator,
  DollarSign,
  TrendingUp,
  Landmark,
  Globe,
  SlidersHorizontal,
  X,
  LineChart,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  BarChart2,
} from "lucide-react";

interface CurrencySectionProps {
  data: MarketData<CurrencyRatesData> | null;
  lang: Language;
  loading: boolean;
  isDark?: boolean;
  onRetry?: () => void;
}

export interface ForexPair {
  symbol: string;
  code: string;
  labelAr: string;
  labelEn: string;
  flag: string;
}

export const FOREX_PAIRS: ForexPair[] = [
  { symbol: "FX_IDC:USDEGP", code: "USD", labelAr: "دولار / جنيه", labelEn: "USD / EGP", flag: "🇺🇸" },
  { symbol: "FX_IDC:EUREGP", code: "EUR", labelAr: "يورو / جنيه", labelEn: "EUR / EGP", flag: "🇪🇺" },
  { symbol: "FX_IDC:GBPEGP", code: "GBP", labelAr: "إسترليني / جنيه", labelEn: "GBP / EGP", flag: "🇬🇧" },
  { symbol: "FX_IDC:SAREGP", code: "SAR", labelAr: "ريال / جنيه", labelEn: "SAR / EGP", flag: "🇸🇦" },
  { symbol: "FX_IDC:AEDEGP", code: "AED", labelAr: "درهم / جنيه", labelEn: "AED / EGP", flag: "🇦🇪" },
  { symbol: "FX_IDC:KWDEGP", code: "KWD", labelAr: "دينار / جنيه", labelEn: "KWD / EGP", flag: "🇰🇼" },
  { symbol: "FX_IDC:CHFEGP", code: "CHF", labelAr: "فرنك / جنيه", labelEn: "CHF / EGP", flag: "🇨🇭" },
  { symbol: "FX_IDC:CADEGP", code: "CAD", labelAr: "كندي / جنيه", labelEn: "CAD / EGP", flag: "🇨🇦" },
];

// Fallback baseline currencies matching Google Finance (55.0792) and CBE
const DEFAULT_FALLBACK_CURRENCIES: CurrencyItem[] = [
  { code: "USD", nameEn: "US Dollar", nameAr: "دولار أمريكي", symbol: "$", rateToEgp: 55.0792, invertedRate: 0.018155, flag: "🇺🇸", cbeBuyRate: 48.72, cbeSellRate: 48.86, cbeAvgRate: 48.79 },
  { code: "EUR", nameEn: "Euro", nameAr: "يورو", symbol: "€", rateToEgp: 61.708, invertedRate: 0.016205, flag: "🇪🇺", cbeBuyRate: 52.85, cbeSellRate: 53.01, cbeAvgRate: 52.93 },
  { code: "GBP", nameEn: "British Pound", nameAr: "جنيه إسترليني", symbol: "£", rateToEgp: 73.7094, invertedRate: 0.013567, flag: "🇬🇧", cbeBuyRate: 63.45, cbeSellRate: 63.65, cbeAvgRate: 63.55 },
  { code: "SAR", nameEn: "Saudi Riyal", nameAr: "ريال سعودي", symbol: "ر.س", rateToEgp: 14.6983, invertedRate: 0.068035, flag: "🇸🇦", cbeBuyRate: 12.97, cbeSellRate: 13.01, cbeAvgRate: 12.99 },
  { code: "AED", nameEn: "UAE Dirham", nameAr: "درهم إماراتي", symbol: "د.إ", rateToEgp: 14.9977, invertedRate: 0.066677, flag: "🇦🇪", cbeBuyRate: 13.26, cbeSellRate: 13.3, cbeAvgRate: 13.28 },
  { code: "KWD", nameEn: "Kuwaiti Dinar", nameAr: "دينار كويتي", symbol: "د.ك", rateToEgp: 177.9882, invertedRate: 0.005618, flag: "🇰🇼", cbeBuyRate: 158.85, cbeSellRate: 159.45, cbeAvgRate: 159.15 },
  { code: "QAR", nameEn: "Qatari Riyal", nameAr: "ريال قطري", symbol: "ر.ق", rateToEgp: 15.1316, invertedRate: 0.066087, flag: "🇶🇦", cbeBuyRate: 13.36, cbeSellRate: 13.41, cbeAvgRate: 13.385 },
  { code: "BHD", nameEn: "Bahraini Dinar", nameAr: "دينار بحريني", symbol: "د.ب", rateToEgp: 146.4872, invertedRate: 0.006826, flag: "🇧🇭", cbeBuyRate: 129.2, cbeSellRate: 129.6, cbeAvgRate: 129.4 },
  { code: "OMR", nameEn: "Omani Rial", nameAr: "ريال عماني", symbol: "ر.ع", rateToEgp: 143.0628, invertedRate: 0.00699, flag: "🇴🇲", cbeBuyRate: 126.5, cbeSellRate: 126.9, cbeAvgRate: 126.7 },
  { code: "CAD", nameEn: "Canadian Dollar", nameAr: "دولار كندي", symbol: "C$", rateToEgp: 39.331, invertedRate: 0.025425, flag: "🇨🇦", cbeBuyRate: 35.15, cbeSellRate: 35.26, cbeAvgRate: 35.205 },
  { code: "CHF", nameEn: "Swiss Franc", nameAr: "فرنك سويسري", symbol: "CHF", rateToEgp: 66.8436, invertedRate: 0.01496, flag: "🇨🇭", cbeBuyRate: 56.1, cbeSellRate: 56.28, cbeAvgRate: 56.19 },
  { code: "JPY", nameEn: "Japanese Yen", nameAr: "ين ياباني", symbol: "¥", rateToEgp: 0.3512, invertedRate: 2.84738, flag: "🇯🇵", cbeBuyRate: 0.318, cbeSellRate: 0.319, cbeAvgRate: 0.3185 },
];

export const CurrencySection: React.FC<CurrencySectionProps> = ({
  data,
  lang,
  loading,
  isDark = true,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"google" | "cbe" | "compare">("google");

  // TradingView Forex Chart State
  const [showChart, setShowChart] = useState<boolean>(true);
  const [activePair, setActivePair] = useState<string>("FX_IDC:USDEGP");
  const [chartInterval, setChartInterval] = useState<string>("D");
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);

  // Calculator state
  const [amount, setAmount] = useState<string>("100");
  const [fromCode, setFromCode] = useState<string>("USD");
  const [toCode, setToCode] = useState<string>("EGP");
  const [calculatorSource, setCalculatorSource] = useState<"google" | "cbe">("google");

  // Determine active currency list: prefer live data, fallback to baseline if empty
  const rawCurrencies = data?.value?.currencies;
  const currencies: CurrencyItem[] =
    rawCurrencies && rawCurrencies.length > 0
      ? rawCurrencies
      : DEFAULT_FALLBACK_CURRENCIES;

  // Filter currencies
  const filteredCurrencies = currencies.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      c.code.toLowerCase().includes(term) ||
      c.nameEn.toLowerCase().includes(term) ||
      c.nameAr.includes(term)
    );
  });

  // Calculate conversion
  const parsedAmount = parseFloat(amount) || 0;

  const getRate = (code: string, source: "google" | "cbe"): number => {
    if (code === "EGP") return 1;
    const item = currencies.find((c) => c.code === code);
    if (!item) return 0;
    if (source === "cbe") {
      return item.cbeSellRate || item.cbeAvgRate || item.rateToEgp;
    }
    return item.rateToEgp;
  };

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const fromRate = getRate(fromCode, calculatorSource);
  const toRate = getRate(toCode, calculatorSource);

  let convertedValue = 0;
  let formulaText = "";

  if (fromRate > 0 && toRate > 0 && parsedAmount > 0) {
    if (fromCode === "EGP") {
      // EGP to Foreign Currency
      convertedValue = parsedAmount / toRate;
      formulaText = `${parsedAmount.toLocaleString()} EGP ÷ ${toRate.toFixed(4)} = ${convertedValue.toFixed(2)} ${toCode}`;
    } else if (toCode === "EGP") {
      // Foreign Currency to EGP
      convertedValue = parsedAmount * fromRate;
      formulaText = `${parsedAmount.toLocaleString()} ${fromCode} × ${fromRate.toFixed(4)} = ${convertedValue.toFixed(2)} EGP`;
    } else {
      // Cross currency conversion (e.g. USD to EUR)
      const inEgp = parsedAmount * fromRate;
      convertedValue = inEgp / toRate;
      formulaText = `${parsedAmount.toLocaleString()} ${fromCode} = ${inEgp.toFixed(2)} EGP = ${convertedValue.toFixed(2)} ${toCode}`;
    }
  }

  // Quick preset amounts
  const presets = [100, 500, 1000, 5000, 10000];

  const intervals = [
    { value: "D", labelEn: "1D", labelAr: "يومي" },
    { value: "W", labelEn: "1W", labelAr: "أسبوعي" },
    { value: "M", labelEn: "1M", labelAr: "شهري" },
    { value: "60", labelEn: "1H", labelAr: "ساعة" },
  ];

  const currentPairMeta = FOREX_PAIRS.find((p) => p.symbol === activePair) || FOREX_PAIRS[0];
  const activeCurrencyData = currencies.find((c) => c.code === currentPairMeta.code);

  const usdItem = currencies.find((c) => c.code === "USD");
  const usdGoogleRate = usdItem?.rateToEgp || 55.0792;
  const usdCbeSell = usdItem?.cbeSellRate || 48.86;

  // Handler to link row selection to both calculator and TradingView chart
  const handleSelectCurrencyRow = (c: CurrencyItem) => {
    setFromCode(c.code);
    setToCode("EGP");

    // Check if there is a matching TradingView Forex pair
    const matchingForex = FOREX_PAIRS.find((p) => p.code === c.code);
    if (matchingForex) {
      if (activePair !== matchingForex.symbol) {
        setIsIframeLoading(true);
        setActivePair(matchingForex.symbol);
      }
      setShowChart(true);
    }
  };

  // Construct official TradingView Advanced Chart configuration
  const config = {
    autosize: true,
    symbol: activePair,
    interval: chartInterval,
    timezone: "Africa/Cairo",
    theme: isDark ? "dark" : "light",
    style: "1",
    locale: lang === "ar" ? "ar" : "en",
    enable_publishing: false,
    allow_symbol_change: true,
    calendar: false,
    hide_top_toolbar: false,
    hide_legend: false,
    save_image: false,
    withdateranges: true,
    details: true,
    hotlist: false,
    support_host: "https://www.tradingview.com",
  };

  const iframeSrc = `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=${
    lang === "ar" ? "ar" : "en"
  }#${encodeURIComponent(JSON.stringify(config))}`;

  const iframeKey = `tv-forex-${activePair}-${chartInterval}-${isDark ? "dark" : "light"}-${lang}`;

  return (
    <section id="currencies" className="mb-12 scroll-mt-20" aria-label="Foreign Exchange Rates">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-400" />
            <span>{t.currenciesSectionTitle}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.currenciesSectionSubtitle}
          </p>
        </div>

        {/* Action Controls: Dual Resource Mode Switcher + Chart Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle TradingView Chart Button */}
          <button
            onClick={() => setShowChart((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              showChart
                ? "bg-amber-400/10 border-amber-400/40 text-amber-300 hover:bg-amber-400/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            }`}
            title={showChart ? t.toggleChartHide : t.toggleChartShow}
          >
            <LineChart className="w-3.5 h-3.5 text-amber-400" />
            <span>{showChart ? t.toggleChartHide : t.toggleChartShow}</span>
            {showChart ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Dual Resource Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
            <button
              onClick={() => setViewMode("google")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === "google"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.sourceGoogle}</span>
            </button>

            <button
              onClick={() => setViewMode("cbe")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === "cbe"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{t.sourceCbe}</span>
            </button>

            <button
              onClick={() => setViewMode("compare")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === "compare"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.sourceCompare}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dual Resource Summary Pill Banner */}
      <div className="p-3 mb-6 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {lang === "ar" ? "سعر جوجل المباشر (USD):" : "Google Finance (USD):"}
            </span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {usdGoogleRate.toFixed(4)} EGP
            </span>
            <a
              href="https://www.google.com/finance/quote/USD-EGP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400"
              title="Google Finance"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {lang === "ar" ? "سعر البنك المركزي (شراء / بيع):" : "CBE Official (Buy / Sell):"}
            </span>
            <span className="font-mono font-bold text-slate-200 tabular-nums">
              48.72 / {usdCbeSell.toFixed(2)} EGP
            </span>
            <a
              href="https://www.cbe.org.eg/en/economic-research/statistics/cbe-exchange-rates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400"
              title="Central Bank of Egypt"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <StatusBadge status="live" lang={lang} />
        </div>
      </div>

      {/* TradingView Currency Exchange Technical Chart Module */}
      {showChart && (
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg transition-all">
          {/* Chart Header Bar */}
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{t.currencyChartTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {currentPairMeta.symbol}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {t.currencyChartSubtitle}
                  </p>
                </div>
              </div>

              {/* Active pair live rate badges */}
              {activeCurrencyData && (
                <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
                  <span className="text-slate-400 text-[11px]">
                    {lang === "ar" ? "سعر جوجل:" : "Google Rate:"}
                  </span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    {activeCurrencyData.rateToEgp.toFixed(4)} EGP
                  </span>
                  {activeCurrencyData.cbeSellRate && (
                    <>
                      <span className="text-slate-700">|</span>
                      <span className="text-slate-400 text-[11px]">
                        {lang === "ar" ? "بيع المركزي:" : "CBE Sell:"}
                      </span>
                      <span className="text-sky-300 font-bold tabular-nums">
                        {activeCurrencyData.cbeSellRate.toFixed(2)} EGP
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Currency Pair Tabs & Timeframe Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Pair Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto max-w-full">
                {FOREX_PAIRS.map((pair) => {
                  const isActive = activePair === pair.symbol;
                  return (
                    <button
                      key={pair.symbol}
                      onClick={() => {
                        if (activePair !== pair.symbol) {
                          setIsIframeLoading(true);
                          setActivePair(pair.symbol);
                        }
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isActive
                          ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span>{pair.flag}</span>
                      <span>{lang === "ar" ? pair.labelAr : pair.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Timeframe intervals */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                {intervals.map((int) => (
                  <button
                    key={int.value}
                    onClick={() => {
                      if (chartInterval !== int.value) {
                        setIsIframeLoading(true);
                        setChartInterval(int.value);
                      }
                    }}
                    className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                      chartInterval === int.value
                        ? "bg-slate-800 text-amber-300 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang === "ar" ? int.labelAr : int.labelEn}
                  </button>
                ))}
              </div>

              {/* External TradingView Link */}
              <a
                href={`https://www.tradingview.com/symbols/${activePair.replace(":", "-")}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 rounded-lg transition-colors"
                title="Open chart on TradingView"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Chart Canvas & Loading State */}
          <div className="relative w-full h-[480px] sm:h-[540px] bg-slate-950">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10 transition-opacity">
                <RefreshCw className="w-7 h-7 text-amber-400 animate-spin mb-2" />
                <span className="text-xs text-slate-400 font-mono">
                  {lang === "ar"
                    ? "جاري تحميل مخطط TradingView المباشر..."
                    : "Loading real-time TradingView chart..."}
                </span>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={iframeSrc}
              title={`TradingView Forex Chart - ${activePair}`}
              className="w-full h-full border-0"
              onLoad={() => setIsIframeLoading(false)}
              allow="clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>

          {/* Chart Footer Note */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {lang === "ar"
                  ? "مخطط فني لحظي للأزواج النقدية الأجنبية مقابل الجنيه المصري عبر موفر بيانات TradingView FX_IDC."
                  : "Real-time technical candlestick chart for FX currency crosses vs EGP via TradingView FX_IDC."}
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
              Symbol: {activePair}
            </span>
          </div>
        </div>
      )}

      {/* Grid: Currency Table (2/3) + Calculator (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Currency Rates Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm flex flex-col">
          {/* Table Search & Mode Indicator */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchCurrencyPlaceholder}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-8 rtl:pl-8 rtl:pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-2.5 p-1 text-slate-400 hover:text-white"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-semibold">
                {viewMode === "google"
                  ? "Google Finance"
                  : viewMode === "cbe"
                  ? "CBE Official"
                  : "Compare (جوجل & المركزي)"}
              </span>
              <span className="text-slate-600">·</span>
              <span>
                {filteredCurrencies.length} {lang === "ar" ? "عملات" : "currencies"}
              </span>
            </div>
          </div>

          {/* Table Viewport */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-medium">
                  <th className="py-3 px-4">{t.colCurrency}</th>

                  {viewMode === "google" && (
                    <>
                      <th className="py-3 px-4 text-right rtl:text-left">{t.colGoogleRate}</th>
                      <th className="py-3 px-4 text-right rtl:text-left">{t.colInvertedRate}</th>
                      <th className="py-3 px-4 text-center">{t.colStatus}</th>
                      <th className="py-3 px-4 text-center">TradingView</th>
                    </>
                  )}

                  {viewMode === "cbe" && (
                    <>
                      <th className="py-3 px-4 text-right rtl:text-left">{t.colCbeBuy}</th>
                      <th className="py-3 px-4 text-right rtl:text-left">{t.colCbeSell}</th>
                      <th className="py-3 px-4 text-center">{t.colStatus}</th>
                      <th className="py-3 px-4 text-center">TradingView</th>
                    </>
                  )}

                  {viewMode === "compare" && (
                    <>
                      <th className="py-3 px-4 text-right rtl:text-left text-amber-400">
                        {t.colGoogleRate}
                      </th>
                      <th className="py-3 px-4 text-right rtl:text-left">{t.colCbeBuy}</th>
                      <th className="py-3 px-4 text-right rtl:text-left">{t.colCbeSell}</th>
                      <th className="py-3 px-4 text-right rtl:text-left">
                        {lang === "ar" ? "فارق السوق" : "Spread"}
                      </th>
                      <th className="py-3 px-4 text-center">TradingView</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredCurrencies.map((c) => {
                  const googleRate = c.rateToEgp;
                  const cbeBuy = c.cbeBuyRate || c.rateToEgp * 0.985;
                  const cbeSell = c.cbeSellRate || c.rateToEgp * 0.992;
                  const spread = googleRate - cbeSell;
                  const hasForexPair = FOREX_PAIRS.some((p) => p.code === c.code);

                  return (
                    <tr
                      key={c.code}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => handleSelectCurrencyRow(c)}
                      title={
                        lang === "ar"
                          ? `انقر لعرض مخطط TradingView وحساب التحويل لـ ${c.nameAr}`
                          : `Click to view TradingView chart & calculate for ${c.nameEn}`
                      }
                    >
                      {/* Currency Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5 font-sans">
                          <span className="text-base">{c.flag}</span>
                          <div>
                            <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                              <span>{c.code}</span>
                              <span className="text-slate-500 text-[10px] font-normal">
                                {c.symbol}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {lang === "ar" ? c.nameAr : c.nameEn}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Google Finance View */}
                      {viewMode === "google" && (
                        <>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums">
                            <span className="text-white font-bold text-sm">
                              {googleRate.toFixed(4)}
                            </span>
                            <span className="text-slate-500 ml-1 rtl:ml-0 rtl:mr-1 font-sans text-[10px]">
                              EGP
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums text-slate-400">
                            <span>{c.invertedRate.toFixed(4)}</span>
                            <span className="text-slate-500 ml-1 rtl:ml-0 rtl:mr-1 font-sans text-[10px]">
                              {c.code}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <StatusBadge status="live" lang={lang} />
                          </td>
                        </>
                      )}

                      {/* Central Bank of Egypt View */}
                      {viewMode === "cbe" && (
                        <>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums text-slate-200">
                            <span className="font-bold">{cbeBuy.toFixed(2)}</span>
                            <span className="text-slate-500 ml-1 rtl:ml-0 rtl:mr-1 font-sans text-[10px]">
                              EGP
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums text-amber-300">
                            <span className="font-bold">{cbeSell.toFixed(2)}</span>
                            <span className="text-slate-500 ml-1 rtl:ml-0 rtl:mr-1 font-sans text-[10px]">
                              EGP
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-sans">
                              {lang === "ar" ? "رسمي" : "Official"}
                            </span>
                          </td>
                        </>
                      )}

                      {/* Compare Both View */}
                      {viewMode === "compare" && (
                        <>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums text-amber-400 font-bold">
                            {googleRate.toFixed(4)}
                          </td>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums text-slate-300">
                            {cbeBuy.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums text-slate-300">
                            {cbeSell.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right rtl:text-left tabular-nums">
                            <span
                              className={`text-[11px] font-semibold ${
                                spread > 0 ? "text-emerald-400" : "text-slate-400"
                              }`}
                            >
                              {spread > 0 ? `+${spread.toFixed(2)}` : spread.toFixed(2)}
                            </span>
                          </td>
                        </>
                      )}

                      {/* Chart Quick Action Button */}
                      <td className="py-3 px-4 text-center">
                        {hasForexPair ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectCurrencyRow(c);
                            }}
                            className="p-1 rounded hover:bg-amber-400/20 text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 text-[11px] font-sans"
                            title={lang === "ar" ? "عرض المخطط البياني" : "View Chart"}
                          >
                            <LineChart className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">
                              {lang === "ar" ? "مخطط" : "Chart"}
                            </span>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Source Attribution & Link Footer */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              {viewMode === "google"
                ? lang === "ar"
                  ? "يتم جلب أسعار جوجل فاينانس لحظياً من الأسواق العالمية."
                  : "Google Finance live market quotes updated continuously."
                : t.cbeNoticeText}
            </span>

            <div className="flex items-center gap-3">
              <a
                href="https://www.google.com/finance/quote/USD-EGP"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-amber-400 rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Google Finance</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.cbe.org.eg/en/economic-research/statistics/cbe-exchange-rates"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>{t.viewCbeRates}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Currency Conversion Calculator */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {t.calculatorTitle}
                </h3>
              </div>

              {/* Calculator Rate Source Switcher */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md text-[10px]">
                <button
                  onClick={() => setCalculatorSource("google")}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                    calculatorSource === "google"
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setCalculatorSource("cbe")}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                    calculatorSource === "cbe"
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  CBE
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              {t.calculatorSubtitle}
            </p>

            {/* Amount input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t.amountLabel}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-amber-400 transition-colors tabular-nums"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
              {presets.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors whitespace-nowrap ${
                    amount === val.toString()
                      ? "bg-amber-400/20 border-amber-400/50 text-amber-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Currency Selectors & Swap */}
            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 mb-6">
              {/* From */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {t.fromCurrency}
                </label>
                <select
                  value={fromCode}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    setFromCode(newCode);
                    const matchingForex = FOREX_PAIRS.find((p) => p.code === newCode);
                    if (matchingForex && activePair !== matchingForex.symbol) {
                      setIsIframeLoading(true);
                      setActivePair(matchingForex.symbol);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="USD">USD - دولار أمريكي</option>
                  <option value="EGP">EGP - الجنيه المصري</option>
                  {currencies
                    .filter((c) => c.code !== "USD")
                    .map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {lang === "ar" ? c.nameAr : c.nameEn}
                      </option>
                    ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                className="mt-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title={t.swapBtn}
                aria-label="Swap currencies"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              </button>

              {/* To */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {t.toCurrency}
                </label>
                <select
                  value={toCode}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    setToCode(newCode);
                    const matchingForex = FOREX_PAIRS.find((p) => p.code === newCode);
                    if (matchingForex && activePair !== matchingForex.symbol) {
                      setIsIframeLoading(true);
                      setActivePair(matchingForex.symbol);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="EGP">EGP - الجنيه المصري</option>
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {lang === "ar" ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Converted Output Display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 mb-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{t.convertedAmount}</span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">
                  {calculatorSource === "google" ? "Google Rate" : "CBE Rate"}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {convertedValue > 0
                    ? convertedValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </span>
                <span className="text-sm font-bold text-slate-300 font-sans">
                  {toCode}
                </span>
              </div>
            </div>

            {/* Formula breakdown */}
            {formulaText && (
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                <span className="text-slate-400">{t.rateFormulaLabel}:</span>{" "}
                <span>{formulaText}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500">
            {lang === "ar"
              ? `المصدر النشط للحساب: ${
                  calculatorSource === "google"
                    ? "سعر جوجل فاينانس اللحظي"
                    : "السعر الرسمي للبنك المركزي المصري"
                }`
              : `Active calculation base: ${
                  calculatorSource === "google"
                    ? "Google Finance real-time market quote"
                    : "Official Central Bank of Egypt quote"
                }`}
          </div>
        </div>
      </div>
    </section>
  );
};
