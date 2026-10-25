/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  CurrencyRatesData,
  EconomicData,
  EGXData,
  GoldData,
  MarketData,
  OverviewData,
} from "./server/types.js";
import { Language, translations } from "./client/translations.js";
import { Header } from "./client/components/Header.js";
import { KpiStrip } from "./client/components/KpiStrip.js";
import { TradingViewWidget } from "./client/components/TradingViewWidget.js";
import { CurrencySection } from "./client/components/CurrencySection.js";
import { GoldSection } from "./client/components/GoldSection.js";
import { EconomySection } from "./client/components/EconomySection.js";
import { DataReliabilityFooter } from "./client/components/DataReliabilityFooter.js";
import { AlertCircle } from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<Language>("ar"); // Arabic-first interface
  const [isDark, setIsDark] = useState<boolean>(true); // Dark mode default

  // Data states
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [currencies, setCurrencies] = useState<MarketData<CurrencyRatesData> | null>(null);
  const [gold, setGold] = useState<MarketData<GoldData> | null>(null);
  const [egx, setEgx] = useState<MarketData<EGXData> | null>(null);
  const [economy, setEconomy] = useState<MarketData<EconomicData> | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Independent fetchers to ensure no single provider failure breaks other sections
  const fetchCurrencies = async () => {
    try {
      const res = await fetch("/api/markets/currencies");
      if (res.ok) {
        const json: MarketData<CurrencyRatesData> = await res.json();
        setCurrencies(json);
      }
    } catch (e) {
      console.error("Failed to fetch currencies:", e);
    }
  };

  const fetchGold = async () => {
    try {
      const res = await fetch("/api/markets/gold");
      if (res.ok) {
        const json: MarketData<GoldData> = await res.json();
        setGold(json);
      }
    } catch (e) {
      console.error("Failed to fetch gold prices:", e);
    }
  };

  const fetchEgx = async () => {
    try {
      const res = await fetch("/api/markets/egx");
      if (res.ok) {
        const json: MarketData<EGXData> = await res.json();
        setEgx(json);
      }
    } catch (e) {
      console.error("Failed to fetch EGX data:", e);
    }
  };

  const fetchEconomy = async () => {
    try {
      const res = await fetch("/api/markets/economy");
      if (res.ok) {
        const json: MarketData<EconomicData> = await res.json();
        setEconomy(json);
      }
    } catch (e) {
      console.error("Failed to fetch economic indicators:", e);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/markets/overview");
      if (res.ok) {
        const json: MarketData<OverviewData> = await res.json();
        if (json.value) {
          setOverview(json.value);
        }
      }
    } catch (e) {
      console.error("Failed to fetch overview snapshot:", e);
    }
  };

  // Load all data
  const loadAllData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setGlobalError(null);

    try {
      await Promise.allSettled([
        fetchOverview(),
        fetchCurrencies(),
        fetchGold(),
        fetchEgx(),
        fetchEconomy(),
      ]);

      const nowFormatted = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());

      setLastUpdated(nowFormatted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGlobalError(msg);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [lang]);

  // Initial mount
  useEffect(() => {
    loadAllData(true);

    // Refresh every 60s
    const interval = setInterval(() => {
      loadAllData(false);
    }, 60000);

    return () => clearInterval(interval);
  }, [loadAllData]);

  // Force refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/markets/refresh", { method: "POST" });
      await loadAllData(false);
    } catch (err) {
      console.error("Force refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const t = translations[lang];

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === "ar" ? "en" : "ar"))}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        egxStatus={egx?.value?.marketStatus || overview?.egxStatus}
      />

      {/* Main Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Error Banner (if any) */}
        {globalError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Section 1: Top 8 KPI Snapshot Strip */}
        <KpiStrip overview={overview} lang={lang} loading={loading} />

        {/* Section 2: Egyptian Stock Exchange (EGX) & Market Charts */}
        <TradingViewWidget lang={lang} isDark={isDark} />

        {/* Section 3: Foreign Exchange Rates vs EGP & Conversion Calculator */}
        <CurrencySection data={currencies} lang={lang} loading={loading} />

        {/* Section 4: Gold Market, Karats & Weight Calculator */}
        <GoldSection data={gold} lang={lang} loading={loading} />

        {/* Section 5: Central Bank of Egypt Macroeconomic Indicators */}
        <EconomySection data={economy} lang={lang} loading={loading} />
      </main>

      {/* Footer with Transparency Charter & Source Directory */}
      <DataReliabilityFooter lang={lang} />
    </div>
  );
}
