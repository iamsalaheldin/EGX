import React, { useState, useMemo } from "react";
import {
  EGX_SECTORS_DATA,
  EGX_INDUSTRIES_DATA,
  EgxTradingViewSector,
  EgxTradingViewIndustry,
} from "../data/egxTradingViewData.js";
import { Language } from "../translations.js";
import {
  Layers,
  Briefcase,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronDown,
  Building2,
  TrendingUp,
  TrendingDown,
  PieChart,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

interface EgxTradingViewSectorsIndustriesProps {
  lang: Language;
  isDark?: boolean;
}

type MainTab = "sectors" | "industries";
type SubTab = "overview" | "performance";

type SortField =
  | "name"
  | "marketCap"
  | "divYield"
  | "change"
  | "volume"
  | "subCount"
  | "stocks"
  | "perf_1w"
  | "perf_1m"
  | "perf_3m"
  | "perf_6m"
  | "perf_ytd"
  | "perf_1y"
  | "perf_5y"
  | "perf_10y"
  | "perf_allTime";

type SortOrder = "asc" | "desc";

export const EgxTradingViewSectorsIndustries: React.FC<EgxTradingViewSectorsIndustriesProps> = ({
  lang,
}) => {
  const isAr = lang === "ar";

  const [mainTab, setMainTab] = useState<MainTab>("sectors");
  const [subTab, setSubTab] = useState<SubTab>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedParentSector, setSelectedParentSector] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Format percent color cell
  const renderPerfCell = (val: number | null | undefined) => {
    if (val === null || val === undefined) {
      return <span className="text-slate-500 font-mono">—</span>;
    }
    const isPos = val > 0;
    const isZero = val === 0;

    let colorClass = "text-slate-300";
    if (isPos) {
      colorClass = "text-emerald-400";
    } else if (!isZero) {
      colorClass = "text-rose-400";
    }

    const formatted = `${isPos ? "+" : ""}${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;

    return (
      <span className={`font-mono font-medium ${colorClass}`} dir="ltr">
        {formatted}
      </span>
    );
  };

  // Format yield cell
  const renderYieldCell = (val: number | null | undefined) => {
    if (val === null || val === undefined) {
      return <span className="text-slate-500 font-mono">—</span>;
    }
    return (
      <span className="font-mono text-slate-200" dir="ltr">
        {val.toFixed(2)}%
      </span>
    );
  };

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc"); // Default to descending for finance metrics
    }
  };

  // Distinct parent sectors for filtering in industries tab
  const parentSectorsList = useMemo(() => {
    const sectorsSet = new Set<string>();
    EGX_INDUSTRIES_DATA.forEach((ind) => {
      sectorsSet.add(ind.parentSectorAr);
    });
    return Array.from(sectorsSet).sort();
  }, []);

  // Filtered and sorted Sectors
  const processedSectors = useMemo(() => {
    let list = [...EGX_SECTORS_DATA];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.nameAr.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      switch (sortField) {
        case "name":
          valA = isAr ? a.nameAr : a.nameEn;
          valB = isAr ? b.nameAr : b.nameEn;
          return sortOrder === "asc"
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        case "marketCap":
          valA = a.marketCapRaw;
          valB = b.marketCapRaw;
          break;
        case "divYield":
          valA = a.dividendYield ?? -9999;
          valB = b.dividendYield ?? -9999;
          break;
        case "change":
          valA = a.changePercent;
          valB = b.changePercent;
          break;
        case "volume":
          valA = a.volumeRaw;
          valB = b.volumeRaw;
          break;
        case "subCount":
          valA = a.industriesCount;
          valB = b.industriesCount;
          break;
        case "stocks":
          valA = a.stocksCount;
          valB = b.stocksCount;
          break;
        case "perf_1w":
          valA = a.perf.oneWeek;
          valB = b.perf.oneWeek;
          break;
        case "perf_1m":
          valA = a.perf.oneMonth;
          valB = b.perf.oneMonth;
          break;
        case "perf_3m":
          valA = a.perf.threeMonths;
          valB = b.perf.threeMonths;
          break;
        case "perf_6m":
          valA = a.perf.sixMonths;
          valB = b.perf.sixMonths;
          break;
        case "perf_ytd":
          valA = a.perf.ytd;
          valB = b.perf.ytd;
          break;
        case "perf_1y":
          valA = a.perf.oneYear;
          valB = b.perf.oneYear;
          break;
        case "perf_5y":
          valA = a.perf.fiveYears;
          valB = b.perf.fiveYears;
          break;
        case "perf_10y":
          valA = a.perf.tenYears;
          valB = b.perf.tenYears;
          break;
        case "perf_allTime":
          valA = a.perf.allTime;
          valB = b.perf.allTime;
          break;
        default:
          valA = a.marketCapRaw;
          valB = b.marketCapRaw;
      }

      if (valA === valB) return 0;
      return sortOrder === "asc"
        ? (valA as number) > (valB as number)
          ? 1
          : -1
        : (valA as number) < (valB as number)
        ? 1
        : -1;
    });

    return list;
  }, [searchQuery, sortField, sortOrder, isAr]);

  // Filtered and sorted Industries
  const processedIndustries = useMemo(() => {
    let list = [...EGX_INDUSTRIES_DATA];

    if (selectedParentSector !== "all") {
      list = list.filter((i) => i.parentSectorAr === selectedParentSector);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.nameAr.toLowerCase().includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          i.parentSectorAr.toLowerCase().includes(q) ||
          i.parentSectorEn.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      switch (sortField) {
        case "name":
          valA = isAr ? a.nameAr : a.nameEn;
          valB = isAr ? b.nameAr : b.nameEn;
          return sortOrder === "asc"
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        case "subCount": // in industries, this represents parent sector
          valA = isAr ? a.parentSectorAr : a.parentSectorEn;
          valB = isAr ? b.parentSectorAr : b.parentSectorEn;
          return sortOrder === "asc"
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        case "marketCap":
          valA = a.marketCapRaw;
          valB = b.marketCapRaw;
          break;
        case "divYield":
          valA = a.dividendYield ?? -9999;
          valB = b.dividendYield ?? -9999;
          break;
        case "change":
          valA = a.changePercent ?? -9999;
          valB = b.changePercent ?? -9999;
          break;
        case "volume":
          valA = a.volumeRaw;
          valB = b.volumeRaw;
          break;
        case "stocks":
          valA = a.stocksCount;
          valB = b.stocksCount;
          break;
        case "perf_1w":
          valA = a.perf.oneWeek ?? -99999;
          valB = b.perf.oneWeek ?? -99999;
          break;
        case "perf_1m":
          valA = a.perf.oneMonth ?? -99999;
          valB = b.perf.oneMonth ?? -99999;
          break;
        case "perf_3m":
          valA = a.perf.threeMonths ?? -99999;
          valB = b.perf.threeMonths ?? -99999;
          break;
        case "perf_6m":
          valA = a.perf.sixMonths ?? -99999;
          valB = b.perf.sixMonths ?? -99999;
          break;
        case "perf_ytd":
          valA = a.perf.ytd ?? -99999;
          valB = b.perf.ytd ?? -99999;
          break;
        case "perf_1y":
          valA = a.perf.oneYear ?? -99999;
          valB = b.perf.oneYear ?? -99999;
          break;
        case "perf_5y":
          valA = a.perf.fiveYears ?? -99999;
          valB = b.perf.fiveYears ?? -99999;
          break;
        case "perf_10y":
          valA = a.perf.tenYears ?? -99999;
          valB = b.perf.tenYears ?? -99999;
          break;
        case "perf_allTime":
          valA = a.perf.allTime ?? -99999;
          valB = b.perf.allTime ?? -99999;
          break;
        default:
          valA = a.marketCapRaw;
          valB = b.marketCapRaw;
      }

      if (valA === valB) return 0;
      return sortOrder === "asc"
        ? (valA as number) > (valB as number)
          ? 1
          : -1
        : (valA as number) < (valB as number)
        ? 1
        : -1;
    });

    return list;
  }, [selectedParentSector, searchQuery, sortField, sortOrder, isAr]);

  // Sort arrow indicator helper
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-80 inline-block shrink-0" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-amber-400 inline-block shrink-0" />
    ) : (
      <ArrowDown className="w-3 h-3 text-amber-400 inline-block shrink-0" />
    );
  };

  const tradingViewSectorUrl = "https://ar.tradingview.com/markets/stocks-egypt/sectorandindustry-sector/";
  const tradingViewIndustryUrl = "https://ar.tradingview.com/markets/stocks-egypt/sectorandindustry-industry/";

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* 1. Header Section - TradingView Style with Egyptian Flag & Context */}
      <div className="p-5 md:p-6 border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        {/* Breadcrumb Context */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
          <span>{isAr ? "الأسواق" : "Markets"}</span>
          <span className="text-slate-600">/</span>
          <span>{isAr ? "مصر" : "Egypt"}</span>
          <span className="text-slate-600">/</span>
          <span>{isAr ? "الأسهم" : "Stocks"}</span>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-semibold">
            {isAr ? "القطاعات والصناعات" : "Sectors & Industries"}
          </span>
        </div>

        {/* Main Title Banner with Switcher Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🇪🇬</span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-1">
                <span>{isAr ? "الأسهم المصرية" : "Egyptian Stocks"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>{isAr ? "القطاعات والصناعات" : "Sectors and Industries"}</span>
            </h3>
          </div>

          {/* Top Main Tab Pills: القطاعات vs الصناعات */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start lg:self-center">
            <button
              onClick={() => {
                setMainTab("sectors");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                mainTab === "sectors"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{isAr ? "القطاعات" : "Sectors"}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-300 font-mono">
                20
              </span>
            </button>

            <button
              onClick={() => {
                setMainTab("industries");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                mainTab === "industries"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? "الصناعات" : "Industries"}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-300 font-mono">
                68
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Context Title & Description matching TradingView text */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>
                {mainTab === "sectors"
                  ? isAr
                    ? "قطاعات سوق الأسهم - مصر"
                    : "Egyptian Stock Market Sectors"
                  : isAr
                  ? "مجالات سوق الأسهم - مصر"
                  : "Egyptian Stock Market Industries"}
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {mainTab === "sectors"
                ? isAr
                  ? "الجدول المدرج ادناه يعرض القطاعات مع عرض أدائها وقيمتها السوقية وحجم التداول وعدد الأسهم ، قم بالبحث في القطاعات المختلفة لتجد الأسهم الواعدة."
                  : "The table below displays market sectors alongside their performance, market capitalization, trading volume, and stock counts. Search sectors to spot high-conviction opportunities."
                : isAr
                ? "الجدول المدرج ادناه يعرض مجالات الأسهم مع عرض أدائها وقيمتها السوقية وحجم التداول وعدد الأسهم ، قم بالبحث في القطاعات المختلفة لتصفية النتائج وإيجاد الأمثل."
                : "The table below details 68 specialized industries across the Egyptian exchange with real-time performance, market caps, and parent sector classifications."}
            </p>
          </div>

          {/* Link to Official TradingView page */}
          <a
            href={mainTab === "sectors" ? tradingViewSectorUrl : tradingViewIndustryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-xs font-medium border border-slate-700/60 transition-colors shrink-0"
          >
            <span>{isAr ? "عرض المصدر في TradingView" : "Open in TradingView"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left / Start: Sub-tabs (نظرة عامة vs الأداء) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setSubTab("overview")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === "overview"
                ? "bg-amber-400 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isAr ? "نظرة عامة" : "Overview"}
          </button>
          <button
            onClick={() => setSubTab("performance")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === "performance"
                ? "bg-amber-400 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isAr ? "الأداء" : "Performance"}
          </button>
        </div>

        {/* Right / End: Search Bar + Sector Filter Dropdown (for Industries) */}
        <div className="flex items-center gap-2 flex-1 max-w-lg md:justify-end">
          {/* Parent Sector Dropdown Filter (only when viewing Industries) */}
          {mainTab === "industries" && (
            <div className="relative shrink-0">
              <select
                value={selectedParentSector}
                onChange={(e) => setSelectedParentSector(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400 appearance-none pr-7 rtl:pr-7 ltr:pl-7 cursor-pointer"
              >
                <option value="all">{isAr ? "جميع القطاعات (الكل)" : "All Sectors"}</option>
                {parentSectorsList.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-2 rtl:right-2 ltr:left-2 pointer-events-none" />
            </div>
          )}

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 ltr:left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                mainTab === "sectors"
                  ? isAr
                    ? "بحث في الـ 20 قطاع..."
                    : "Search 20 sectors..."
                  : isAr
                  ? "بحث في الـ 68 صناعة..."
                  : "Search 68 industries..."
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 -translate-y-1/2 left-2.5 rtl:left-2.5 ltr:right-2.5 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {(searchQuery || selectedParentSector !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedParentSector("all");
              }}
              title={isAr ? "إعادة تعيين الفلاتر" : "Reset filters"}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Metrics Summary Banner */}
      <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span>
            {isAr ? "النتائج المعروضة:" : "Showing:"}{" "}
            <strong className="text-white font-mono">
              {mainTab === "sectors" ? processedSectors.length : processedIndustries.length}
            </strong>{" "}
            {mainTab === "sectors"
              ? isAr
                ? "من أصل 20 قطاعاً"
                : "of 20 sectors"
              : isAr
              ? "من أصل 68 صناعة"
              : "of 68 industries"}
          </span>
          {mainTab === "sectors" && (
            <span className="hidden sm:inline">
              {isAr ? "إجمالي الشركات المقيدة:" : "Total Listed Stocks:"}{" "}
              <strong className="text-amber-400 font-mono">260+</strong>
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          {isAr
            ? "اضغط على أي رأس عمود لترتيب البيانات تصاعدياً أو تنازلياً"
            : "Click any column header to sort ascending or descending"}
        </div>
      </div>

      {/* 4. The Interactive Tables */}
      <div className="overflow-x-auto">
        {/* ========================================================= */}
        {/* VIEW 1: SECTORS (القطاعات - 20)                          */}
        {/* ========================================================= */}
        {mainTab === "sectors" && (
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80 font-semibold select-none">
                {/* 1. Sector Name */}
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-3.5 sticky right-0 rtl:right-0 ltr:left-0 bg-slate-950 z-10 cursor-pointer hover:text-white transition-colors min-w-[200px]"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span>
                      {isAr ? "قطاع" : "Sector"} (20)
                    </span>
                    {renderSortIndicator("name")}
                  </div>
                </th>

                {/* Sub-tab A: Overview Columns */}
                {subTab === "overview" && (
                  <>
                    <th
                      onClick={() => handleSort("marketCap")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[130px]"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span>{isAr ? "القيمة السوقية" : "Market Cap"}</span>
                        {renderSortIndicator("marketCap")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("divYield")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[110px]"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span>{isAr ? "عائد Div% (محدد)" : "Div Yield %"}</span>
                        {renderSortIndicator("divYield")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("change")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[100px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{isAr ? "التغيير %" : "Change %"}</span>
                        {renderSortIndicator("change")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("volume")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[110px]"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span>{isAr ? "حجم تداول" : "Volume"}</span>
                        {renderSortIndicator("volume")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("subCount")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[100px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{isAr ? "الصناعات" : "Industries"}</span>
                        {renderSortIndicator("subCount")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("stocks")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[90px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{isAr ? "الأسهم" : "Stocks"}</span>
                        {renderSortIndicator("stocks")}
                      </div>
                    </th>
                  </>
                )}

                {/* Sub-tab B: Performance Columns */}
                {subTab === "performance" && (
                  <>
                    <th
                      onClick={() => handleSort("change")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "التغيير %" : "Change %"}</span>
                        {renderSortIndicator("change")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_1w")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 1 أسبوع" : "1W %"}</span>
                        {renderSortIndicator("perf_1w")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_1m")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 1 شهر" : "1M %"}</span>
                        {renderSortIndicator("perf_1m")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_3m")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 3 أشهر" : "3M %"}</span>
                        {renderSortIndicator("perf_3m")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_6m")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 6 أشهر" : "6M %"}</span>
                        {renderSortIndicator("perf_6m")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_ytd")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % YTD" : "YTD %"}</span>
                        {renderSortIndicator("perf_ytd")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_1y")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 1 سنة" : "1Y %"}</span>
                        {renderSortIndicator("perf_1y")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_5y")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 5 سنوات" : "5Y %"}</span>
                        {renderSortIndicator("perf_5y")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_10y")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[90px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 10 سنوات" : "10Y %"}</span>
                        {renderSortIndicator("perf_10y")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_allTime")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[100px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "جميع الأوقات %" : "All Time %"}</span>
                        {renderSortIndicator("perf_allTime")}
                      </div>
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {processedSectors.map((sec, index) => {
                return (
                  <tr
                    key={sec.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Sector Name */}
                    <td className="py-3 px-3.5 sticky right-0 rtl:right-0 ltr:left-0 bg-slate-900 group-hover:bg-slate-800/90 transition-colors z-10 border-l rtl:border-l ltr:border-r border-slate-800/50">
                      <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                        {isAr ? sec.nameAr : sec.nameEn}
                      </div>
                    </td>

                    {/* OVERVIEW DATA */}
                    {subTab === "overview" && (
                      <>
                        <td className="py-3 px-3 font-mono font-medium text-slate-200">
                          {sec.marketCapDisplay}
                        </td>
                        <td className="py-3 px-3">
                          {renderYieldCell(sec.dividendYield)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {renderPerfCell(sec.changePercent)}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {sec.volumeDisplay}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              setMainTab("industries");
                              setSelectedParentSector(sec.nameAr);
                            }}
                            className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono font-medium hover:underline text-xs"
                            title={isAr ? "عرض صناعات هذا القطاع" : "View industries in sector"}
                          >
                            {sec.industriesCount}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                          {sec.stocksCount}
                        </td>
                      </>
                    )}

                    {/* PERFORMANCE DATA */}
                    {subTab === "performance" && (
                      <>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.changePercent)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.oneWeek)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.oneMonth)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.threeMonths)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.sixMonths)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.ytd)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.oneYear)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.fiveYears)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.tenYears)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(sec.perf.allTime)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: INDUSTRIES (الصناعات - 68)                       */}
        {/* ========================================================= */}
        {mainTab === "industries" && (
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80 font-semibold select-none">
                {/* 1. Industry Name */}
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-3.5 sticky right-0 rtl:right-0 ltr:left-0 bg-slate-950 z-10 cursor-pointer hover:text-white transition-colors min-w-[200px]"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span>
                      {isAr ? "صناعة" : "Industry"} ({processedIndustries.length})
                    </span>
                    {renderSortIndicator("name")}
                  </div>
                </th>

                {/* Sub-tab A: Overview Columns */}
                {subTab === "overview" && (
                  <>
                    <th
                      onClick={() => handleSort("marketCap")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[130px]"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span>{isAr ? "القيمة السوقية" : "Market Cap"}</span>
                        {renderSortIndicator("marketCap")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("divYield")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[110px]"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span>{isAr ? "عائد Div% (محدد)" : "Div Yield %"}</span>
                        {renderSortIndicator("divYield")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("change")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[100px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{isAr ? "التغيير %" : "Change %"}</span>
                        {renderSortIndicator("change")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("volume")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[110px]"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span>{isAr ? "حجم تداول" : "Volume"}</span>
                        {renderSortIndicator("volume")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("subCount")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[140px]"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span>{isAr ? "القطاع" : "Sector"}</span>
                        {renderSortIndicator("subCount")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("stocks")}
                      className="py-3 px-3 cursor-pointer hover:text-white transition-colors min-w-[80px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{isAr ? "الأسهم" : "Stocks"}</span>
                        {renderSortIndicator("stocks")}
                      </div>
                    </th>
                  </>
                )}

                {/* Sub-tab B: Performance Columns */}
                {subTab === "performance" && (
                  <>
                    <th
                      onClick={() => handleSort("change")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "التغيير %" : "Change %"}</span>
                        {renderSortIndicator("change")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_1w")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 1 أسبوع" : "1W %"}</span>
                        {renderSortIndicator("perf_1w")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_1m")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 1 شهر" : "1M %"}</span>
                        {renderSortIndicator("perf_1m")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_3m")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 3 أشهر" : "3M %"}</span>
                        {renderSortIndicator("perf_3m")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_6m")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 6 أشهر" : "6M %"}</span>
                        {renderSortIndicator("perf_6m")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_ytd")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % YTD" : "YTD %"}</span>
                        {renderSortIndicator("perf_ytd")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_1y")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 1 سنة" : "1Y %"}</span>
                        {renderSortIndicator("perf_1y")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_5y")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[85px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 5 سنوات" : "5Y %"}</span>
                        {renderSortIndicator("perf_5y")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_10y")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[90px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "الأداء % 10 سنوات" : "10Y %"}</span>
                        {renderSortIndicator("perf_10y")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("perf_allTime")}
                      className="py-3 px-2 cursor-pointer hover:text-white transition-colors min-w-[100px] text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{isAr ? "جميع الأوقات %" : "All Time %"}</span>
                        {renderSortIndicator("perf_allTime")}
                      </div>
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {processedIndustries.map((ind) => {
                return (
                  <tr
                    key={ind.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Industry Name */}
                    <td className="py-3 px-3.5 sticky right-0 rtl:right-0 ltr:left-0 bg-slate-900 group-hover:bg-slate-800/90 transition-colors z-10 border-l rtl:border-l ltr:border-r border-slate-800/50">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {isAr ? ind.nameAr : ind.nameEn}
                      </div>
                    </td>

                    {/* OVERVIEW DATA */}
                    {subTab === "overview" && (
                      <>
                        <td className="py-3 px-3 font-mono font-medium text-slate-200">
                          {ind.marketCapDisplay}
                        </td>
                        <td className="py-3 px-3">
                          {renderYieldCell(ind.dividendYield)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {renderPerfCell(ind.changePercent)}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {ind.volumeDisplay}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => setSelectedParentSector(ind.parentSectorAr)}
                            className="text-xs text-slate-300 hover:text-amber-400 hover:underline transition-colors block truncate max-w-[150px]"
                            title={isAr ? "فلترة بواسطة هذا القطاع" : "Filter by this sector"}
                          >
                            {isAr ? ind.parentSectorAr : ind.parentSectorEn}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                          {ind.stocksCount}
                        </td>
                      </>
                    )}

                    {/* PERFORMANCE DATA */}
                    {subTab === "performance" && (
                      <>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.changePercent)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.oneWeek)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.oneMonth)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.threeMonths)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.sixMonths)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.ytd)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.oneYear)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.fiveYears)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.tenYears)}</td>
                        <td className="py-2.5 px-2 text-center">{renderPerfCell(ind.perf.allTime)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. Footer info & navigation back to top */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            {isAr
              ? "بيانات مطابقة للبورصة المصرية EGX عبر TradingView"
              : "Live verified Egyptian Stock Exchange data via TradingView"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={tradingViewSectorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>{isAr ? "قطاعات TradingView" : "TradingView Sectors"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-700">•</span>
          <a
            href={tradingViewIndustryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <span>{isAr ? "مجالات TradingView" : "TradingView Industries"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
