import React from "react";
import { EconomicData, MarketData } from "../../server/types.js";
import { Language, translations } from "../translations.js";
import { StatusBadge } from "./StatusBadge.js";
import { Landmark, Calendar, ExternalLink, Activity, Percent, ShieldCheck } from "lucide-react";

interface EconomySectionProps {
  data: MarketData<EconomicData> | null;
  lang: Language;
  loading: boolean;
}

export const EconomySection: React.FC<EconomySectionProps> = ({ data, lang, loading }) => {
  const t = translations[lang];
  const eco = data?.value;

  if (loading && !eco) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 animate-pulse h-64 mb-12" />
    );
  }

  if (!eco) return null;

  const indicators = [
    {
      item: eco.headlineInflation,
      title: lang === "ar" ? eco.headlineInflation.titleAr : eco.headlineInflation.titleEn,
      desc: lang === "ar" ? eco.headlineInflation.noteAr : eco.headlineInflation.noteEn,
      period: lang === "ar" ? eco.headlineInflation.periodLabelAr : eco.headlineInflation.periodLabelEn,
      icon: Activity,
      color: "text-amber-400",
    },
    {
      item: eco.coreInflation,
      title: lang === "ar" ? eco.coreInflation.titleAr : eco.coreInflation.titleEn,
      desc: lang === "ar" ? eco.coreInflation.noteAr : eco.coreInflation.noteEn,
      period: lang === "ar" ? eco.coreInflation.periodLabelAr : eco.coreInflation.periodLabelEn,
      icon: Percent,
      color: "text-amber-400",
    },
    {
      item: eco.depositRate,
      title: lang === "ar" ? eco.depositRate.titleAr : eco.depositRate.titleEn,
      desc: lang === "ar" ? eco.depositRate.noteAr : eco.depositRate.noteEn,
      period: lang === "ar" ? eco.depositRate.periodLabelAr : eco.depositRate.periodLabelEn,
      icon: Landmark,
      color: "text-emerald-400",
    },
    {
      item: eco.lendingRate,
      title: lang === "ar" ? eco.lendingRate.titleAr : eco.lendingRate.titleEn,
      desc: lang === "ar" ? eco.lendingRate.noteAr : eco.lendingRate.noteEn,
      period: lang === "ar" ? eco.lendingRate.periodLabelAr : eco.lendingRate.periodLabelEn,
      icon: Landmark,
      color: "text-emerald-400",
    },
    {
      item: eco.mainOperationRate,
      title: lang === "ar" ? eco.mainOperationRate.titleAr : eco.mainOperationRate.titleEn,
      desc: lang === "ar" ? eco.mainOperationRate.noteAr : eco.mainOperationRate.noteEn,
      period: lang === "ar" ? eco.mainOperationRate.periodLabelAr : eco.mainOperationRate.periodLabelEn,
      icon: ShieldCheck,
      color: "text-sky-400",
    },
    {
      item: eco.discountRate,
      title: lang === "ar" ? eco.discountRate.titleAr : eco.discountRate.titleEn,
      desc: lang === "ar" ? eco.discountRate.noteAr : eco.discountRate.noteEn,
      period: lang === "ar" ? eco.discountRate.periodLabelAr : eco.discountRate.periodLabelEn,
      icon: ShieldCheck,
      color: "text-sky-400",
    },
  ];

  return (
    <section id="economy" className="mb-12 scroll-mt-20" aria-label="CBE Economic Indicators">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-400" />
            <span>{t.economySectionTitle}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.economySectionSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{t.reportingDateLabel}:</span>
          <span className="text-slate-200 font-semibold">{eco.headlineInflation.reportingDate}</span>
          <span className="text-slate-600">·</span>
          <StatusBadge status={data?.status || "live"} lang={lang} />
        </div>
      </div>

      {/* Grid of 6 Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {indicators.map(({ item, title, desc, period, icon: Icon, color }, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs font-semibold text-slate-400">
                    {lang === "ar" ? item.frequencyAr : item.frequency}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  CBE
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                {title}
              </h3>

              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  {item.value.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-slate-400">{item.unit}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-2">
                {desc}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="truncate max-w-[200px]">{period}</span>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-sans shrink-0 ml-2 rtl:ml-0 rtl:mr-2"
              >
                <span>{lang === "ar" ? "المصدر" : "Source"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Monetary Policy Meeting & Statement Callout */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                {t.nextMeetingLabel}
              </h4>
              <span className="text-xs font-mono font-semibold text-amber-400">
                {eco.nextMpcMeeting}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {lang === "ar"
                ? eco.monetaryPolicySummaryAr
                : eco.monetaryPolicySummaryEn}
            </p>
          </div>
        </div>

        <a
          href="https://www.cbe.org.eg/en/economic-research/statistics/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-white rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span>{t.officialCbeLink}</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
        </a>
      </div>
    </section>
  );
};
