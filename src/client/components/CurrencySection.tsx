import React, { useState, useEffect } from "react";
import { CurrencyItem, CurrencyRatesData, MarketData } from "../../server/types.js";
import { Language, translations } from "../translations.js";
import { StatusBadge } from "./StatusBadge.js";
import {
  Search,
  ArrowRightLeft,
  ExternalLink,
  Calculator,
  DollarSign,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

interface CurrencySectionProps {
  data: MarketData<CurrencyRatesData> | null;
  lang: Language;
  loading: boolean;
  onRetry?: () => void;
}

// Fallback baseline currencies to guarantee the interface is never empty
const DEFAULT_FALLBACK_CURRENCIES: CurrencyItem[] = [
  { code: "USD", nameEn: "US Dollar", nameAr: "دولار أمريكي", symbol: "$", rateToEgp: 55.2818, invertedRate: 0.018089, flag: "🇺🇸" },
  { code: "EUR", nameEn: "Euro", nameAr: "يورو", symbol: "€", rateToEgp: 61.9315, invertedRate: 0.016147, flag: "🇪🇺" },
  { code: "GBP", nameEn: "British Pound", nameAr: "جنيه إسترليني", symbol: "£", rateToEgp: 73.9378, invertedRate: 0.013525, flag: "🇬🇧" },
  { code: "SAR", nameEn: "Saudi Riyal", nameAr: "ريال سعودي", symbol: "ر.س", rateToEgp: 14.7418, invertedRate: 0.067834, flag: "🇸🇦" },
  { code: "AED", nameEn: "UAE Dirham", nameAr: "درهم إماراتي", symbol: "د.إ", rateToEgp: 15.0529, invertedRate: 0.066432, flag: "🇦🇪" },
  { code: "KWD", nameEn: "Kuwaiti Dinar", nameAr: "دينار كويتي", symbol: "د.ك", rateToEgp: 178.2019, invertedRate: 0.005612, flag: "🇰🇼" },
  { code: "QAR", nameEn: "Qatari Riyal", nameAr: "ريال قطري", symbol: "ر.ق", rateToEgp: 15.1873, invertedRate: 0.065844, flag: "🇶🇦" },
  { code: "BHD", nameEn: "Bahraini Dinar", nameAr: "دينار بحريني", symbol: "د.ب", rateToEgp: 147.026, invertedRate: 0.006802, flag: "🇧🇭" },
  { code: "OMR", nameEn: "Omani Rial", nameAr: "ريال عماني", symbol: "ر.ع", rateToEgp: 143.7769, invertedRate: 0.006955, flag: "🇴🇲" },
  { code: "CAD", nameEn: "Canadian Dollar", nameAr: "دولار كندي", symbol: "C$", rateToEgp: 39.476, invertedRate: 0.025332, flag: "🇨🇦" },
  { code: "CHF", nameEn: "Swiss Franc", nameAr: "فرنك سويسري", symbol: "CHF", rateToEgp: 67.0258, invertedRate: 0.01492, flag: "🇨🇭" },
  { code: "JPY", nameEn: "Japanese Yen", nameAr: "ين ياباني", symbol: "¥", rateToEgp: 0.3525, invertedRate: 2.837147, flag: "🇯🇵" },
];

export const CurrencySection: React.FC<CurrencySectionProps> = ({
  data,
  lang,
  loading,
  onRetry,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState("");

  // Calculator state
  const [amount, setAmount] = useState<string>("100");
  const [fromCode, setFromCode] = useState<string>("USD");
  const [toCode, setToCode] = useState<string>("EGP");

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

  const getRate = (code: string): number => {
    if (code === "EGP") return 1;
    const item = currencies.find((c) => c.code === code);
    return item?.rateToEgp || 0;
  };

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const fromRate = getRate(fromCode);
  const toRate = getRate(toCode);

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

  const effectiveStatus = data?.status || (loading ? "live" : "stale");
  const effectiveSource = data?.source || "Open Exchange Rates API (open.er-api.com)";

  return (
    <section id="currencies" className="mb-12 scroll-mt-20" aria-label="Foreign Exchange Rates">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-400" />
            <span>{t.currenciesSectionTitle}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.currenciesSectionSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{t.colSource}:</span>
          <span className="text-slate-300 font-semibold">{effectiveSource}</span>
          <span className="text-slate-600">·</span>
          <StatusBadge status={effectiveStatus} lang={lang} />
        </div>
      </div>

      {/* Grid: Currency Table (2/3) + Calculator (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Currency Rates Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm flex flex-col">
          {/* Table Search Header */}
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

            <div className="text-xs text-slate-500 font-mono hidden sm:block">
              {filteredCurrencies.length} {lang === "ar" ? "عملات" : "currencies"}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-medium">
                  <th className="py-3 px-4">{t.colCurrency}</th>
                  <th className="py-3 px-4 text-right rtl:text-left">{t.colRateToEgp}</th>
                  <th className="py-3 px-4 text-right rtl:text-left">{t.colInvertedRate}</th>
                  <th className="py-3 px-4 text-center">{t.colStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {loading && !currencies.length ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="py-4 px-4 bg-slate-900/30" />
                    </tr>
                  ))
                ) : filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((c) => (
                    <tr
                      key={c.code}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setFromCode(c.code);
                        setToCode("EGP");
                      }}
                      title={
                        lang === "ar"
                          ? `تحويل ${c.nameAr} إلى الجنيه`
                          : `Convert ${c.nameEn} to EGP`
                      }
                    >
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

                      <td className="py-3 px-4 text-right rtl:text-left tabular-nums">
                        <span className="text-white font-bold text-sm">
                          {c.rateToEgp.toFixed(4)}
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
                        <StatusBadge status={effectiveStatus} lang={lang} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span>
                          {lang === "ar"
                            ? `لا توجد نتائج مطابقة لبحثك: "${searchTerm}"`
                            : `No matching currencies found for: "${searchTerm}"`}
                        </span>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-xs text-amber-400 hover:underline"
                        >
                          {lang === "ar" ? "مسح البحث" : "Clear search"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* CBE Bulletin Notice Banner */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">{t.cbeRatesNotice}</span>
            <a
              href="https://www.cbe.org.eg/en/economic-research/statistics/cbe-exchange-rates"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-amber-400 rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>{t.viewCbeRates}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Currency Conversion Calculator */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                {t.calculatorTitle}
              </h3>
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
                  onChange={(e) => setFromCode(e.target.value)}
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
                  onChange={(e) => setToCode(e.target.value)}
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
              <span className="block text-xs text-slate-500 mb-1">
                {t.convertedAmount}
              </span>
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
              ? "التحويل يعتمد على أسعار الصرف الحية بين البنوك دون احتساب هوامش صرافة التجزئة."
              : "Conversion uses live interbank market reference rates without retail cash markups."}
          </div>
        </div>
      </div>
    </section>
  );
};
