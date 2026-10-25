import React from "react";
import { Language, translations } from "../translations.js";
import { ShieldCheck, ExternalLink } from "lucide-react";

interface DataReliabilityFooterProps {
  lang: Language;
}

export const DataReliabilityFooter: React.FC<DataReliabilityFooterProps> = ({ lang }) => {
  const t = translations[lang];

  const statuses = [
    {
      badge: "live",
      label: t.statusLive,
      descEn: "Direct live automated observation feed",
      descAr: "رصد حي ومباشر عبر واجهات برمجة التطبيقات المعتمدة",
      color: "bg-emerald-500",
    },
    {
      badge: "delayed",
      label: t.statusDelayed,
      descEn: "Complies with EGX 15-minute exchange delay during active sessions",
      descAr: "خاضع لسياسة تأخير البورصة المصرية (15 دقيقة) أثناء الجلسة",
      color: "bg-amber-500",
    },
    {
      badge: "estimated",
      label: t.statusEstimated,
      descEn: "Mathematically derived intrinsic value from global bullion spot",
      descAr: "قيمة جوهرية محسوبة رياضياً من سعر الأوقية بالبورصة العالمية",
      color: "bg-sky-500",
    },
    {
      badge: "stale",
      label: t.statusStale,
      descEn: "Temporarily serving the last verified cache entry during outages",
      descAr: "عرض آخر رصد مسجل وموثق عند حدوث بطء في المصدر",
      color: "bg-orange-500",
    },
  ];

  const sources = [
    {
      name: "The Egyptian Exchange (EGX)",
      nameAr: "البورصة المصرية",
      url: "https://www.egx.com.eg/",
      roleEn: "EGX 30, EGX 70, EGX 100 benchmark indices & trading schedule",
      roleAr: "المؤشرات الرسمية إيجي إكس 30 و 70 و 100 وجدول التداول",
    },
    {
      name: "TradingView",
      nameAr: "تريدنج فيو العالمية",
      url: "https://www.tradingview.com/markets/stocks-egypt/",
      roleEn: "Interactive embedded charts and technical historical data",
      roleAr: "المخططات البيانية المتقدمة وبيانات التداول التاريخية",
    },
    {
      name: "Central Bank of Egypt (CBE)",
      nameAr: "البنك المركزي المصري",
      url: "https://www.cbe.org.eg/",
      roleEn: "Overnight policy interest rates, corridor, and official inflation releases",
      roleAr: "أسعار الفائدة الأساسية وقرارات لجنة السياسة النقدية وبيانات التضخم",
    },
    {
      name: "Open Exchange Rates & FX Providers",
      nameAr: "مزودو أسعار الصرف العالمية",
      url: "https://open.er-api.com/",
      roleEn: "Interbank cross exchange rates for USD, EUR, GBP, SAR, AED, KWD",
      roleAr: "أسعار الصرف المرجعية بين البنوك للعملات الرئيسية مقابل الجنيه",
    },
    {
      name: "Gold API & International Bullion",
      nameAr: "البورصة العالمية للمعادن الثمينة",
      url: "https://gold-api.com/",
      roleEn: "Live gold spot price (XAU/USD) per troy ounce",
      roleAr: "السعر الفوري لأوقية الذهب بالدولار عالمياً",
    },
    {
      name: "iSagha Gold Pricing Platform",
      nameAr: "منصة آي صاغة للذهب",
      url: "https://market.isagha.com/prices",
      roleEn: "Real Egyptian retail jewelry quotes (24K, 21K, 18K, Gold Pound)",
      roleAr: "أسعار التجزئة الفعلية لمحال الصاغة المصرية (بيع وشراء)",
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-12 pb-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Transparency Charter */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 mb-10">
          <div className="flex items-center gap-2 mb-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.footerReliabilityTitle}</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-6 max-w-4xl">
            {t.footerReliabilityText}
          </p>

          {/* Status Taxonomy Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            {statuses.map((s, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className={`w-2 h-2 rounded-full ${s.color} mt-1.5 shrink-0`} />
                <div>
                  <span className="font-bold text-white block text-xs">
                    {s.label}
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    {lang === "ar" ? s.descAr : s.descEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Directory of Sources */}
        <div className="mb-10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            {t.sourcesTitle}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/30 flex flex-col justify-between"
              >
                <div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-slate-200 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 mb-1"
                  >
                    <span>{lang === "ar" ? src.nameAr : src.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === "ar" ? src.roleAr : src.roleEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="leading-relaxed max-w-3xl">
            {t.disclaimerText}
          </p>
          <div className="font-mono text-slate-500 whitespace-nowrap">
            Egypt Markets Pulse © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
};
