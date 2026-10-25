import React, { useState } from "react";
import { GoldData, MarketData } from "../../server/types.js";
import { Language, translations } from "../translations.js";
import { StatusBadge } from "./StatusBadge.js";
import { Coins, Calculator, AlertCircle, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

interface GoldSectionProps {
  data: MarketData<GoldData> | null;
  lang: Language;
  loading: boolean;
}

export const GoldSection: React.FC<GoldSectionProps> = ({ data, lang, loading }) => {
  const t = translations[lang];

  // Gold Calculator State
  const [selectedKarat, setSelectedKarat] = useState<"k24" | "k21" | "k18" | "pound">("k21");
  const [weight, setWeight] = useState<string>("10");
  const [workmanship, setWorkmanship] = useState<string>("120"); // EGP per gram average

  const gold = data?.value;
  const karats = gold?.karats;

  // Selected Karat Base Price
  const currentDetail = karats ? karats[selectedKarat] : null;
  const unitPrice = currentDetail?.retailSellEgp || currentDetail?.estimatedEgp || 0;

  const parsedWeight = parseFloat(weight) || 0;
  const parsedWorkmanship = parseFloat(workmanship) || 0;

  // If gold pound is selected, weight is number of coins (8g each of 21k)
  const isPound = selectedKarat === "pound";
  const subtotalMetal = unitPrice * parsedWeight;
  const subtotalWorkmanship = isPound
    ? parsedWorkmanship * 8 * parsedWeight
    : parsedWorkmanship * parsedWeight;
  const grandTotal = subtotalMetal + subtotalWorkmanship;

  const karatCards = karats
    ? [
        { key: "k24" as const, item: karats.k24, highlight: false },
        { key: "k21" as const, item: karats.k21, highlight: true },
        { key: "k18" as const, item: karats.k18, highlight: false },
        { key: "pound" as const, item: karats.pound, highlight: false },
      ]
    : [];

  return (
    <section id="gold" className="mb-12 scroll-mt-20" aria-label="Gold Market">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-400" />
            <span>{t.goldSectionTitle}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.goldSectionSubtitle}
          </p>
        </div>

        {gold && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span>XAU/USD:</span>
              <span className="text-amber-400 font-bold">
                ${gold.international.ounceUsd.toLocaleString()}
              </span>
            </div>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <span>USD/EGP:</span>
              <span className="text-slate-200 font-semibold">{gold.usdToEgpUsed}</span>
            </div>
            <span className="text-slate-600">·</span>
            <StatusBadge status={data?.status || "live"} lang={lang} />
          </div>
        )}
      </div>

      {/* Karat Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading && !karats ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 animate-pulse h-56"
            />
          ))
        ) : (
          karatCards.map(({ key, item, highlight }) => {
            const hasRetail = item.retailSellEgp !== null;
            const diff = item.differenceEgp;
            const isSelected = selectedKarat === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedKarat(key)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow ${
                  isSelected
                    ? "bg-slate-900 border-amber-400/80 ring-1 ring-amber-400/30"
                    : highlight
                    ? "bg-slate-900/80 border-slate-700/80 hover:border-slate-600"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  {/* Top: Karat Title & Tag */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-semibold text-amber-400 block font-mono">
                        {item.karat}
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {lang === "ar" ? item.labelAr : item.labelEn}
                      </h4>
                    </div>

                    {highlight && (
                      <span className="text-[10px] font-semibold text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded">
                        {lang === "ar" ? "الأكثر طلباً" : "Popular"}
                      </span>
                    )}
                  </div>

                  {/* Primary Retail Selling Price */}
                  <div className="mb-3">
                    <span className="text-[11px] text-slate-400 block mb-0.5 font-sans">
                      {hasRetail ? t.retailSellPrice : t.intrinsicValue}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white font-mono tabular-nums">
                        {(item.retailSellEgp || item.estimatedEgp).toLocaleString("en-US", {
                          maximumFractionDigits: 1,
                        })}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">
                        {key === "pound" ? "EGP" : "EGP/g"}
                      </span>
                    </div>

                    {/* Change indicator if present */}
                    {item.changeTodayPercent !== undefined && (
                      <div className="flex items-center gap-1 mt-1 text-[11px] font-mono">
                        {item.changeTodayPercent >= 0 ? (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            +{item.changeTodayPercent}%
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" />
                            {item.changeTodayPercent}%
                          </span>
                        )}
                        <span className="text-slate-500 text-[10px]">
                          ({item.changeTodayEgp} EGP)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Secondary Details: Retail Buy Price & Global Intrinsic */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs font-mono">
                    {hasRetail && item.retailBuyEgp && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-sans text-[11px]">{t.retailBuyPrice}:</span>
                        <span className="text-slate-200 font-semibold tabular-nums">
                          {item.retailBuyEgp.toLocaleString()} EGP
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-sans text-[11px]">{t.intrinsicValue}:</span>
                      <span className="text-slate-400 tabular-nums">
                        {item.estimatedEgp.toLocaleString()} EGP
                      </span>
                    </div>

                    {diff !== null && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-sans">{t.localPremium}:</span>
                        <span
                          className={`tabular-nums font-semibold ${
                            diff > 0 ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} EGP
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-sans">
                  <span>{hasRetail ? "iSagha Retail Market" : "Intrinsic Spot Model"}</span>
                  <span className="text-amber-400 hover:underline">
                    {lang === "ar" ? "حساب التكلفة ←" : "Calculate →"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Grid: Disclaimer + Weight Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2/3): Gold Weight & Cost Calculator */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              {t.goldCalculatorTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            {t.goldCalculatorSubtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* 1. Karat selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t.selectKarat}
              </label>
              <select
                value={selectedKarat}
                onChange={(e) => setSelectedKarat(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="k24">Gold 24K (ذهب عيار 24)</option>
                <option value="k21">Gold 21K (ذهب عيار 21)</option>
                <option value="k18">Gold 18K (ذهب عيار 18)</option>
                <option value="pound">Egyptian Gold Pound (جنيه ذهب - 8 جرام)</option>
              </select>
            </div>

            {/* 2. Weight in grams or count */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {isPound ? t.goldPoundUnits : t.weightGrams}
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-400 transition-colors tabular-nums"
              />
            </div>

            {/* 3. Masna'iyya (Workmanship) per gram */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t.workmanshipFee}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={workmanship}
                onChange={(e) => setWorkmanship(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-400 transition-colors tabular-nums"
              />
            </div>
          </div>

          {/* Quick presets for weight */}
          <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 text-xs text-slate-400">
            <span className="font-sans text-[11px] text-slate-500 shrink-0">
              {lang === "ar" ? "أوزان شائعة:" : "Presets:"}
            </span>
            {(isPound ? [1, 2, 5, 10] : [5, 10, 20, 31.1, 50, 100]).map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w.toString())}
                className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors whitespace-nowrap ${
                  weight === w.toString()
                    ? "bg-amber-400/20 border-amber-400/50 text-amber-300 font-semibold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {w} {isPound ? (lang === "ar" ? "جنيه" : "pcs") : "g"}
              </button>
            ))}
          </div>

          {/* Calculation Breakdown Cards */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <span className="block text-xs text-slate-400 mb-0.5">
                {t.totalEstimatedCost}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {grandTotal.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}
                </span>
                <span className="text-sm font-bold text-slate-300">EGP</span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-slate-800 sm:px-4">
              <div>
                <span className="text-slate-500 block text-[10px] font-sans">
                  {lang === "ar" ? "قيمة الذهب الخام" : "Net Metal Cost"}
                </span>
                <span className="text-slate-200 font-semibold tabular-nums">
                  {subtotalMetal.toLocaleString("en-US", { maximumFractionDigits: 1 })} EGP
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-sans">
                  {lang === "ar" ? "إجمالي المصنعية" : "Workmanship"}
                </span>
                <span className="text-amber-400 font-semibold tabular-nums">
                  +{subtotalWorkmanship.toLocaleString()} EGP
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 font-sans">
            {t.workmanshipHint}
          </p>
        </div>

        {/* Right (1/3): Explicit Valuation Disclaimer Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-sky-400 shrink-0" />
              <h3 className="text-sm font-bold text-white">
                {lang === "ar" ? "إيضاحات تسعير الذهب" : "Gold Pricing Model Notice"}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {t.intrinsicDisclaimer}
            </p>

            <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">{lang === "ar" ? "وزن الأوقية:" : "1 Troy Ounce:"}</span>
                <span className="text-slate-200">31.1035 g</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">{lang === "ar" ? "وزن الجنيه الذهب:" : "Gold Pound:"}</span>
                <span className="text-slate-200">8.00 g (21K)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">{lang === "ar" ? "نقاء عيار 21:" : "21K Purity:"}</span>
                <span className="text-slate-200">87.5% (21/24)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4">
            <a
              href="https://market.isagha.com/prices"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:underline flex items-center justify-between font-medium"
            >
              <span>{lang === "ar" ? "متابعة سوق الصاغة على منصة آي صاغة" : "View iSagha Retail Market"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
