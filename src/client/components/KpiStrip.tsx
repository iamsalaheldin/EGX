import React from "react";
import { OverviewData } from "../../server/types.js";
import { Language, translations } from "../translations.js";
import { StatusBadge } from "./StatusBadge.js";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiStripProps {
  overview: OverviewData | null;
  lang: Language;
  loading: boolean;
}

export const KpiStrip: React.FC<KpiStripProps> = ({ overview, lang, loading }) => {
  const t = translations[lang];

  if (loading && !overview) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 animate-pulse h-28"
          />
        ))}
      </div>
    );
  }

  if (!overview) return null;

  const kpis = overview.kpis;

  const cards = [
    {
      kpi: kpis.egx30,
      title: lang === "ar" ? kpis.egx30.titleAr : kpis.egx30.titleEn,
      displayVal: "31,480.25",
      unit: "pts",
      change: kpis.egx30.changePercent,
    },
    {
      kpi: kpis.egx70,
      title: lang === "ar" ? kpis.egx70.titleAr : kpis.egx70.titleEn,
      displayVal: "8,520.10",
      unit: "pts",
      change: kpis.egx70.changePercent,
    },
    {
      kpi: kpis.usdEgp,
      title: lang === "ar" ? kpis.usdEgp.titleAr : kpis.usdEgp.titleEn,
      displayVal: kpis.usdEgp.valueFormatted,
      unit: "EGP",
      change: kpis.usdEgp.changePercent,
    },
    {
      kpi: kpis.sarEgp,
      title: lang === "ar" ? kpis.sarEgp.titleAr : kpis.sarEgp.titleEn,
      displayVal: kpis.sarEgp.valueFormatted,
      unit: "EGP",
      change: kpis.sarEgp.changePercent,
    },
    {
      kpi: kpis.gold21k,
      title: lang === "ar" ? kpis.gold21k.titleAr : kpis.gold21k.titleEn,
      displayVal: kpis.gold21k.valueFormatted,
      unit: "EGP/g",
      change: kpis.gold21k.changePercent,
    },
    {
      kpi: kpis.goldSpot,
      title: lang === "ar" ? kpis.goldSpot.titleAr : kpis.goldSpot.titleEn,
      displayVal: kpis.goldSpot.valueFormatted,
      unit: "USD/oz",
      change: kpis.goldSpot.changePercent,
    },
    {
      kpi: kpis.headlineInflation,
      title: lang === "ar" ? kpis.headlineInflation.titleAr : kpis.headlineInflation.titleEn,
      displayVal: kpis.headlineInflation.valueFormatted,
      unit: "",
      change: kpis.headlineInflation.changePercent,
    },
    {
      kpi: kpis.overnightDeposit,
      title: lang === "ar" ? kpis.overnightDeposit.titleAr : kpis.overnightDeposit.titleEn,
      displayVal: kpis.overnightDeposit.valueFormatted,
      unit: "",
      change: 0,
    },
  ];

  return (
    <section className="mb-8" aria-label="Top Financial KPIs">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {cards.map(({ kpi, title, displayVal, unit, change }, idx) => {
          const isPositive = (change ?? 0) > 0;
          const isNegative = (change ?? 0) < 0;

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group shadow-sm hover:shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-400">
                  <span className="font-medium truncate" title={title}>
                    {title}
                  </span>
                  <StatusBadge status={kpi.status} lang={lang} />
                </div>

                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
                    {displayVal}
                  </span>
                  {unit && (
                    <span className="text-xs text-slate-400 font-sans">
                      {unit}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
                <div className="flex items-center gap-1">
                  {isPositive && (
                    <span className="inline-flex items-center text-emerald-400 gap-0.5 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      +{change}%
                    </span>
                  )}
                  {isNegative && (
                    <span className="inline-flex items-center text-rose-400 gap-0.5 font-medium">
                      <TrendingDown className="w-3 h-3" />
                      {change}%
                    </span>
                  )}
                  {!isPositive && !isNegative && (
                    <span className="inline-flex items-center text-slate-400 gap-0.5">
                      <Minus className="w-3 h-3" />
                      0.0%
                    </span>
                  )}
                </div>

                <span className="truncate max-w-[100px] text-slate-500 text-[10px]">
                  {kpi.source.split(" ")[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
