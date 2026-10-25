import React, { useState } from "react";
import { EGXData, EgxStockItem, EgxSectorPerformance } from "../../server/types.js";
import { Language, translations } from "../translations.js";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  Zap,
  Percent,
  SlidersHorizontal,
  Building2,
  Coins,
  Gauge,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  LayoutGrid,
  ListFilter,
  BarChart2,
  Search,
  CheckCircle2,
} from "lucide-react";

interface EgxMarketOverviewProps {
  data: EGXData | null | undefined;
  lang: Language;
  isDark: boolean;
}

export const EgxMarketOverview: React.FC<EgxMarketOverviewProps> = ({
  data,
  lang,
  isDark,
}) => {
  const t = translations[lang];

  // Active stock group filter pill
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  // Screener view mode: cards or table
  const [screenerViewMode, setScreenerViewMode] = useState<"cards" | "table">("cards");
  // Search query within the stock group
  const [screenerSearch, setScreenerSearch] = useState<string>("");
  // Open FAQ item index
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0, 1]); // First two opened by default

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const isAr = lang === "ar";

  // Stock groups pills list
  const stockGroups = [
    { id: "all", labelAr: "جميع الأسهم", labelEn: "All Stocks" },
    { id: "gainers", labelAr: "الأكثر ارتفاعاً", labelEn: "Top Gainers" },
    { id: "losers", labelAr: "أكبر الخاسرين", labelEn: "Top Losers" },
    { id: "blue_chips", labelAr: "الشركات العملاقة", labelEn: "Blue Chips" },
    { id: "most_active", labelAr: "الأكثر نشاطاً", labelEn: "Most Active" },
    { id: "unusual_volume", labelAr: "زخم غير اعتيادي", labelEn: "Unusual Volume" },
    { id: "high_volatility", labelAr: "الأكثر تذبذباً", labelEn: "High Volatility" },
    { id: "high_div", labelAr: "أعلى توزيعات أرباح", labelEn: "High Div Yield" },
    { id: "high_beta", labelAr: "بيتا عالية", labelEn: "High Beta" },
    { id: "52w_high", labelAr: "أقصى ارتفاع خلال 52 أسبوع", labelEn: "52-Week High" },
    { id: "52w_low", labelAr: "أدنى مستوى خلال 52 أسبوع", labelEn: "52-Week Low" },
    { id: "oversold", labelAr: "تشبع بيعي (RSI)", labelEn: "Oversold RSI" },
  ];

  // FAQs data list with complete bilingual explanations
  const faqs = [
    {
      qAr: "ما المقصود بتداول الأسهم؟",
      qEn: "What is stock trading?",
      aAr: "تداول الأسهم هو عملية شراء وبيع حصص ملكية في شركات مساهمة مقيدة في البورصة (مثل البورصة المصرية EGX). يهدف المستثمر إلى تحقيق عوائد عبر نمو قيمة السهم الرأسمالية أو الحصول على توزيعات أرباح دورية.",
      aEn: "Stock trading involves buying and selling equity shares of publicly listed companies on an exchange (such as EGX). Traders seek capital appreciation as prices rise or recurring income via dividends.",
    },
    {
      qAr: "متى يفتح سوق الأسهم المصرية EGX ومتى يُغلق؟",
      qEn: "When does the Egyptian stock market open and close?",
      aAr: "تُعقد جلسات التداول بالبورصة المصرية من الأحد إلى الخميس. تبدأ جلسة استكشاف السعر (مزاد ما قبل الفتح) من الساعة 09:30 حتى 10:00 صباحاً بتوقيت القاهرة، وتبدأ جلسة التداول المستمر من 10:00 صباحاً حتى 02:30 ظهراً. يومي الجمعة والسبت عطلة أسبوعية.",
      aEn: "Trading runs Sunday through Thursday. Pre-opening discovery auction is 09:30 to 10:00 AM Cairo time, followed by continuous trading from 10:00 AM to 02:30 PM. Fridays and Saturdays are weekend holidays.",
    },
    {
      qAr: "ما هي أسهم الشركات القيادية (Blue Chips) في مصر؟",
      qEn: "What are Blue Chip stocks on the EGX?",
      aAr: "هي أسهم الشركات الكبرى ذات الملاءة المالية المرتفعة وتاريخ طويل من الاستقرار والسيولة العالية، مثل البنك التجاري الدولي (COMI)، مجموعة طلعت مصطفى (TMGH)، والمصرية للاتصالات (ETEL). تشكل هذه الشركات الوزن الأكبر في مؤشر EGX 30.",
      aEn: "Blue chips are large-cap, financially robust market leaders with substantial liquidity and institutional following, such as Commercial International Bank (COMI), Talaat Moustafa Group (TMGH), and Telecom Egypt (ETEL).",
    },
    {
      qAr: "كيف يمكن تحقيق الأرباح من الأسهم؟",
      qEn: "How can one generate profit from stocks?",
      aAr: "تتحقق الأرباح بطريقتين رئيسيتين: أولاً، الأرباح الرأسمالية (Capital Gains) الناتجة عن بيع السهم بسعر أعلى من سعر الشراء عند صعوده. ثانياً، التوزيعات النقدية والأسهم المجانية (Dividends) التي توزعها الشركات الرابحة سنوياً أو نصف سنوياً على المساهمين.",
      aEn: "Profits are generated through capital gains (selling appreciated shares at higher prices) and cash/share dividends distributed periodically by profitable companies to shareholders.",
    },
    {
      qAr: "ما هو اتساع السوق (Market Breadth) ولماذا يُعد مؤشراً حاسماً؟",
      qEn: "What is Market Breadth and why is it crucial?",
      aAr: "اتساع السوق يقيس مدى شمولية الصعود أو الهبوط عبر فحص نسبة الأسهم الصاعدة مقارنة بالهابطة، وعدد الأسهم المتداولة أعلى متوسطاتها المتحركة (50 و 200 يوم). عندما يصعد المؤشر بينما معظم الأسهم هابطة، يُعتبر الصعود ضعيفاً ومقوداً بأسهم محدودة.",
      aEn: "Market breadth measures the participation across the broader market by comparing advancing vs declining issues and tracking stocks above moving averages (50-day and 200-day). It reveals whether a rally is broad-based or narrow.",
    },
    {
      qAr: "ما معنى 'زخم غير اعتيادي' (Unusual Volume) في الأسهم؟",
      qEn: "What does Unusual Volume mean?",
      aAr: "هو ارتفاع حجم التداول على سهم ما بأضعاف مضاعفة مقارنة بمتوسط حجمه اليومي المعتاد (مثلاً 200% إلى 400%). يشير ذلك عادة إلى دخول سيولة مؤسسية كبيرة أو تسريب أخبار جوهرية مثل اندماجات أو عروض استحواذ.",
      aEn: "Unusual volume occurs when trading activity surges significantly above a stock's historical average (e.g. 200%-400%), often signalling institutional accumulation or incoming material corporate news.",
    },
    {
      qAr: "ما هو معامل بيتا (Beta) في الأسهم؟",
      qEn: "What is Beta in stock analysis?",
      aAr: "معامل بيتا يقيس مدى حساسية السهم وحركته مقارنة بالسوق ككل (مؤشر EGX 30). إذا كانت بيتا أكبر من 1، فالسهم يتحرك بتذبذب أعلى من السوق (مخاطرة وعائد أعلى)، وإذا كانت أقل من 1 يكون السهم أكثر استقراراً وهدوءاً.",
      aEn: "Beta measures a stock's volatility relative to the overall benchmark index (EGX 30). Beta > 1 signifies greater volatility and risk/reward, while Beta < 1 indicates a more defensive, stable stock.",
    },
    {
      qAr: "ما الفرق بين مؤشرات EGX 30 و EGX 70 و EGX 100؟",
      qEn: "What is the difference between EGX 30, EGX 70, and EGX 100?",
      aAr: "مؤشر EGX 30 يقيس أداء أكبر 30 شركة ذات سيولة ورأس مال، وموزون بالقيمة السوقية الحرة. أما EGX 70 EWI فيقيس أداء 70 شركة متوسطة وصغيرة بوزن متساوٍ لجميع الأسهم. ومؤشر EGX 100 EWI يجمع بين الاثنين ليعطي صورة شاملة لـ 100 سهم تمثل 90% من سيولة السوق.",
      aEn: "EGX 30 tracks the 30 largest and most liquid corporations weighted by free float market cap. EGX 70 EWI tracks 70 small and mid-caps with equal weighting. EGX 100 EWI combines both to represent the broader Egyptian stock universe.",
    },
  ];

  // Helper for performance badge color
  const getPerfColor = (val: number) => {
    if (val > 100) return "bg-emerald-950 text-emerald-300 border-emerald-600 font-bold";
    if (val > 20) return "bg-emerald-900/60 text-emerald-400 border-emerald-700/60";
    if (val > 0) return "bg-emerald-950/40 text-emerald-400 border-emerald-800/40";
    if (val === 0) return "bg-slate-800 text-slate-300 border-slate-700";
    if (val > -10) return "bg-rose-950/40 text-rose-300 border-rose-900/40";
    if (val > -20) return "bg-rose-900/60 text-rose-400 border-rose-800/60";
    return "bg-rose-950 text-rose-300 border-rose-600 font-bold";
  };

  // Safe fallback data
  const breadth = data?.marketBreadth || {
    decliningCount: 247,
    advancingCount: 11,
    unchangedCount: 8,
    decliningPercent: 96,
    advancingPercent: 4,
    above50DayMaPercent: 8,
    above200DayMaPercent: 29,
    newHighsLows: [
      { periodAr: "أسبوع", periodEn: "1W", highs: 4, lows: 156 },
      { periodAr: "شهر", periodEn: "1M", highs: 12, lows: 238 },
      { periodAr: "3 أشهر", periodEn: "3M", highs: 25, lows: 312 },
      { periodAr: "سنة", periodEn: "1Y", highs: 80, lows: 340 },
    ],
  };

  const mostActive = data?.mostActive || [];
  const unusualVolume = data?.unusualVolume || [];
  const highVolatility = data?.highVolatility || [];
  const topGainers = data?.topGainers || [];
  const topLosers = data?.topLosers || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const sectorsHeatmap = data?.sectorsHeatmap || [];

  // Detailed stock interface with special metric highlights
  interface DetailedStock {
    symbol: string;
    nameAr: string;
    nameEn: string;
    sectorAr: string;
    sectorEn: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    marketCap: string;
    specialMetricAr: string;
    specialMetricEn: string;
    badgeAr?: string;
    badgeEn?: string;
  }

  interface StockGroupCatalog {
    id: string;
    labelAr: string;
    labelEn: string;
    descAr: string;
    descEn: string;
    icon: React.ComponentType<{ className?: string }>;
    colorBadge: string;
    stocks: DetailedStock[];
  }

  // Complete registry for all 12 stock groups
  const stockGroupsCatalog: StockGroupCatalog[] = [
    {
      id: "all",
      labelAr: "جميع الأسهم",
      labelEn: "All Stocks",
      descAr: "نظرة عامة شاملة على محركات السوق المصرية الأربعة مع إمكانية التصفية المباشرة لأي فئة تهمك.",
      descEn: "Comprehensive overview of the 4 key market movers and full Egyptian Exchange stock universe.",
      icon: Layers,
      colorBadge: "text-amber-400 bg-amber-400/10 border-amber-400/30",
      stocks: [
        {
          symbol: "COMI",
          nameAr: "البنك التجاري الدولي (مصر)",
          nameEn: "Commercial International Bank",
          sectorAr: "البنوك والخدمات المالية",
          sectorEn: "Banking & Financial Services",
          price: 122.00,
          change: -3.15,
          changePercent: -2.52,
          volume: "15.9M",
          marketCap: "368.5B ج.م",
          specialMetricAr: "الوزن النسبي الأكبر في EGX 30 (32%)",
          specialMetricEn: "Largest weight in EGX 30 (32%)",
          badgeAr: "قيادي عملاق",
          badgeEn: "Blue Chip",
        },
        {
          symbol: "TMGH",
          nameAr: "مجموعة طلعت مصطفى القابضة",
          nameEn: "Talaat Moustafa Group Holding",
          sectorAr: "العقارات والإنشاءات",
          sectorEn: "Real Estate & Construction",
          price: 81.22,
          change: -5.78,
          changePercent: -6.64,
          volume: "14.2M",
          marketCap: "167.3B ج.م",
          specialMetricAr: "أكبر محفظة أراضٍ وتطوير عقاري",
          specialMetricEn: "Largest land bank & property pipeline",
          badgeAr: "عقارات قيادية",
          badgeEn: "Real Estate",
        },
        {
          symbol: "ETEL",
          nameAr: "المصرية للاتصالات (WE)",
          nameEn: "Telecom Egypt",
          sectorAr: "الاتصالات والتكنولوجيا",
          sectorEn: "Telecom & Technology",
          price: 123.40,
          change: -10.50,
          changePercent: -7.84,
          volume: "18.7M",
          marketCap: "210.8B ج.م",
          specialMetricAr: "عائد قنوات الكابلات البحرية وحصة فودافون",
          specialMetricEn: "Subsea cables & Vodafone stake",
          badgeAr: "اتصالات",
          badgeEn: "Telecom",
        },
        {
          symbol: "SWDY",
          nameAr: "السويدي إليكتريك",
          nameEn: "Elsewedy Electric",
          sectorAr: "الصناعات الهندسية والكابلات",
          sectorEn: "Industrial & Cables",
          price: 74.50,
          change: -2.45,
          changePercent: -3.20,
          volume: "9.5M",
          marketCap: "158.2B ج.م",
          specialMetricAr: "توسع إقليمي في مشروعات الطاقة والبنية",
          specialMetricEn: "Regional infrastructure & power grid",
          badgeAr: "صناعي رائد",
          badgeEn: "Industrial",
        },
        {
          symbol: "ABUK",
          nameAr: "أبو قير للأسمدة والصناعات الكيماوية",
          nameEn: "Abu Qir Fertilizers",
          sectorAr: "الكيماويات والأسمدة",
          sectorEn: "Chemicals & Fertilizers",
          price: 64.20,
          change: 1.35,
          changePercent: 2.15,
          volume: "7.4M",
          marketCap: "81.2B ج.م",
          specialMetricAr: "عائد توزيع نقدي 12.8% وتصدير بالدولار",
          specialMetricEn: "12.8% div yield & USD export revenues",
          badgeAr: "أعلى توزيعات",
          badgeEn: "High Div",
        },
        {
          symbol: "MFPC",
          nameAr: "مصر لإنتاج الأسمدة (موبكو)",
          nameEn: "Misr Fertilizers Production (MOPCO)",
          sectorAr: "الأسمدة والبتروكيماويات",
          sectorEn: "Fertilizers & Petrochemicals",
          price: 48.10,
          change: 0.52,
          changePercent: 1.10,
          volume: "5.8M",
          marketCap: "98.6B ج.م",
          specialMetricAr: "عائد توزيع 11.2% وتدفق نقدي تشغيلي قوي",
          specialMetricEn: "11.2% div yield & strong cash flows",
          badgeAr: "بتروكيماويات",
          badgeEn: "Petrochem",
        },
        {
          symbol: "CCAP",
          nameAr: "القلعة للاستشارات المالية",
          nameEn: "Qalaa Holdings",
          sectorAr: "الخدمات المالية والاستثمار",
          sectorEn: "Financial Services & Investment",
          price: 6.10,
          change: -0.23,
          changePercent: -3.63,
          volume: "48.2M",
          marketCap: "11.1B ج.م",
          specialMetricAr: "أنشط سهم بالبورصة بحجم تداول 48.2 مليون سهم",
          specialMetricEn: "Most traded by volume (48.2M shares)",
          badgeAr: "الأكثر نشاطاً",
          badgeEn: "Most Active",
        },
        {
          symbol: "ELNA",
          nameAr: "النصر لتصنيع الحاصلات الزراعية",
          nameEn: "El Nasr Agricultural Crops",
          sectorAr: "الأغذية والمشروبات",
          sectorEn: "Food & Agriculture",
          price: 38.82,
          change: 1.84,
          changePercent: 4.98,
          volume: "28.1M",
          marketCap: "310M ج.م",
          specialMetricAr: "متصدر الارتفاعات بنسبة +4.98% وزخم سيولة 280%",
          specialMetricEn: "Top gainer +4.98% with 280% vol spike",
          badgeAr: "الأكثر ارتفاعاً",
          badgeEn: "Top Gainer",
        },
      ],
    },
    {
      id: "gainers",
      labelAr: "الأكثر ارتفاعاً",
      labelEn: "Top Gainers",
      descAr: "الأسهم التي حققت أعلى نسب صعود ومكاسب سعرية خلال جلسة اليوم بالبورصة المصرية.",
      descEn: "Stocks registering the highest price percentage gains during today's Egyptian session.",
      icon: TrendingUp,
      colorBadge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      stocks: [
        {
          symbol: "ELNA",
          nameAr: "النصر لتصنيع الحاصلات الزراعية",
          nameEn: "El Nasr Agricultural Crops",
          sectorAr: "الأغذية والمشروبات",
          sectorEn: "Food & Agriculture",
          price: 38.82,
          change: 1.84,
          changePercent: 4.98,
          volume: "28.1M",
          marketCap: "310M ج.م",
          specialMetricAr: "مكاسب الجلسة: +1.84 ج.م (+4.98%)",
          specialMetricEn: "Session gain: +1.84 EGP (+4.98%)",
          badgeAr: "المركز الأول",
          badgeEn: "Rank #1",
        },
        {
          symbol: "EOSB",
          nameAr: "العروبة للسمسرة في الأوراق المالية",
          nameEn: "El Orouba Securities Brokerage",
          sectorAr: "الخدمات المالية",
          sectorEn: "Financial Services",
          price: 1.64,
          change: 0.07,
          changePercent: 4.46,
          volume: "62.4M",
          marketCap: "164M ج.م",
          specialMetricAr: "مكاسب الجلسة: +0.07 ج.م (حجم تداول قياسي)",
          specialMetricEn: "Session gain: +0.07 EGP (Record Volume)",
          badgeAr: "المركز الثاني",
          badgeEn: "Rank #2",
        },
        {
          symbol: "ESRS",
          nameAr: "حديد عز (Ezz Steel)",
          nameEn: "Ezz Steel",
          sectorAr: "المعادن والموارد الأساسية",
          sectorEn: "Basic Materials & Metals",
          price: 118.50,
          change: 4.40,
          changePercent: 3.85,
          volume: "8.9M",
          marketCap: "64.2B ج.م",
          specialMetricAr: "صعود قيادي: +4.40 ج.م مدعوماً بنتائج أعمال قوية",
          specialMetricEn: "Large-cap gainer: +4.40 EGP on strong earnings",
          badgeAr: "صناعي قيادي",
          badgeEn: "Heavy Industry",
        },
        {
          symbol: "ABUK",
          nameAr: "أبو قير للأسمدة والصناعات الكيماوية",
          nameEn: "Abu Qir Fertilizers",
          sectorAr: "الكيماويات والأسمدة",
          sectorEn: "Chemicals & Fertilizers",
          price: 64.20,
          change: 1.35,
          changePercent: 2.15,
          volume: "7.4M",
          marketCap: "81.2B ج.م",
          specialMetricAr: "مكاسب مستمرة: +1.35 ج.م وتدفقات بالعملة الصعبة",
          specialMetricEn: "Continued rally: +1.35 EGP & FX inflows",
          badgeAr: "أسمدة رابحة",
          badgeEn: "Fertilizers",
        },
        {
          symbol: "MFPC",
          nameAr: "مصر لإنتاج الأسمدة (موبكو)",
          nameEn: "Misr Fertilizers (MOPCO)",
          sectorAr: "الأسمدة والبتروكيماويات",
          sectorEn: "Fertilizers & Petrochemicals",
          price: 48.10,
          change: 0.52,
          changePercent: 1.10,
          volume: "5.8M",
          marketCap: "98.6B ج.م",
          specialMetricAr: "صعود متزن: +0.52 ج.م مع طلب مؤسسي متزايد",
          specialMetricEn: "Steady climb: +0.52 EGP on institutional demand",
          badgeAr: "بتروكيماويات",
          badgeEn: "Petrochem",
        },
        {
          symbol: "NEDA",
          nameAr: "نيوباب لتصنيع الورق",
          nameEn: "New Paper Mills (Neopap)",
          sectorAr: "الصناعات التحويلية والتغليف",
          sectorEn: "Manufacturing & Packaging",
          price: 2.48,
          change: 0.01,
          changePercent: 0.40,
          volume: "5.3M",
          marketCap: "124M ج.م",
          specialMetricAr: "صمود إيجابي في وجه الضغوط البيعية",
          specialMetricEn: "Defensive green gain vs market pullback",
          badgeAr: "صناعي",
          badgeEn: "Manufacturing",
        },
        {
          symbol: "RACC",
          nameAr: "راية لخدمات مراكز الاتصالات",
          nameEn: "Raya Contact Center",
          sectorAr: "تكنولوجيا المعلومات والاتصالات",
          sectorEn: "IT Services & BPO",
          price: 7.15,
          change: 0.02,
          changePercent: 0.28,
          volume: "4.8M",
          marketCap: "1.5B ج.م",
          specialMetricAr: "نمو التصدير التكنولوجي والعقود الدولية",
          specialMetricEn: "Tech export growth & offshore contracts",
          badgeAr: "تكنولوجيا",
          badgeEn: "Tech",
        },
      ],
    },
    {
      id: "losers",
      labelAr: "أكبر الخاسرين",
      labelEn: "Top Losers",
      descAr: "الأسهم الأكثر تراجعاً وهبوطاً خلال جلسة اليوم بالبورصة المصرية، وبلغ بعضها الحد الأقصى للهبوط.",
      descEn: "Stocks logging the sharpest price drops during today's session, some hitting the maximum allowed limit.",
      icon: TrendingDown,
      colorBadge: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      stocks: [
        {
          symbol: "IDRE",
          nameAr: "الإسماعيلية الجديدة للتطوير والتنمية",
          nameEn: "New Ismailia Urban Development",
          sectorAr: "العقارات والتطوير",
          sectorEn: "Real Estate Development",
          price: 31.82,
          change: -8.18,
          changePercent: -20.45,
          volume: "16.8M",
          marketCap: "477M ج.م",
          specialMetricAr: "هبوط بالحد الأقصى اليومي (-20.45%)",
          specialMetricEn: "Limit down drop (-20.45%)",
          badgeAr: "الحد الأقصى",
          badgeEn: "Limit Down",
        },
        {
          symbol: "GTWL",
          nameAr: "جولدن تكس للأصواف",
          nameEn: "Golden Tex Wool",
          sectorAr: "المنسوجات والملابس",
          sectorEn: "Textiles & Apparel",
          price: 84.81,
          change: -21.20,
          changePercent: -20.00,
          volume: "12.4M",
          marketCap: "1.2B ج.م",
          specialMetricAr: "انخفاض حاد: -21.20 ج.م وضغوط بيع مكثفة",
          specialMetricEn: "Sharp slump: -21.20 EGP on heavy selloff",
          badgeAr: "هبوط حاد",
          badgeEn: "Severe Drop",
        },
        {
          symbol: "DTPP",
          nameAr: "دلتا للطباعة والتغليف",
          nameEn: "Delta Printing and Packaging",
          sectorAr: "الصناعات والطباعة",
          sectorEn: "Packaging & Printing",
          price: 41.81,
          change: -10.45,
          changePercent: -20.00,
          volume: "3.2M",
          marketCap: "235M ج.م",
          specialMetricAr: "تراجع بالحد الأقصى: -10.45 ج.م",
          specialMetricEn: "Limit drop: -10.45 EGP",
          badgeAr: "حد أقصى",
          badgeEn: "Limit Down",
        },
        {
          symbol: "OCPH",
          nameAr: "سوديك - السادس من أكتوبر للتنمية والاستثمار",
          nameEn: "SODIC Development",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 147.96,
          change: -36.99,
          changePercent: -20.00,
          volume: "7.1M",
          marketCap: "52.3B ج.م",
          specialMetricAr: "هبوط كبير: -36.99 ج.م بعد موجة صعود قياسية",
          specialMetricEn: "Major pullback: -36.99 EGP following steep rally",
          badgeAr: "تصحيح عقاري",
          badgeEn: "Correction",
        },
        {
          symbol: "RUBX",
          nameAr: "روبكس العالمية لتصنيع البلاستيك",
          nameEn: "Rubex International",
          sectorAr: "مواد البناء والصناعة",
          sectorEn: "Industrial Materials",
          price: 12.50,
          change: -3.12,
          changePercent: -19.97,
          volume: "4.4M",
          marketCap: "375M ج.م",
          specialMetricAr: "انخفاض: -3.12 ج.م (-19.97%)",
          specialMetricEn: "Decline: -3.12 EGP (-19.97%)",
          badgeAr: "تراجع",
          badgeEn: "Loser",
        },
        {
          symbol: "MAAL",
          nameAr: "مرسيليا المصرية الخليجية للاستثمار",
          nameEn: "Marseilia Egyptian Gulf",
          sectorAr: "العقارات والسياحة",
          sectorEn: "Real Estate & Hospitality",
          price: 5.26,
          change: -1.31,
          changePercent: -19.94,
          volume: "38.9M",
          marketCap: "580M ج.م",
          specialMetricAr: "تراجع -1.31 ج.م مع تداولات كثيفة 38.9M سهم",
          specialMetricEn: "Dropped -1.31 EGP with 38.9M shares traded",
          badgeAr: "مضاربي",
          badgeEn: "Speculative",
        },
        {
          symbol: "MBEG",
          nameAr: "إم بي للهندسة",
          nameEn: "MB Engineering",
          sectorAr: "الهندسة والمعدات الكهربائية",
          sectorEn: "Electrical Equipment",
          price: 4.30,
          change: -1.07,
          changePercent: -19.93,
          volume: "11.2M",
          marketCap: "215M ج.م",
          specialMetricAr: "تراجع سعري -1.07 ج.م (-19.93%)",
          specialMetricEn: "Price decline -1.07 EGP (-19.93%)",
          badgeAr: "هندسي",
          badgeEn: "Engineering",
        },
      ],
    },
    {
      id: "blue_chips",
      labelAr: "الشركات العملاقة",
      labelEn: "Blue Chips",
      descAr: "أكبر الشركات المقيدة بالبورصة المصرية من حيث القيمة السوقية، الملاءة المالية، والسيولة المؤسسية ومحركات مؤشر EGX 30.",
      descEn: "Egypt's large-cap market leaders by market capitalization, balance sheet resilience, institutional liquidity, and EGX 30 weight.",
      icon: Building2,
      colorBadge: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      stocks: [
        {
          symbol: "COMI",
          nameAr: "البنك التجاري الدولي (CIB مصر)",
          nameEn: "Commercial International Bank",
          sectorAr: "البنوك والخدمات المالية",
          sectorEn: "Banking & Financial Services",
          price: 122.00,
          change: -3.15,
          changePercent: -2.52,
          volume: "15.9M",
          marketCap: "368.5B ج.م",
          specialMetricAr: "القيمة السوقية: 368.5 مليار ج.م • مكرر ربحية P/E: 7.1x",
          specialMetricEn: "Market Cap: 368.5B EGP • P/E ratio: 7.1x",
          badgeAr: "عملاق السوق الأول",
          badgeEn: "#1 Large Cap",
        },
        {
          symbol: "ETEL",
          nameAr: "المصرية للاتصالات (Telecom Egypt)",
          nameEn: "Telecom Egypt",
          sectorAr: "الاتصالات وتكنولوجيا البيانات",
          sectorEn: "Telecom & Data Services",
          price: 123.40,
          change: -10.50,
          changePercent: -7.84,
          volume: "18.7M",
          marketCap: "210.8B ج.م",
          specialMetricAr: "القيمة السوقية: 210.8 مليار ج.م • مكرر ربحية P/E: 8.4x",
          specialMetricEn: "Market Cap: 210.8B EGP • P/E ratio: 8.4x",
          badgeAr: "احتكار البنية التحتية",
          badgeEn: "Infra Leader",
        },
        {
          symbol: "TMGH",
          nameAr: "مجموعة طلعت مصطفى القابضة",
          nameEn: "Talaat Moustafa Group Holding",
          sectorAr: "التطوير العقاري والمدن الذكية",
          sectorEn: "Real Estate & Smart Cities",
          price: 81.22,
          change: -5.78,
          changePercent: -6.64,
          volume: "14.2M",
          marketCap: "167.3B ج.م",
          specialMetricAr: "القيمة السوقية: 167.3 مليار ج.م • مبيعات تعاقدية قياسية",
          specialMetricEn: "Market Cap: 167.3B EGP • Record contracted sales",
          badgeAr: "رائد التطوير العقاري",
          badgeEn: "Real Estate Giant",
        },
        {
          symbol: "SWDY",
          nameAr: "السويدي إليكتريك",
          nameEn: "Elsewedy Electric",
          sectorAr: "الصناعات الكهربائية والكابلات",
          sectorEn: "Power & Cable Manufacturing",
          price: 74.50,
          change: -2.45,
          changePercent: -3.20,
          volume: "9.5M",
          marketCap: "158.2B ج.م",
          specialMetricAr: "القيمة السوقية: 158.2 مليار ج.م • مكرر ربحية P/E: 6.8x",
          specialMetricEn: "Market Cap: 158.2B EGP • P/E ratio: 6.8x",
          badgeAr: "صناعي متعدد الجنسيات",
          badgeEn: "Global Industrial",
        },
        {
          symbol: "MFPC",
          nameAr: "مصر لإنتاج الأسمدة (موبكو)",
          nameEn: "Misr Fertilizers (MOPCO)",
          sectorAr: "الأسمدة والبتروكيماويات",
          sectorEn: "Fertilizers & Petrochem",
          price: 48.10,
          change: 0.52,
          changePercent: 1.10,
          volume: "5.8M",
          marketCap: "98.6B ج.م",
          specialMetricAr: "القيمة السوقية: 98.6 مليار ج.م • تدفقات دولارية تصديرية",
          specialMetricEn: "Market Cap: 98.6B EGP • USD export cashflows",
          badgeAr: "بتروكيماويات عملاقة",
          badgeEn: "Mega Petrochem",
        },
        {
          symbol: "ABUK",
          nameAr: "أبو قير للأسمدة والصناعات الكيماوية",
          nameEn: "Abu Qir Fertilizers",
          sectorAr: "الأسمدة والكيماويات",
          sectorEn: "Fertilizers & Chemicals",
          price: 64.20,
          change: 1.35,
          changePercent: 2.15,
          volume: "7.4M",
          marketCap: "81.2B ج.م",
          specialMetricAr: "القيمة السوقية: 81.2 مليار ج.م • مكرر ربحية P/E: 5.4x",
          specialMetricEn: "Market Cap: 81.2B EGP • P/E ratio: 5.4x",
          badgeAr: "عائد توزيع استثنائي",
          badgeEn: "Dividend Powerhouse",
        },
        {
          symbol: "EAST",
          nameAr: "الشركة الشرقية (إيسترن كومباني)",
          nameEn: "Eastern Company",
          sectorAr: "السلع الاستهلاكية والتبغ",
          sectorEn: "Consumer Goods & Tobacco",
          price: 34.00,
          change: -0.40,
          changePercent: -1.15,
          volume: "6.3M",
          marketCap: "75.0B ج.م",
          specialMetricAr: "القيمة السوقية: 75.0 مليار ج.م • مكرر ربحية P/E: 5.8x",
          specialMetricEn: "Market Cap: 75.0B EGP • P/E ratio: 5.8x",
          badgeAr: "احتكار واستهلاك دفاعي",
          badgeEn: "Defensive Cashflow",
        },
        {
          symbol: "HRHO",
          nameAr: "مجموعة إي إف جي القابضة (هيرميس)",
          nameEn: "EFG Holding (Hermes)",
          sectorAr: "بنوك الاستثمار والخدمات المالية",
          sectorEn: "Investment Banking & Non-Bank Fin",
          price: 26.30,
          change: -0.55,
          changePercent: -2.10,
          volume: "11.2M",
          marketCap: "38.4B ج.م",
          specialMetricAr: "القيمة السوقية: 38.4 مليار ج.م • أكبر بنك استثمار بالشرق الأوسط",
          specialMetricEn: "Market Cap: 38.4B EGP • Leading regional investment bank",
          badgeAr: "بنك استثمار إقليمي",
          badgeEn: "Regional IB",
        },
      ],
    },
    {
      id: "most_active",
      labelAr: "الأكثر نشاطاً",
      labelEn: "Most Active",
      descAr: "الأسهم الأكثر استقطاباً للسيولة وحركة التداول من حيث كمية الأسهم المنفذة وقيمة التداول بالجنيه المصري.",
      descEn: "Stocks capturing the highest market turnover and share execution volumes across the session.",
      icon: Flame,
      colorBadge: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      stocks: [
        {
          symbol: "CCAP",
          nameAr: "القلعة للاستشارات المالية",
          nameEn: "Qalaa Holdings",
          sectorAr: "الاستثمار والخدمات المالية",
          sectorEn: "Investment & Financial Services",
          price: 6.10,
          change: -0.23,
          changePercent: -3.63,
          volume: "48.2M",
          marketCap: "11.1B ج.م",
          specialMetricAr: "حجم التداول: 48.2 مليون سهم (قيمة: 294.0 مليون ج.م)",
          specialMetricEn: "Volume: 48.2M shares (Value: 294.0M EGP)",
          badgeAr: "الأول في كمية التداول",
          badgeEn: "#1 By Volume",
        },
        {
          symbol: "KORRA",
          nameAr: "كورا للطاقة (Korra Energie)",
          nameEn: "Korra Energie",
          sectorAr: "الطاقة والمرافق المتجددة",
          sectorEn: "Renewable Energy & Utilities",
          price: 1.65,
          change: -0.36,
          changePercent: -17.91,
          volume: "35.1M",
          marketCap: "820M ج.م",
          specialMetricAr: "حجم التداول: 35.1 مليون سهم (قيمة: 57.9 مليون ج.م)",
          specialMetricEn: "Volume: 35.1M shares (Value: 57.9M EGP)",
          badgeAr: "سيولة مضاربية كثيفة",
          badgeEn: "High Liquidity",
        },
        {
          symbol: "ETEL",
          nameAr: "المصرية للاتصالات",
          nameEn: "Telecom Egypt",
          sectorAr: "الاتصالات",
          sectorEn: "Telecom",
          price: 123.40,
          change: -10.50,
          changePercent: -7.84,
          volume: "18.7M",
          marketCap: "210.8B ج.م",
          specialMetricAr: "قيمة التداول: 2.30 مليار ج.م (الأعلى في قيمة السيولة)",
          specialMetricEn: "Value: 2.30B EGP (#1 by EGP turnover)",
          badgeAr: "الأول في قيمة التداول",
          badgeEn: "#1 By Value",
        },
        {
          symbol: "COMI",
          nameAr: "البنك التجاري الدولي (CIB)",
          nameEn: "Commercial International Bank",
          sectorAr: "البنوك",
          sectorEn: "Banks",
          price: 122.00,
          change: -3.15,
          changePercent: -2.52,
          volume: "15.9M",
          marketCap: "368.5B ج.م",
          specialMetricAr: "قيمة التداول: 1.94 مليار ج.م • تدفقات أجنبية ومحلية",
          specialMetricEn: "Value: 1.94B EGP • Foreign & local institutional flow",
          badgeAr: "سيولة مؤسسية",
          badgeEn: "Institutional",
        },
        {
          symbol: "TMGH",
          nameAr: "مجموعة طلعت مصطفى",
          nameEn: "Talaat Moustafa Group",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 81.22,
          change: -5.78,
          changePercent: -6.64,
          volume: "14.2M",
          marketCap: "167.3B ج.م",
          specialMetricAr: "قيمة التداول: 1.15 مليار ج.م • حجم 14.2M سهم",
          specialMetricEn: "Value: 1.15B EGP • 14.2M shares traded",
          badgeAr: "سيولة عقارية",
          badgeEn: "Real Estate Flow",
        },
        {
          symbol: "GTWL",
          nameAr: "جولدن تكس للأصواف",
          nameEn: "Golden Tex Wool",
          sectorAr: "المنسوجات",
          sectorEn: "Textiles",
          price: 84.81,
          change: -21.20,
          changePercent: -20.00,
          volume: "12.4M",
          marketCap: "1.2B ج.م",
          specialMetricAr: "قيمة التداول: 1.05 مليار ج.م • معارك شرائية/بيعية",
          specialMetricEn: "Value: 1.05B EGP • Intense buyer/seller clashes",
          badgeAr: "تداولات ساخنة",
          badgeEn: "Hot Trading",
        },
      ],
    },
    {
      id: "unusual_volume",
      labelAr: "زخم غير اعتيادي",
      labelEn: "Unusual Volume",
      descAr: "أسهم تسجل قفزة استثنائية في أحجام التداول تفوق متوسطاتها التاريخية بأضعاف، مما يشير لتدفقات وتجميع أو تصريف مؤسسي.",
      descEn: "Stocks surging significantly above their historical daily average volumes (200%-340%), hinting at institutional action.",
      icon: Zap,
      colorBadge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
      stocks: [
        {
          symbol: "EOSB",
          nameAr: "العروبة للسمسرة في الأوراق المالية",
          nameEn: "El Orouba Securities Brokerage",
          sectorAr: "الخدمات المالية",
          sectorEn: "Financial Services",
          price: 1.64,
          change: 0.07,
          changePercent: 4.46,
          volume: "62.4M",
          marketCap: "164M ج.م",
          specialMetricAr: "قفزة التداول: 340% من المتوسط اليومي المعتاد",
          specialMetricEn: "Volume Surge: 340% vs historical 30D average",
          badgeAr: "+340% سيولة",
          badgeEn: "340% Spike",
        },
        {
          symbol: "ELNA",
          nameAr: "النصر لتصنيع الحاصلات الزراعية",
          nameEn: "El Nasr Agricultural Crops",
          sectorAr: "الأغذية والمشروبات",
          sectorEn: "Food & Agriculture",
          price: 38.82,
          change: 1.84,
          changePercent: 4.98,
          volume: "28.1M",
          marketCap: "310M ج.م",
          specialMetricAr: "قفزة التداول: 280% من المتوسط مع صعود سعري قوي",
          specialMetricEn: "Volume Surge: 280% alongside strong price rally",
          badgeAr: "+280% سيولة",
          badgeEn: "280% Spike",
        },
        {
          symbol: "AMPI",
          nameAr: "المؤشر للبرمجيات وتكنولوجيا المعلومات",
          nameEn: "Al Moasher for Software",
          sectorAr: "تكنولوجيا المعلومات",
          sectorEn: "IT & Software",
          price: 2.37,
          change: -0.11,
          changePercent: -4.44,
          volume: "19.5M",
          marketCap: "95M ج.م",
          specialMetricAr: "قفزة التداول: 220% من المتوسط اليومي",
          specialMetricEn: "Volume Surge: 220% of standard daily turnover",
          badgeAr: "+220% سيولة",
          badgeEn: "220% Spike",
        },
        {
          symbol: "CCAP",
          nameAr: "القلعة للاستشارات المالية",
          nameEn: "Qalaa Holdings",
          sectorAr: "الاستثمار المالي",
          sectorEn: "Financial Investment",
          price: 6.10,
          change: -0.23,
          changePercent: -3.63,
          volume: "48.2M",
          marketCap: "11.1B ج.م",
          specialMetricAr: "قفزة التداول: 195% من المتوسط مع صفقات ملكية كبيرة",
          specialMetricEn: "Volume Surge: 195% on large block crossing deals",
          badgeAr: "+195% سيولة",
          badgeEn: "195% Spike",
        },
        {
          symbol: "KORRA",
          nameAr: "كورا للطاقة",
          nameEn: "Korra Energie",
          sectorAr: "الطاقة والمرافق",
          sectorEn: "Utilities & Energy",
          price: 1.65,
          change: -0.36,
          changePercent: -17.91,
          volume: "35.1M",
          marketCap: "820M ج.م",
          specialMetricAr: "قفزة التداول: 180% من المتوسط مع ضغوط بيع مكثفة",
          specialMetricEn: "Volume Surge: 180% during intense distribution",
          badgeAr: "+180% سيولة",
          badgeEn: "180% Spike",
        },
      ],
    },
    {
      id: "high_volatility",
      labelAr: "الأكثر تذبذباً",
      labelEn: "High Volatility",
      descAr: "الأسهم التي تسجل أوسع فجوة وتغيرات سعرية بين أدنى وأعلى سعر خلال الجلسة وتوفر فرص تداول ومخاطر مرتفعة.",
      descEn: "Stocks experiencing the widest intraday price swings between high and low session prints.",
      icon: Percent,
      colorBadge: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      stocks: [
        {
          symbol: "SCTS",
          nameAr: "قناة السويس لتوطين التكنولوجيا",
          nameEn: "Suez Canal for Technology",
          sectorAr: "التعليم والتكنولوجيا",
          sectorEn: "Education & Tech",
          price: 450.00,
          change: -35.00,
          changePercent: -7.22,
          volume: "4.2M",
          marketCap: "40.5B ج.م",
          specialMetricAr: "نطاق الجلسة: 450.00 – 520.00 ج.م (تذبذب 14.2%)",
          specialMetricEn: "Session Range: 450.00 – 520.00 EGP (14.2% Swing)",
          badgeAr: "تذبذب 14.2%",
          badgeEn: "14.2% Swing",
        },
        {
          symbol: "MAAL",
          nameAr: "مرسيليا المصرية الخليجية",
          nameEn: "Marseilia Egyptian Gulf",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 5.26,
          change: -1.31,
          changePercent: -19.94,
          volume: "38.9M",
          marketCap: "580M ج.م",
          specialMetricAr: "نطاق الجلسة: 5.20 – 6.45 ج.م (تذبذب 19.9%)",
          specialMetricEn: "Session Range: 5.20 – 6.45 EGP (19.9% Swing)",
          badgeAr: "تذبذب 19.9%",
          badgeEn: "19.9% Swing",
        },
        {
          symbol: "CPCI",
          nameAr: "القاهرة للأدوية والصناعات الكيماوية",
          nameEn: "Cairo Pharmaceuticals",
          sectorAr: "الأدوية والرعاية الصحية",
          sectorEn: "Healthcare & Pharma",
          price: 578.00,
          change: -12.30,
          changePercent: -2.08,
          volume: "1.8M",
          marketCap: "8.6B ج.م",
          specialMetricAr: "نطاق الجلسة: 570.00 – 645.00 ج.م (تذبذب 11.5%)",
          specialMetricEn: "Session Range: 570.00 – 645.00 EGP (11.5% Swing)",
          badgeAr: "تذبذب 11.5%",
          badgeEn: "11.5% Swing",
        },
        {
          symbol: "MBEG",
          nameAr: "إم بي للهندسة",
          nameEn: "MB Engineering",
          sectorAr: "الهندسة والمعدات",
          sectorEn: "Industrial Engineering",
          price: 4.30,
          change: -1.07,
          changePercent: -19.93,
          volume: "11.2M",
          marketCap: "215M ج.م",
          specialMetricAr: "تذبذب حاد: 19.9% بين القمة والقاع للجلسة",
          specialMetricEn: "High Beta Swing: 19.9% spread between peak and trough",
          badgeAr: "تذبذب 19.9%",
          badgeEn: "19.9% Swing",
        },
        {
          symbol: "AMI",
          nameAr: "العربية للمحابس",
          nameEn: "Arabian Valves",
          sectorAr: "الصناعات الهندسية",
          sectorEn: "Engineering",
          price: 6.35,
          change: -1.56,
          changePercent: -19.72,
          volume: "9.6M",
          marketCap: "190M ج.م",
          specialMetricAr: "تذبذب حاد: 19.7% مع تقلبات مضاربية سريعة",
          specialMetricEn: "Sharp intraday movement of 19.7%",
          badgeAr: "تذبذب 19.7%",
          badgeEn: "19.7% Swing",
        },
        {
          symbol: "IDRE",
          nameAr: "الإسماعيلية الجديدة للتطوير",
          nameEn: "New Ismailia Development",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 31.82,
          change: -8.18,
          changePercent: -20.45,
          volume: "16.8M",
          marketCap: "477M ج.م",
          specialMetricAr: "تذبذب الجلسة 20.4% مع ضغوط بيع متتالية",
          specialMetricEn: "Session swing of 20.4% under relentless sell pressure",
          badgeAr: "تذبذب 20.4%",
          badgeEn: "20.4% Swing",
        },
      ],
    },
    {
      id: "high_div",
      labelAr: "أعلى توزيعات أرباح",
      labelEn: "High Div Yield",
      descAr: "الشركات التي توفر للمستثمر أعلى عائد نقدي سنوي على سعر السهم (Dividend Yield) مع تدفقات نقدية قوية ومستقرة.",
      descEn: "Companies offering the highest annual cash dividend yields relative to share price, supported by recurring cash generation.",
      icon: Coins,
      colorBadge: "text-teal-400 bg-teal-500/10 border-teal-500/30",
      stocks: [
        {
          symbol: "EAST",
          nameAr: "الشركة الشرقية (إيسترن كومباني)",
          nameEn: "Eastern Company",
          sectorAr: "السلع الاستهلاكية والتبغ",
          sectorEn: "Consumer Goods",
          price: 34.00,
          change: -0.40,
          changePercent: -1.15,
          volume: "6.3M",
          marketCap: "75.0B ج.م",
          specialMetricAr: "عائد التوزيع السنوي: 13.5% (كوبون نقدي 4.60 ج.م)",
          specialMetricEn: "Dividend Yield: 13.5% (Cash Coupon 4.60 EGP)",
          badgeAr: "عائد 13.5%",
          badgeEn: "13.5% Yield",
        },
        {
          symbol: "ABUK",
          nameAr: "أبو قير للأسمدة والصناعات الكيماوية",
          nameEn: "Abu Qir Fertilizers",
          sectorAr: "الكيماويات والأسمدة",
          sectorEn: "Chemicals & Fertilizers",
          price: 64.20,
          change: 1.35,
          changePercent: 2.15,
          volume: "7.4M",
          marketCap: "81.2B ج.م",
          specialMetricAr: "عائد التوزيع السنوي: 12.8% (كوبون نقدي 8.20 ج.م)",
          specialMetricEn: "Dividend Yield: 12.8% (Cash Coupon 8.20 EGP)",
          badgeAr: "عائد 12.8%",
          badgeEn: "12.8% Yield",
        },
        {
          symbol: "SKPC",
          nameAr: "سيدي كرير للبتروكيماويات (سيدبك)",
          nameEn: "Sidi Kerir Petrochemicals",
          sectorAr: "البتروكيماويات",
          sectorEn: "Petrochemicals",
          price: 31.50,
          change: -0.20,
          changePercent: -0.63,
          volume: "4.9M",
          marketCap: "23.6B ج.م",
          specialMetricAr: "عائد التوزيع السنوي: 11.9% (كوبون نقدي 3.75 ج.م)",
          specialMetricEn: "Dividend Yield: 11.9% (Cash Coupon 3.75 EGP)",
          badgeAr: "عائد 11.9%",
          badgeEn: "11.9% Yield",
        },
        {
          symbol: "MFPC",
          nameAr: "مصر لإنتاج الأسمدة (موبكو)",
          nameEn: "Misr Fertilizers (MOPCO)",
          sectorAr: "الأسمدة والبتروكيماويات",
          sectorEn: "Fertilizers & Petrochemicals",
          price: 48.10,
          change: 0.52,
          changePercent: 1.10,
          volume: "5.8M",
          marketCap: "98.6B ج.م",
          specialMetricAr: "عائد التوزيع السنوي: 11.2% (كوبون نقدي 5.40 ج.م)",
          specialMetricEn: "Dividend Yield: 11.2% (Cash Coupon 5.40 EGP)",
          badgeAr: "عائد 11.2%",
          badgeEn: "11.2% Yield",
        },
        {
          symbol: "AMOC",
          nameAr: "الإسكندرية للزيوت المعدنية (أموك)",
          nameEn: "Alexandria Mineral Oils (AMOC)",
          sectorAr: "الطاقة وتكرير البترول",
          sectorEn: "Oil Refining & Energy",
          price: 10.80,
          change: -0.05,
          changePercent: -0.46,
          volume: "8.1M",
          marketCap: "14.2B ج.م",
          specialMetricAr: "عائد التوزيع السنوي: 10.5% (كوبون نقدي 1.13 ج.م)",
          specialMetricEn: "Dividend Yield: 10.5% (Cash Coupon 1.13 EGP)",
          badgeAr: "عائد 10.5%",
          badgeEn: "10.5% Yield",
        },
        {
          symbol: "QNBE",
          nameAr: "بنك قطر الوطني الأهلي (QNB)",
          nameEn: "Qatar National Bank Alahli",
          sectorAr: "البنوك",
          sectorEn: "Banking",
          price: 36.20,
          change: -0.40,
          changePercent: -1.10,
          volume: "2.3M",
          marketCap: "74.5B ج.م",
          specialMetricAr: "عائد التوزيع السنوي: 9.8% (كوبون نقدي 3.55 ج.م)",
          specialMetricEn: "Dividend Yield: 9.8% (Cash Coupon 3.55 EGP)",
          badgeAr: "عائد 9.8%",
          badgeEn: "9.8% Yield",
        },
      ],
    },
    {
      id: "high_beta",
      labelAr: "بيتا عالية",
      labelEn: "High Beta",
      descAr: "أسهم ذات معامل بيتا يفوق 1.3 تتحرك بمرونة وحساسية مضاعفة مقارنة بحركة مؤشر EGX 30، مفضلة لفرص الصعود السريع.",
      descEn: "Stocks with Beta > 1.3 that move aggressively relative to the benchmark index (amplified upside & volatility).",
      icon: Gauge,
      colorBadge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
      stocks: [
        {
          symbol: "CCAP",
          nameAr: "القلعة للاستشارات المالية",
          nameEn: "Qalaa Holdings",
          sectorAr: "الاستثمار المالي",
          sectorEn: "Investment Services",
          price: 6.10,
          change: -0.23,
          changePercent: -3.63,
          volume: "48.2M",
          marketCap: "11.1B ج.م",
          specialMetricAr: "معامل بيتا: 1.68x (حركة مضاعفة لتقلبات المؤشر)",
          specialMetricEn: "Beta: 1.68x (1.68x market volatility multiplier)",
          badgeAr: "بيتا 1.68",
          badgeEn: "Beta 1.68",
        },
        {
          symbol: "ESRS",
          nameAr: "حديد عز (Ezz Steel)",
          nameEn: "Ezz Steel",
          sectorAr: "المعادن والتعدين",
          sectorEn: "Metals & Mining",
          price: 118.50,
          change: 4.40,
          changePercent: 3.85,
          volume: "8.9M",
          marketCap: "64.2B ج.م",
          specialMetricAr: "معامل بيتا: 1.52x (حساسية مرتفعة لأسعار الصلب)",
          specialMetricEn: "Beta: 1.52x (Sensitive to steel cycles & commodities)",
          badgeAr: "بيتا 1.52",
          badgeEn: "Beta 1.52",
        },
        {
          symbol: "TMGH",
          nameAr: "مجموعة طلعت مصطفى القابضة",
          nameEn: "Talaat Moustafa Group",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 81.22,
          change: -5.78,
          changePercent: -6.64,
          volume: "14.2M",
          marketCap: "167.3B ج.م",
          specialMetricAr: "معامل بيتا: 1.45x (حساسية تدفقات السيولة العقارية)",
          specialMetricEn: "Beta: 1.45x (High sensitivity to macro liquidity)",
          badgeAr: "بيتا 1.45",
          badgeEn: "Beta 1.45",
        },
        {
          symbol: "SWDY",
          nameAr: "السويدي إليكتريك",
          nameEn: "Elsewedy Electric",
          sectorAr: "الصناعات الكهربائية والكابلات",
          sectorEn: "Electrical Cables",
          price: 74.50,
          change: -2.45,
          changePercent: -3.20,
          volume: "9.5M",
          marketCap: "158.2B ج.م",
          specialMetricAr: "معامل بيتا: 1.38x (تفاعل سريع مع صفقات البنية التحتية)",
          specialMetricEn: "Beta: 1.38x (Fast reaction to infrastructure news)",
          badgeAr: "بيتا 1.38",
          badgeEn: "Beta 1.38",
        },
        {
          symbol: "HRHO",
          nameAr: "مجموعة إي إف جي القابضة (هيرميس)",
          nameEn: "EFG Holding (Hermes)",
          sectorAr: "الخدمات المالية",
          sectorEn: "Financial Services",
          price: 26.30,
          change: -0.55,
          changePercent: -2.10,
          volume: "11.2M",
          marketCap: "38.4B ج.م",
          specialMetricAr: "معامل بيتا: 1.32x (مرآة سيولة البورصة المصرية)",
          specialMetricEn: "Beta: 1.32x (Direct proxy for overall EGX liquidity)",
          badgeAr: "بيتا 1.32",
          badgeEn: "Beta 1.32",
        },
      ],
    },
    {
      id: "52w_high",
      labelAr: "أقصى ارتفاع خلال 52 أسبوع",
      labelEn: "52-Week High",
      descAr: "الأسهم التي تتداول عند قمتها السنوية أو تبعد بأقل من 5% عن أعلى سعر مسجل في 52 أسبوعاً (زخم صعودي مستمر).",
      descEn: "Stocks trading within 5% of their multi-month 52-week peak or printing fresh record high marks.",
      icon: Sparkles,
      colorBadge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      stocks: [
        {
          symbol: "COMI",
          nameAr: "البنك التجاري الدولي (CIB)",
          nameEn: "Commercial International Bank",
          sectorAr: "البنوك",
          sectorEn: "Banks",
          price: 122.00,
          change: -3.15,
          changePercent: -2.52,
          volume: "15.9M",
          marketCap: "368.5B ج.م",
          specialMetricAr: "قمة 52 أسبوع: 126.50 ج.م (فارق -3.5% فقط عن القمة)",
          specialMetricEn: "52W High: 126.50 EGP (Only -3.5% off ATH)",
          badgeAr: "قرب القمة",
          badgeEn: "Near 52W High",
        },
        {
          symbol: "SWDY",
          nameAr: "السويدي إليكتريك",
          nameEn: "Elsewedy Electric",
          sectorAr: "الصناعة",
          sectorEn: "Industrial",
          price: 74.50,
          change: -2.45,
          changePercent: -3.20,
          volume: "9.5M",
          marketCap: "158.2B ج.م",
          specialMetricAr: "قمة 52 أسبوع: 77.00 ج.م (فارق -3.2% عن القمة)",
          specialMetricEn: "52W High: 77.00 EGP (-3.2% from peak)",
          badgeAr: "قرب القمة",
          badgeEn: "Near 52W High",
        },
        {
          symbol: "ABUK",
          nameAr: "أبو قير للأسمدة",
          nameEn: "Abu Qir Fertilizers",
          sectorAr: "الكيماويات",
          sectorEn: "Chemicals",
          price: 64.20,
          change: 1.35,
          changePercent: 2.15,
          volume: "7.4M",
          marketCap: "81.2B ج.م",
          specialMetricAr: "قمة 52 أسبوع: 68.00 ج.م (فارق -5.5% عن القمة)",
          specialMetricEn: "52W High: 68.00 EGP (-5.5% from peak)",
          badgeAr: "زخم صعودي",
          badgeEn: "Bullish Momentum",
        },
        {
          symbol: "ESRS",
          nameAr: "حديد عز",
          nameEn: "Ezz Steel",
          sectorAr: "المعادن",
          sectorEn: "Metals",
          price: 118.50,
          change: 4.40,
          changePercent: 3.85,
          volume: "8.9M",
          marketCap: "64.2B ج.م",
          specialMetricAr: "قمة 52 أسبوع: 124.00 ج.م (فارق -4.4% عن القمة)",
          specialMetricEn: "52W High: 124.00 EGP (-4.4% from peak)",
          badgeAr: "زخم صعودي",
          badgeEn: "Bullish Momentum",
        },
      ],
    },
    {
      id: "52w_low",
      labelAr: "أدنى مستوى خلال 52 أسبوع",
      labelEn: "52-Week Low",
      descAr: "الأسهم التي هوت إلى قيعان تاريخية أو أدنى مستوى مسجل خلال آخر 52 أسبوعاً (فرص للمستثمرين الباحثين عن تقييمات منخفضة).",
      descEn: "Stocks touching or hovering near their 52-week bottoms, representing severe pullbacks or deep value propositions.",
      icon: ArrowDownRight,
      colorBadge: "text-rose-300 bg-rose-500/10 border-rose-500/30",
      stocks: [
        {
          symbol: "GTWL",
          nameAr: "جولدن تكس للأصواف",
          nameEn: "Golden Tex Wool",
          sectorAr: "المنسوجات",
          sectorEn: "Textiles",
          price: 84.81,
          change: -21.20,
          changePercent: -20.00,
          volume: "12.4M",
          marketCap: "1.2B ج.م",
          specialMetricAr: "قاع سنوي جديد: 84.81 ج.م (أدنى مستوى خلال عام)",
          specialMetricEn: "Fresh 52W Low: 84.81 EGP (Deepest 1Y discount)",
          badgeAr: "قاع سنوي جديد",
          badgeEn: "New 52W Low",
        },
        {
          symbol: "IDRE",
          nameAr: "الإسماعيلية الجديدة للتطوير",
          nameEn: "New Ismailia Development",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 31.82,
          change: -8.18,
          changePercent: -20.45,
          volume: "16.8M",
          marketCap: "477M ج.م",
          specialMetricAr: "قاع سنوي تاريخي: 31.82 ج.م بعد هبوط 42% في شهر",
          specialMetricEn: "52W Low: 31.82 EGP (-42% month-to-date)",
          badgeAr: "قاع تاريخي",
          badgeEn: "All-Time Low",
        },
        {
          symbol: "KORRA",
          nameAr: "كورا للطاقة",
          nameEn: "Korra Energie",
          sectorAr: "الطاقة",
          sectorEn: "Energy",
          price: 1.65,
          change: -0.36,
          changePercent: -17.91,
          volume: "35.1M",
          marketCap: "820M ج.م",
          specialMetricAr: "قرب قاع 52 أسبوع عند 1.62 ج.م (فارق +1.8%)",
          specialMetricEn: "Near 52W Low of 1.62 EGP (+1.8% support buffer)",
          badgeAr: "دعم فني",
          badgeEn: "Support Level",
        },
        {
          symbol: "DTPP",
          nameAr: "دلتا للطباعة والتغليف",
          nameEn: "Delta Printing and Packaging",
          sectorAr: "الصناعة",
          sectorEn: "Packaging",
          price: 41.81,
          change: -10.45,
          changePercent: -20.00,
          volume: "3.2M",
          marketCap: "235M ج.م",
          specialMetricAr: "قرب قاع 52 أسبوع عند 41.50 ج.م",
          specialMetricEn: "At 52W Low boundary of 41.50 EGP",
          badgeAr: "قاع سنوي",
          badgeEn: "52W Floor",
        },
      ],
    },
    {
      id: "oversold",
      labelAr: "تشبع بيعي (RSI)",
      labelEn: "Oversold RSI",
      descAr: "أسهم انخفض مؤشر القوة النسبية لها دون مستوى 30 نقطة نتيجة ضغوط بيع مكثفة، وتعتبر فنياً مرشحة لارتداد تصحيحي صاعد.",
      descEn: "Stocks where the 14-period Relative Strength Index (RSI) dropped below 30, signaling oversold technical conditions.",
      icon: Activity,
      colorBadge: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
      stocks: [
        {
          symbol: "IDRE",
          nameAr: "الإسماعيلية الجديدة للتطوير",
          nameEn: "New Ismailia Development",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 31.82,
          change: -8.18,
          changePercent: -20.45,
          volume: "16.8M",
          marketCap: "477M ج.م",
          specialMetricAr: "مؤشر RSI: 18.2 (تشبع بيعي استثنائي)",
          specialMetricEn: "RSI (14): 18.2 (Extreme technical oversold)",
          badgeAr: "RSI = 18.2",
          badgeEn: "RSI = 18.2",
        },
        {
          symbol: "GTWL",
          nameAr: "جولدن تكس للأصواف",
          nameEn: "Golden Tex Wool",
          sectorAr: "المنسوجات",
          sectorEn: "Textiles",
          price: 84.81,
          change: -21.20,
          changePercent: -20.00,
          volume: "12.4M",
          marketCap: "1.2B ج.م",
          specialMetricAr: "مؤشر RSI: 21.4 (هبوط مفرط - فرصة ارتداد)",
          specialMetricEn: "RSI (14): 21.4 (Oversold rebound zone)",
          badgeAr: "RSI = 21.4",
          badgeEn: "RSI = 21.4",
        },
        {
          symbol: "DTPP",
          nameAr: "دلتا للطباعة والتغليف",
          nameEn: "Delta Printing",
          sectorAr: "الصناعة",
          sectorEn: "Industrial",
          price: 41.81,
          change: -10.45,
          changePercent: -20.00,
          volume: "3.2M",
          marketCap: "235M ج.م",
          specialMetricAr: "مؤشر RSI: 22.8 (تشبع بيعي)",
          specialMetricEn: "RSI (14): 22.8 (Oversold condition)",
          badgeAr: "RSI = 22.8",
          badgeEn: "RSI = 22.8",
        },
        {
          symbol: "OCPH",
          nameAr: "السادس من أكتوبر للتنمية (سوديك)",
          nameEn: "SODIC Development",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 147.96,
          change: -36.99,
          changePercent: -20.00,
          volume: "7.1M",
          marketCap: "52.3B ج.م",
          specialMetricAr: "مؤشر RSI: 26.5 (كسر دعوم واقتراب ارتداد)",
          specialMetricEn: "RSI (14): 26.5 (Technical pullback floor)",
          badgeAr: "RSI = 26.5",
          badgeEn: "RSI = 26.5",
        },
        {
          symbol: "MAAL",
          nameAr: "مرسيليا المصرية الخليجية",
          nameEn: "Marseilia Egyptian Gulf",
          sectorAr: "العقارات",
          sectorEn: "Real Estate",
          price: 5.26,
          change: -1.31,
          changePercent: -19.94,
          volume: "38.9M",
          marketCap: "580M ج.م",
          specialMetricAr: "مؤشر RSI: 28.1 (مستوى دعم فني)",
          specialMetricEn: "RSI (14): 28.1 (Approaching horizontal support)",
          badgeAr: "RSI = 28.1",
          badgeEn: "RSI = 28.1",
        },
      ],
    },
  ];

  // Helper to get active group definition
  const activeCatalogGroup =
    stockGroupsCatalog.find((g) => g.id === selectedGroup) || stockGroupsCatalog[0];

  // Helper to scroll smoothly to TradingView chart
  const handleScrollToChart = (symbol: string) => {
    const el = document.getElementById("egx");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 mt-6">
      {/* ---------------------------------------------------- */}
      {/* Section Top Header: TradingView Egypt Stocks Banner */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <span>🇪🇬</span>
            <span>{isAr ? "البورصة المصرية" : "The Egyptian Exchange"}</span>
            <span>·</span>
            <span>TradingView Markets</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{t.egxOverviewTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            {t.egxOverviewSubtitle}
          </p>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="#market-breadth"
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
          >
            {t.marketBreadthTitle}
          </a>
          <a
            href="#sectors-heatmap"
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
          >
            {t.sectorsHeatmapTitle}
          </a>
          <a
            href="#stock-screeners"
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
          >
            {t.stockGroupsTitle}
          </a>
          <a
            href="#market-faq"
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
          >
            {t.faqTitle}
          </a>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. Market Summary (ملخص السوق) & EGX 30 Point Trajectory */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right column (in RTL) or Left: Sector Performance (1 Month) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{t.sectorPerf1M}</span>
              </h4>
              <a
                href="#sectors-heatmap"
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                {t.viewAllSectors} &gt;
              </a>
            </div>

            {/* Sector bars list */}
            <div className="space-y-3">
              {[
                { nameAr: "الاتصالات", nameEn: "Telecom", val: -11.87 },
                { nameAr: "القطاع المالي", nameEn: "Financials", val: -13.49 },
                { nameAr: "الصناعات التحويلية", nameEn: "Manufacturing", val: -13.87 },
                { nameAr: "مستهلك - غير معمرة", nameEn: "Consumer Goods", val: -14.33 },
                { nameAr: "خدمات التكنولوجيا", nameEn: "Tech Services", val: -14.85 },
                { nameAr: "المعادن الأخرى - غير مصادر الطاقة", nameEn: "Basic Resources", val: -17.88 },
                { nameAr: "الصناعات الموجهة للمنتجين", nameEn: "Producers", val: -20.63 },
              ].map((sec) => (
                <div key={sec.nameEn} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate font-medium">
                      {isAr ? sec.nameAr : sec.nameEn}
                    </span>
                    <span
                      className={`font-mono font-semibold ${
                        sec.val >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                      dir="ltr"
                    >
                      {sec.val > 0 ? `+${sec.val.toFixed(2)}%` : `${sec.val.toFixed(2)}%`}
                    </span>
                  </div>
                  {/* Visual Bar Indicator */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sec.val >= 0 ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.abs(sec.val) * 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-xs text-slate-400 flex items-center justify-between">
            <span>{isAr ? "مؤشر أداء القطاعات الشهري" : "Monthly Sector Returns"}</span>
            <span className="text-slate-500 font-mono">1M Horizon</span>
          </div>
        </div>

        {/* Left column (in RTL) or Right: EGX 30 Benchmark Intraday Card */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-black text-xs flex items-center justify-center font-mono">
                  30
                </span>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{isAr ? "مؤشر 30 EGX" : "EGX 30 Benchmark Index"}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      EGX30
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isAr
                      ? "المؤشر الرئيسي للبورصة المصرية"
                      : "The Egyptian Exchange Benchmark Index"}
                  </p>
                </div>
              </div>

              {/* Price & Change Badge */}
              <div className="text-left rtl:text-left ltr:text-right">
                <div className="text-2xl font-black text-white font-mono tracking-tight">
                  48,321.300 <span className="text-xs font-normal text-slate-400">POINT</span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 mt-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span dir="ltr">-5.35% (-2,732.10)</span>
                </div>
              </div>
            </div>

            {/* Intraday SVG trajectory curve representing session dip */}
            <div className="h-44 w-full relative mt-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 overflow-hidden">
              <svg
                viewBox="0 0 600 150"
                className="w-full h-full preserve-3d"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="egxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

                {/* Filled Area */}
                <path
                  d="M 0,25 C 50,22 80,45 120,50 C 160,55 200,48 240,65 C 280,82 320,60 360,78 C 400,96 440,90 480,105 C 520,120 560,112 600,128 L 600,150 L 0,150 Z"
                  fill="url(#egxGradient)"
                />
                {/* Stroke line */}
                <path
                  d="M 0,25 C 50,22 80,45 120,50 C 160,55 200,48 240,65 C 280,82 320,60 360,78 C 400,96 440,90 480,105 C 520,120 560,112 600,128"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Timeline labels */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1 px-1">
                <span>10:00</span>
                <span>10:30</span>
                <span>11:00</span>
                <span>11:30</span>
                <span>12:00</span>
                <span>12:30</span>
                <span>13:00</span>
                <span>14:30</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 mt-3">
            <span>{isAr ? "نطاق الجلسة: 48,210 - 51,053" : "Session Range: 48,210 - 51,053"}</span>
            <span className="text-amber-400 font-medium">
              {isAr ? "جلسة تداول نشطة" : "Active Session"}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. Three Cards: Market Breadth, Most Active, Dividends Calendar */}
      {/* ---------------------------------------------------- */}
      <div id="market-breadth" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Market Breadth (اتساع السوق) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>{t.marketBreadthTitle}</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">Market Breadth</span>
            </div>

            {/* Advancing vs Declining */}
            <div className="mb-5 pb-5 border-b border-slate-800">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400">{t.advancingVsDeclining}</span>
                <span className="font-mono text-slate-300">
                  {breadth.advancingCount + breadth.decliningCount + breadth.unchangedCount} {isAr ? "سهم" : "Stocks"}
                </span>
              </div>

              {/* Ratio numbers */}
              <div className="flex justify-between items-baseline mb-1 font-mono text-xs">
                <span className="text-rose-400 font-semibold">
                  {t.decliningLabel} {breadth.decliningPercent}% ({breadth.decliningCount})
                </span>
                <span className="text-emerald-400 font-semibold">
                  {t.advancingLabel} {breadth.advancingPercent}% ({breadth.advancingCount})
                </span>
              </div>

              {/* Ratio bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${breadth.decliningPercent}%` }}
                />
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${breadth.advancingPercent}%` }}
                />
              </div>
            </div>

            {/* Moving Averages (% above 50MA and 200MA) */}
            <div className="mb-5 pb-5 border-b border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 font-medium">
                {t.aboveMovingAverages}
              </div>

              {/* 50-day MA */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">day-50 (50 يوماً)</span>
                  <span className="text-amber-400 font-bold">{breadth.above50DayMaPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${breadth.above50DayMaPercent}%` }}
                  />
                </div>
              </div>

              {/* 200-day MA */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">day-200 (200 يوماً)</span>
                  <span className="text-blue-400 font-bold">{breadth.above200DayMaPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${breadth.above200DayMaPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* New Highs and Lows Bars */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-medium">{t.newHighsLows}</div>
              <div className="grid grid-cols-4 gap-2 pt-2">
                {breadth.newHighsLows.map((item) => (
                  <div
                    key={item.periodEn}
                    className="flex flex-col items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 text-center"
                  >
                    <span className="text-[10px] text-slate-400 font-medium mb-1">
                      {isAr ? item.periodAr : item.periodEn}
                    </span>
                    <div className="flex items-end justify-center gap-1.5 h-12 w-full">
                      {/* High bar */}
                      <div
                        className="w-2.5 bg-emerald-500 rounded-t"
                        style={{ height: `${Math.max(4, Math.min(48, item.highs / 2))}px` }}
                        title={`${item.highs} قمم جديدة`}
                      />
                      {/* Low bar */}
                      <div
                        className="w-2.5 bg-rose-500 rounded-b"
                        style={{ height: `${Math.max(6, Math.min(48, item.lows / 7))}px` }}
                        title={`${item.lows} قيعان جديدة`}
                      />
                    </div>
                    <div className="flex justify-between w-full text-[9px] font-mono mt-1 text-slate-400">
                      <span className="text-emerald-400">+{item.highs}</span>
                      <span className="text-rose-400">-{item.lows}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <a
              href="#stock-screeners"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center justify-between"
            >
              <span>{t.viewAllEgxStocks}</span>
              <span>&gt;</span>
            </a>
          </div>
        </div>

        {/* Card 2: Most Active Stocks (الأكثر نشاطاً) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>{t.mostActiveTitle}</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">Most Active</span>
            </div>

            <div className="space-y-3">
              {mostActive.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 transition-colors border border-slate-800/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {isAr ? stock.nameAr : stock.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {stock.symbol} {stock.volume ? `· ${stock.volume}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="text-left rtl:text-left ltr:text-right shrink-0">
                    <div className="text-xs font-bold text-white font-mono">
                      {stock.price.toFixed(2)}{" "}
                      <span className="text-[10px] text-slate-400 font-normal">EGP</span>
                    </div>
                    <div
                      className={`text-[10px] font-mono font-semibold ${
                        stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                      dir="ltr"
                    >
                      {stock.changePercent > 0
                        ? `+${stock.changePercent.toFixed(2)}%`
                        : `${stock.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <a
              href="#stock-screeners"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center justify-between"
            >
              <span>{t.viewAllActiveStocks}</span>
              <span>&gt;</span>
            </a>
          </div>
        </div>

        {/* Card 3: Upcoming Dividends & Earnings Calendar (جدول العوائد ومواعيدها) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>{t.dividendsScheduleTitle}</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">Events</span>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((ev, i) => (
                <div
                  key={`${ev.symbol}-${i}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 transition-colors border border-slate-800/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {ev.symbol.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {isAr ? ev.nameAr : ev.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ev.symbol} ·{" "}
                        {ev.eventType === "dividend"
                          ? isAr
                            ? `توزيع نقدي ${ev.dividendPerShare} ج.م`
                            : `Cash Div ${ev.dividendPerShare} EGP`
                          : ev.eventType === "earnings"
                          ? isAr
                            ? "نتائج أعمال"
                            : "Earnings Report"
                          : isAr
                          ? "جمعية عامة"
                          : "General Assembly"}
                      </div>
                    </div>
                  </div>

                  <div className="text-left rtl:text-left ltr:text-right shrink-0">
                    <span className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-800 text-amber-300 border border-slate-700/80">
                      {isAr ? ev.dateAr : ev.dateEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <a
              href="#stock-screeners"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center justify-between"
            >
              <span>{t.viewAllEvents}</span>
              <span>&gt;</span>
            </a>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. Screeners Columns: Stock Groups Filter & Interactive Movers */}
      {/* ---------------------------------------------------- */}
      <div id="stock-screeners" className="space-y-5">
        {/* Stock Groups Filter Pills Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>{t.stockGroupsTitle}:</span>
              <span className="text-[11px] font-normal text-slate-400">
                ({isAr ? "اضغط على أي تصنيف لتصفية الأسهم فوراً" : "Click any group to filter stocks instantly"})
              </span>
            </span>
            {selectedGroup !== "all" && (
              <button
                onClick={() => setSelectedGroup("all")}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? "إعادة تعيين (جميع الأسهم)" : "Reset to All"}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
              {stockGroups.map((grp) => {
                const groupData = stockGroupsCatalog.find((g) => g.id === grp.id);
                const count = groupData?.stocks.length || 0;
                const isSelected = selectedGroup === grp.id;

                return (
                  <button
                    key={grp.id}
                    onClick={() => {
                      setSelectedGroup(grp.id);
                      setScreenerSearch("");
                    }}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                      isSelected
                        ? "bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/25 ring-2 ring-amber-400/40 scale-[1.02]"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    <span>{isAr ? grp.labelAr : grp.labelEn}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected
                          ? "bg-slate-950/20 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Group Information & Filter Header Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  activeCatalogGroup.colorBadge || "text-amber-400 bg-amber-400/10 border-amber-400/30"
                }`}
              >
                {React.createElement(activeCatalogGroup.icon || Layers, { className: "w-5 h-5" })}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{isAr ? activeCatalogGroup.labelAr : activeCatalogGroup.labelEn}</span>
                  </h4>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium border border-slate-700">
                    {activeCatalogGroup.stocks.length} {isAr ? "أسهم في هذه المجموعة" : "stocks in group"}
                  </span>
                  {selectedGroup !== "all" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isAr ? "تصفية نشطة" : "Active Filter"}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {isAr ? activeCatalogGroup.descAr : activeCatalogGroup.descEn}
                </p>
              </div>
            </div>

            {/* View Mode Controls (Cards vs Table) & Group Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                <button
                  onClick={() => setScreenerViewMode("cards")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                    screenerViewMode === "cards"
                      ? "bg-slate-800 text-amber-300 font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title={isAr ? "عرض بطاقات" : "Grid Cards View"}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? "بطاقات" : "Cards"}</span>
                </button>
                <button
                  onClick={() => setScreenerViewMode("table")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                    screenerViewMode === "table"
                      ? "bg-slate-800 text-amber-300 font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title={isAr ? "عرض جدول تفصيلي" : "Table View"}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? "جدول" : "Table"}</span>
                </button>
              </div>

              {selectedGroup !== "all" && (
                <button
                  onClick={() => setSelectedGroup("all")}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  {isAr ? "عرض الكل ✕" : "Clear ✕"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Dynamic Display: Selected Group Content */}
        {/* ---------------------------------------------------- */}

        {/* CASE A: "all" selected - Display the 4 Mover Overview Cards + Full Exploration */}
        {selectedGroup === "all" ? (
          <div className="space-y-6">
            {/* 4 Multi-mover cards in responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Column 1: Top Gainers (الأكثر ارتفاعاً) */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <h5 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>{t.topGainersTitle}</span>
                    </h5>
                    <button
                      onClick={() => setSelectedGroup("gainers")}
                      className="text-[10px] text-slate-400 hover:text-emerald-400 font-mono flex items-center gap-1"
                    >
                      <span>{isAr ? "تصفية" : "Filter"}</span>
                      <span>&gt;</span>
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {topGainers.map((st) => (
                      <div
                        key={st.symbol}
                        onClick={() => handleScrollToChart(st.symbol)}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-200 truncate">
                            {isAr ? st.nameAr : st.nameEn}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{st.symbol}</div>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="font-mono font-bold text-white">
                            {st.price.toFixed(2)} <span className="text-[9px] text-slate-400">EGP</span>
                          </div>
                          <div className="text-[10px] font-mono font-bold text-emerald-400" dir="ltr">
                            +{st.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGroup("gainers")}
                  className="pt-3 border-t border-slate-800 mt-3 text-[11px] text-center text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center gap-1 w-full"
                >
                  <span>{t.viewAllGainers}</span>
                  <span>&gt;</span>
                </button>
              </div>

              {/* Column 2: Top Losers (الأكثر انخفاضاً) */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-sm flex flex-col justify-between hover:border-rose-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <h5 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" />
                      <span>{t.topLosersTitle}</span>
                    </h5>
                    <button
                      onClick={() => setSelectedGroup("losers")}
                      className="text-[10px] text-slate-400 hover:text-rose-400 font-mono flex items-center gap-1"
                    >
                      <span>{isAr ? "تصفية" : "Filter"}</span>
                      <span>&gt;</span>
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {topLosers.slice(0, 4).map((st) => (
                      <div
                        key={st.symbol}
                        onClick={() => handleScrollToChart(st.symbol)}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-200 truncate">
                            {isAr ? st.nameAr : st.nameEn}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{st.symbol}</div>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="font-mono font-bold text-white">
                            {st.price.toFixed(2)} <span className="text-[9px] text-slate-400">EGP</span>
                          </div>
                          <div className="text-[10px] font-mono font-bold text-rose-400" dir="ltr">
                            {st.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGroup("losers")}
                  className="pt-3 border-t border-slate-800 mt-3 text-[11px] text-center text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center gap-1 w-full"
                >
                  <span>{t.viewAllLosers}</span>
                  <span>&gt;</span>
                </button>
              </div>

              {/* Column 3: Unusual Volume (زخم غير اعتيادي) */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-sm flex flex-col justify-between hover:border-yellow-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <h5 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>{t.unusualVolumeTitle}</span>
                    </h5>
                    <button
                      onClick={() => setSelectedGroup("unusual_volume")}
                      className="text-[10px] text-slate-400 hover:text-amber-400 font-mono flex items-center gap-1"
                    >
                      <span>{isAr ? "تصفية" : "Filter"}</span>
                      <span>&gt;</span>
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {unusualVolume.map((st) => (
                      <div
                        key={st.symbol}
                        onClick={() => handleScrollToChart(st.symbol)}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-200 truncate">
                            {isAr ? st.nameAr : st.nameEn}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">{st.volume}</div>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="font-mono font-bold text-white">
                            {st.price.toFixed(2)} <span className="text-[9px] text-slate-400">EGP</span>
                          </div>
                          <div
                            className={`text-[10px] font-mono font-bold ${
                              st.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                            dir="ltr"
                          >
                            {st.changePercent > 0
                              ? `+${st.changePercent.toFixed(2)}%`
                              : `${st.changePercent.toFixed(2)}%`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGroup("unusual_volume")}
                  className="pt-3 border-t border-slate-800 mt-3 text-[11px] text-center text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center gap-1 w-full"
                >
                  <span>{t.viewAllUnusual}</span>
                  <span>&gt;</span>
                </button>
              </div>

              {/* Column 4: High Volatility (الأكثر تذبذباً) */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-sm flex flex-col justify-between hover:border-purple-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <h5 className="text-sm font-bold text-purple-400 flex items-center gap-1.5">
                      <Percent className="w-4 h-4" />
                      <span>{t.highVolatilityTitle}</span>
                    </h5>
                    <button
                      onClick={() => setSelectedGroup("high_volatility")}
                      className="text-[10px] text-slate-400 hover:text-purple-400 font-mono flex items-center gap-1"
                    >
                      <span>{isAr ? "تصفية" : "Filter"}</span>
                      <span>&gt;</span>
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {highVolatility.slice(0, 4).map((st) => (
                      <div
                        key={st.symbol}
                        onClick={() => handleScrollToChart(st.symbol)}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-200 truncate">
                            {isAr ? st.nameAr : st.nameEn}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{st.symbol}</div>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="font-mono font-bold text-white">
                            {st.price.toFixed(2)} <span className="text-[9px] text-slate-400">EGP</span>
                          </div>
                          <div
                            className={`text-[10px] font-mono font-bold ${
                              st.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                            dir="ltr"
                          >
                            {st.changePercent > 0
                              ? `+${st.changePercent.toFixed(2)}%`
                              : `${st.changePercent.toFixed(2)}%`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGroup("high_volatility")}
                  className="pt-3 border-t border-slate-800 mt-3 text-[11px] text-center text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center gap-1 w-full"
                >
                  <span>{t.viewAllVolatile}</span>
                  <span>&gt;</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Callouts Grid */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? "مجموعات سريعة مميزة للاستكشاف" : "Featured Stock Groups"}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {isAr ? "اضغط على أي فئة للفلترة التفصيلية" : "Select to view detailed screener"}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "blue_chips", labelAr: "الشركات العملاقة", labelEn: "Blue Chips", count: 8, icon: Building2 },
                  { id: "high_div", labelAr: "أعلى توزيعات أرباح", labelEn: "High Div Yield", count: 6, icon: Coins },
                  { id: "high_beta", labelAr: "بيتا عالية (مضاربة)", labelEn: "High Beta", count: 5, icon: Gauge },
                  { id: "oversold", labelAr: "تشبع بيعي (RSI)", labelEn: "Oversold RSI", count: 5, icon: Activity },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGroup(item.id)}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800/60 transition-all text-right rtl:text-right ltr:text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                        {React.createElement(item.icon, { className: "w-3.5 h-3.5" })}
                      </div>
                      <div className="truncate text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                        {isAr ? item.labelAr : item.labelEn}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {item.count} {isAr ? "أسهم" : "st"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* CASE B: Specific group selected (Blue Chips, High Div, Gainers, etc.) */
          <div className="space-y-4">
            {/* Search Input for Current Filter */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 ltr:left-3 pointer-events-none" />
                <input
                  type="text"
                  value={screenerSearch}
                  onChange={(e) => setScreenerSearch(e.target.value)}
                  placeholder={
                    isAr
                      ? `بحث داخل ${activeCatalogGroup.labelAr} بالاسم أو الرمز...`
                      : `Search inside ${activeCatalogGroup.labelEn}...`
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                {screenerSearch && (
                  <button
                    onClick={() => setScreenerSearch("")}
                    className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-3 ltr:right-3 text-xs text-slate-500 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-400">
                {isAr ? "عرض نتائج التصفية المباشرة" : "Live Filter Results"}
              </div>
            </div>

            {/* Filtered Stocks Cards View */}
            {screenerViewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeCatalogGroup.stocks
                  .filter((st) => {
                    if (!screenerSearch) return true;
                    const q = screenerSearch.toLowerCase();
                    return (
                      st.symbol.toLowerCase().includes(q) ||
                      st.nameAr.toLowerCase().includes(q) ||
                      st.nameEn.toLowerCase().includes(q) ||
                      st.sectorAr.toLowerCase().includes(q)
                    );
                  })
                  .map((stock) => {
                    const isPositive = stock.changePercent >= 0;
                    return (
                      <div
                        key={stock.symbol}
                        className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-sm hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Top: Symbol, Sector, and Badge */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold text-xs font-mono flex items-center justify-center">
                                {stock.symbol.slice(0, 4)}
                              </span>
                              <div>
                                <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                                  {stock.symbol}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {isAr ? stock.sectorAr : stock.sectorEn}
                                </div>
                              </div>
                            </div>

                            {stock.badgeAr && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                                {isAr ? stock.badgeAr : stock.badgeEn}
                              </span>
                            )}
                          </div>

                          {/* Company Full Name */}
                          <div className="text-xs font-medium text-slate-200 line-clamp-1 mb-3">
                            {isAr ? stock.nameAr : stock.nameEn}
                          </div>

                          {/* Price & Change Box */}
                          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 flex items-baseline justify-between">
                            <div>
                              <div className="text-lg font-black text-white font-mono">
                                {stock.price.toFixed(2)}{" "}
                                <span className="text-[10px] font-normal text-slate-400">EGP</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {isAr ? "رأس المال:" : "Cap:"} {stock.marketCap}
                              </div>
                            </div>

                            <div
                              className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg border ${
                                isPositive
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              }`}
                              dir="ltr"
                            >
                              {isPositive ? (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowDownRight className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {isPositive
                                  ? `+${stock.changePercent.toFixed(2)}%`
                                  : `${stock.changePercent.toFixed(2)}%`}
                              </span>
                            </div>
                          </div>

                          {/* Category Highlight Metric Box (Crucial Feedback!) */}
                          <div className="p-2 rounded-lg bg-amber-400/5 border border-amber-400/15 mb-3">
                            <div className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="font-semibold truncate">
                                {isAr ? stock.specialMetricAr : stock.specialMetricEn}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Action */}
                        <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono text-[11px]">
                            {isAr ? "الحجم:" : "Vol:"} {stock.volume}
                          </span>
                          <button
                            onClick={() => handleScrollToChart(stock.symbol)}
                            className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 text-[11px]"
                          >
                            <span>{isAr ? "مخطط التداول" : "View Chart"}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              /* Filtered Stocks Table View */
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
                <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                      <th className="py-3 px-3 min-w-[160px]">{isAr ? "الرمز والشركة" : "Symbol & Company"}</th>
                      <th className="py-3 px-3 min-w-[120px]">{isAr ? "القطاع" : "Sector"}</th>
                      <th className="py-3 px-3 text-left rtl:text-left ltr:text-right min-w-[100px]">
                        {isAr ? "السعر (ج.م)" : "Price (EGP)"}
                      </th>
                      <th className="py-3 px-3 text-center min-w-[90px]">{isAr ? "التغير اليومي" : "Day Change"}</th>
                      <th className="py-3 px-3 min-w-[110px]">{isAr ? "حجم التداول" : "Volume"}</th>
                      <th className="py-3 px-3 min-w-[180px]">{isAr ? "المؤشر المميز للفئة" : "Group Highlight Metric"}</th>
                      <th className="py-3 px-3 text-center min-w-[90px]">{isAr ? "الرسم البياني" : "Chart"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeCatalogGroup.stocks
                      .filter((st) => {
                        if (!screenerSearch) return true;
                        const q = screenerSearch.toLowerCase();
                        return (
                          st.symbol.toLowerCase().includes(q) ||
                          st.nameAr.toLowerCase().includes(q) ||
                          st.nameEn.toLowerCase().includes(q) ||
                          st.sectorAr.toLowerCase().includes(q)
                        );
                      })
                      .map((st) => {
                        const isPositive = st.changePercent >= 0;
                        return (
                          <tr key={st.symbol} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3">
                              <div className="font-bold text-white font-mono flex items-center gap-1.5">
                                <span>{st.symbol}</span>
                                {st.badgeAr && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-sans">
                                    {isAr ? st.badgeAr : st.badgeEn}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-300 truncate max-w-[200px]">
                                {isAr ? st.nameAr : st.nameEn}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300">{isAr ? st.sectorAr : st.sectorEn}</td>
                            <td className="py-3 px-3 font-mono font-bold text-white text-left rtl:text-left ltr:text-right">
                              {st.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                  isPositive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                                dir="ltr"
                              >
                                {isPositive
                                  ? `+${st.changePercent.toFixed(2)}%`
                                  : `${st.changePercent.toFixed(2)}%`}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-300">{st.volume}</td>
                            <td className="py-3 px-3">
                              <span className="text-xs text-amber-300 font-medium">
                                {isAr ? st.specialMetricAr : st.specialMetricEn}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => handleScrollToChart(st.symbol)}
                                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors inline-flex items-center gap-1 font-medium"
                              >
                                <span>{isAr ? "عرض" : "View"}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. Sectors Heatmap (خريطة حرارية للقطاعات) */}
      {/* ---------------------------------------------------- */}
      <div id="sectors-heatmap" className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>{t.sectorsHeatmapTitle}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? "مصفوفة العوائد التاريخية لجميع قطاعات البورصة المصرية عبر مختلف الآجال الزمنية"
                : "Multi-period performance matrix across all Egyptian stock exchange industry sectors"}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            10 {isAr ? "قطاعات رئيسية" : "Main Sectors"}
          </span>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/60">
                <th className="py-3 px-3 min-w-[170px]">{isAr ? "قطاع السوق" : "Sector"}</th>
                <th className="py-3 px-2 text-center min-w-[70px]">{isAr ? "اليوم" : "Today"}</th>
                <th className="py-3 px-2 text-center min-w-[75px]">{isAr ? "1 أسبوع" : "1W"}</th>
                <th className="py-3 px-2 text-center min-w-[75px]">{isAr ? "1 شهر" : "1M"}</th>
                <th className="py-3 px-2 text-center min-w-[75px]">{isAr ? "6 أشهر" : "6M"}</th>
                <th className="py-3 px-2 text-center min-w-[85px]">{isAr ? "بداية العام" : "YTD"}</th>
                <th className="py-3 px-2 text-center min-w-[75px]">{isAr ? "1 سنة" : "1Y"}</th>
                <th className="py-3 px-2 text-center min-w-[80px]">{isAr ? "5 سنوات" : "5Y"}</th>
                <th className="py-3 px-2 text-center min-w-[85px]">{isAr ? "10 سنوات" : "10Y"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sectorsHeatmap.map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    {isAr ? sec.nameAr : sec.nameEn}
                  </td>

                  {/* 1D */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.oneDay
                      )}`}
                      dir="ltr"
                    >
                      {sec.oneDay > 0 ? `+${sec.oneDay.toFixed(2)}%` : `${sec.oneDay.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* 1W */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.oneWeek
                      )}`}
                      dir="ltr"
                    >
                      {sec.oneWeek > 0 ? `+${sec.oneWeek.toFixed(2)}%` : `${sec.oneWeek.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* 1M */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.oneMonth
                      )}`}
                      dir="ltr"
                    >
                      {sec.oneMonth > 0 ? `+${sec.oneMonth.toFixed(2)}%` : `${sec.oneMonth.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* 6M */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.sixMonths
                      )}`}
                      dir="ltr"
                    >
                      {sec.sixMonths > 0 ? `+${sec.sixMonths.toFixed(2)}%` : `${sec.sixMonths.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* YTD */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.ytd
                      )}`}
                      dir="ltr"
                    >
                      {sec.ytd > 0 ? `+${sec.ytd.toFixed(2)}%` : `${sec.ytd.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* 1Y */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.oneYear
                      )}`}
                      dir="ltr"
                    >
                      {sec.oneYear > 0 ? `+${sec.oneYear.toFixed(2)}%` : `${sec.oneYear.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* 5Y */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.fiveYears
                      )}`}
                      dir="ltr"
                    >
                      {sec.fiveYears > 0 ? `+${sec.fiveYears.toFixed(1)}%` : `${sec.fiveYears.toFixed(1)}%`}
                    </span>
                  </td>

                  {/* 10Y */}
                  <td className="py-2 px-1.5 text-center">
                    <span
                      className={`inline-block w-full py-1 px-1.5 rounded font-mono text-[11px] border ${getPerfColor(
                        sec.tenYears
                      )}`}
                      dir="ltr"
                    >
                      {sec.tenYears > 0 ? `+${sec.tenYears.toFixed(1)}%` : `${sec.tenYears.toFixed(1)}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. Frequently Asked Questions (الأسئلة الشائعة - Accordion) */}
      {/* ---------------------------------------------------- */}
      <div id="market-faq" className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>{t.faqTitle}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">{t.faqSubtitle}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {faqs.length} {isAr ? "أسئلة وإجابات" : "Q&As"}
          </span>
        </div>

        {/* 2-Column Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndices.includes(index);
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-3.5 flex items-center justify-between text-right rtl:text-right ltr:text-left gap-3 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {isAr ? faq.qAr : faq.qEn}
                  </span>
                  <div className="shrink-0 text-amber-400 p-1 rounded-md bg-slate-800/60">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 pt-2.5 bg-slate-900/40">
                    {isAr ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
