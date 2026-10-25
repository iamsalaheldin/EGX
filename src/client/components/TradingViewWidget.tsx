import React, { useState } from "react";
import { EGXData } from "../../server/types.js";
import { Language, translations } from "../translations.js";
import { ExternalLink, Info, RefreshCw, BarChart3, TrendingUp } from "lucide-react";
import { EgxMarketOverview } from "./EgxMarketOverview.js";

interface TradingViewWidgetProps {
  lang: Language;
  isDark: boolean;
  egxData?: EGXData | null;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  lang,
  isDark,
  egxData,
}) => {
  const t = translations[lang];
  const [activeSymbol, setActiveSymbol] = useState<string>("EGX:EGX30");
  const [interval, setInterval] = useState<string>("D");
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const tabs: { id: string; label: string; symbolTag: string }[] = [
    { id: "EGX:EGX30", label: t.chartEgx30, symbolTag: "EGX30" },
    { id: "EGX:EGX70EWI", label: t.chartEgx70, symbolTag: "EGX70" },
    { id: "EGX:EGX100EWI", label: t.chartEgx100, symbolTag: "EGX100" },
    { id: "EGX:COMI", label: lang === "ar" ? "CIB البنك التجاري" : "CIB (COMI)", symbolTag: "COMI" },
    { id: "EGX:TMGH", label: lang === "ar" ? "طلعت مصطفى" : "TMG (TMGH)", symbolTag: "TMGH" },
    { id: "EGX:ETEL", label: lang === "ar" ? "المصرية للاتصالات" : "Telecom Egypt", symbolTag: "ETEL" },
    { id: "TVC:GOLD", label: t.chartGoldSpot, symbolTag: "XAU/USD" },
    { id: "FX_IDC:USDEGP", label: t.chartUsdEgp, symbolTag: "USD/EGP" },
  ];

  const intervals = [
    { value: "D", labelEn: "1D", labelAr: "يومي" },
    { value: "W", labelEn: "1W", labelAr: "أسبوعي" },
    { value: "M", labelEn: "1M", labelAr: "شهري" },
  ];

  // Construct official TradingView Advanced Chart configuration
  const config = {
    autosize: true,
    symbol: activeSymbol,
    interval: interval,
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

  // Unique key to force clean iframe remount when user changes symbol or theme
  const iframeKey = `${activeSymbol}-${interval}-${isDark ? "dark" : "light"}-${lang}`;

  return (
    <section id="egx" className="mb-12 scroll-mt-20" aria-label="EGX & Market Charts">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <span>{t.egxSectionTitle}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.egxSectionSubtitle}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const isActive = activeSymbol === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (activeSymbol !== tab.id) {
                      setIsIframeLoading(true);
                      setActiveSymbol(tab.id);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-amber-400 text-slate-950 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Timeframe intervals */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {intervals.map((int) => (
              <button
                key={int.value}
                onClick={() => {
                  if (interval !== int.value) {
                    setIsIframeLoading(true);
                    setInterval(int.value);
                  }
                }}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  interval === int.value
                    ? "bg-slate-800 text-amber-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "ar" ? int.labelAr : int.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
        {/* Delayed feed warning banner */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{t.egxNotice}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://www.tradingview.com/symbols/${activeSymbol.replace(":", "-")}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              <span>{activeSymbol}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="relative w-full h-[540px] bg-slate-950">
          {/* Subtle loading spinner until iframe renders */}
          {isIframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 text-slate-400 gap-3">
              <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              <span className="text-xs font-mono">
                {lang === "ar" ? "جاري تحميل الرسم البياني..." : "Loading chart..."}
              </span>
            </div>
          )}

          {/* Direct TradingView Embed Iframe with isolation */}
          <iframe
            key={iframeKey}
            src={iframeSrc}
            title={`TradingView Chart - ${activeSymbol}`}
            onLoad={() => setIsIframeLoading(false)}
            className="w-full h-full border-0"
            allow="fullscreen"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              border: 0,
            }}
          />
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-200 font-semibold">{activeSymbol}</span>
            <span className="text-slate-600">·</span>
            <span>{t.tradingHoursLabel}: 10:00 - 14:30 Cairo (Sun-Thu)</span>
          </div>

          <div className="flex items-center gap-4 font-sans text-xs">
            <a
              href="https://www.tradingview.com/markets/stocks-egypt/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>TradingView Egypt</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.egx.com.eg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>{t.officialExchangeLink}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* TradingView Egypt Market Overview, Breadth, Heatmap & Screeners */}
      <EgxMarketOverview data={egxData} lang={lang} isDark={isDark} />
    </section>
  );
};
