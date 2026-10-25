import React, { useState, useEffect } from "react";
import { Language, translations } from "../translations.js";
import { EGXMarketStatus } from "../../server/types.js";
import { RefreshCw, Sun, Moon, Globe, Clock } from "lucide-react";

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  lastUpdated: string | null;
  egxStatus?: EGXMarketStatus;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isDark,
  onToggleTheme,
  onRefresh,
  isRefreshing,
  lastUpdated,
  egxStatus,
}) => {
  const t = translations[lang];

  // Dynamic live Cairo clock
  const [currentCairoTime, setCurrentCairoTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
          timeZone: "Africa/Cairo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
        setCurrentCairoTime(formatted);
      } catch {
        setCurrentCairoTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  // Market status label
  const marketStatusLabel = () => {
    if (!egxStatus) return t.marketClosed;
    switch (egxStatus.sessionState) {
      case "open":
        return t.marketOpen;
      case "pre_open":
        return t.marketPreOpen;
      case "weekend":
        return t.marketWeekend;
      case "closed":
      default:
        return t.marketClosed;
    }
  };

  const isSessionOpen = egxStatus?.sessionState === "open";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 dark:bg-slate-950/85 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Zone Top Bar */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-sm">
              EGP
            </div>
            <a
              href="#"
              className="text-lg font-bold tracking-tight text-slate-100 hover:text-white transition-colors whitespace-nowrap"
            >
              {t.appName}
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a
              href="#egx"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navEgx}
            </a>
            <a
              href="#currencies"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navCurrencies}
            </a>
            <a
              href="#gold"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navGold}
            </a>
            <a
              href="#economy"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navEconomy}
            </a>
          </nav>

          {/* Zone 3: Actions (Language, Theme, Refresh) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-md transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? t.refreshing : t.refreshBtn}
              </span>
            </button>
          </div>
        </div>

        {/* Real-Time Context Bar */}
        <div className="py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-y-1 gap-x-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.cairoTime}:</span>
            <span className="text-slate-200 tabular-nums font-semibold">
              {currentCairoTime || egxStatus?.cairoTime || "—"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* EGX Market Session Indicator */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSessionOpen
                    ? "bg-emerald-400 animate-pulse"
                    : egxStatus?.sessionState === "pre_open"
                    ? "bg-amber-400"
                    : "bg-slate-600"
                }`}
              />
              <span className="text-slate-300 font-sans">
                {marketStatusLabel()}
              </span>
            </div>

            {/* Last update */}
            {lastUpdated && (
              <div className="hidden sm:flex items-center gap-1 text-slate-500 font-sans">
                <span>{t.lastUpdated}:</span>
                <span className="text-slate-400 tabular-nums font-mono">
                  {lastUpdated}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
