# Egypt Markets Pulse (نبض الأسواق المصرية)

A modern, production-grade personal financial dashboard designed to monitor the Egyptian economy and financial markets in real time.

Built with React 19, TypeScript, Tailwind CSS, Express, and TradingView Advanced Charts.

---

## Key Features

1. **Top 8 Financial KPIs Snapshot**:
   - `EGX 30` & `EGX 70 EWI` benchmarks
   - `USD/EGP` & `SAR/EGP` live interbank exchange rates
   - `Gold 21K Gram` (Local Egyptian retail quotes and calculated intrinsic spot value)
   - `XAU/USD` (International gold spot bullion price)
   - `Annual Headline Inflation` (CAPMAS & Central Bank of Egypt)
   - `CBE Overnight Deposit Rate` (Monetary Policy Committee decision)

2. **Egyptian Stock Exchange (EGX) Charts**:
   - Official TradingView Advanced Charts for `EGX:EGX30`, `EGX:EGX70EWI`, `EGX:EGX100EWI`, `CAPITALCOM:GOLD`, and `FX_IDC:USDEGP`.
   - Real-time Cairo market session state engine (`Africa/Cairo` timezone: Pre-opening, Continuous trading, Closed, Weekend).
   - Dynamic dark and light theme switching.

3. **Foreign Exchange Rates vs EGP & Conversion Calculator**:
   - Live rates for USD, EUR, GBP, SAR, AED, KWD, QAR, BHD, OMR, CAD, CHF, JPY.
   - Real-time bidirectional currency converter with quick amount presets.
   - Transparent data status flags (`live`, `delayed`, `estimated`, `stale`).
   - Official Central Bank of Egypt exchange rate reference link.

4. **Gold Market & Karats**:
   - 24K, 21K (Egyptian benchmark), 18K, and the Egyptian Gold Pound (8g of 21K).
   - Real Egyptian retail quotes (buy vs sell) from local market providers (iSagha).
   - Intrinsic global spot valuation model based on `XAU/USD` spot and `USD/EGP`.
   - Interactive gold gram weight and workmanship (*masna'iyya*) calculator.

5. **Central Bank of Egypt Macroeconomic Indicators**:
   - Annual Headline Inflation (Urban) and Core Inflation.
   - Overnight Deposit, Lending, 7-Day Main Operation (Repo), and Discount Rates.
   - Date-stamped to exact release months and MPC decisions.

6. **Bilingual Arabic-First UI with Full RTL/LTR**:
   - Seamless toggle between Arabic (RTL) and English (LTR).
   - Professional Bloomberg / TradingView terminal aesthetic with tabular numerals (`tabular-nums font-mono`).

---

## Architecture & Data Reliability

- **Normalized Server Contracts**:
  Standardized `MarketData<T>` schema returning `value`, `source`, `sourceUrl`, `asOf`, `fetchedAt`, `status`, and `error`.
- **Status Taxonomy**:
  - `live`: Direct real-time feed from verified providers.
  - `delayed`: Market delay policy (e.g. EGX 15-minute delayed session).
  - `estimated`: Mathematically derived intrinsic figure (e.g. gold intrinsic karat model).
  - `stale`: Upstream provider temporarily unreachable; serves last verified cache entry with explicit warning.
  - `unavailable`: Provider offline with no cache. Never returns fake placeholder numbers.
- **Multi-Tier Fallbacks**:
  - Currency: `open.er-api.com` → `exchangerate-api.com v4` → `jsdelivr FawazAhmed CDN mirror`.
  - Gold: `api.gold-api.com` → calculated intrinsic model.
- **Server-Side API Proxying**:
  All third-party requests run on the server to prevent CORS issues, with 60s–15m in-memory caching.

---

## Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

### 3. Run Automated Tests
```bash
npm test
```
Executes the Vitest unit and service test suite covering currency cross-rates, gold purity formulas, iSagha parser, and Cairo timezone market session calculations.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## REST Endpoints

- `GET /api/markets/overview`: High-level aggregated KPI snapshot for header and top cards.
- `GET /api/markets/currencies`: Real-time cross exchange rates vs EGP.
- `GET /api/markets/gold`: International spot bullion and Egyptian local retail quotes.
- `GET /api/markets/egx`: EGX index metadata and Cairo session state.
- `GET /api/markets/economy`: Official CBE macroeconomic policy indicators.
- `GET /api/health`: Application status, Cairo time, uptime, and environment.
- `POST /api/markets/refresh`: Clears server cache and triggers instant refetch across all providers.

---

## Data Sources Documentation

For detailed information on all providers, endpoints, response schemas, and limitations, refer to [`DATA_SOURCES.md`](DATA_SOURCES.md).
