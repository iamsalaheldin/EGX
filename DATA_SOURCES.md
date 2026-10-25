# Egypt Markets Pulse — Data Sources & Provider Directory

This document details all market and macroeconomic data sources integrated into **Egypt Markets Pulse**, along with endpoints, authentication, schemas, update schedules, rate limits, limitations, and fallback behaviors.

---

## 1. Foreign Exchange Rates (EGP vs Major World Currencies)

### Primary Provider: Open Exchange Rates API (open.er-api.com)
- **Endpoint**: `GET https://open.er-api.com/v6/latest/USD`
- **Authentication**: None required (Public open endpoint).
- **Update Frequency**: Daily (usually refreshed ~00:00 UTC).
- **Response Fields**:
  - `result`: `"success"`
  - `base_code`: `"USD"`
  - `time_last_update_unix`: Unix timestamp of last update
  - `time_last_update_utc`: UTC formatted time string
  - `time_next_update_unix`: Unix timestamp of expected next refresh
  - `rates`: Object containing exchange rates against USD:
    - `EGP`: USD to EGP rate (~55.28)
    - `EUR`: USD to EUR rate (~0.89)
    - `GBP`: USD to GBP rate
    - `SAR`: USD to SAR rate (Saudi Riyal, ~3.75)
    - `AED`: USD to AED rate (UAE Dirham, ~3.67)
    - `KWD`: USD to KWD rate (Kuwaiti Dinar, ~0.30)
- **Mathematical Normalization**:
  - `USD/EGP = rates.EGP`
  - `EUR/EGP = rates.EGP / rates.EUR`
  - `GBP/EGP = rates.EGP / rates.GBP`
  - `SAR/EGP = rates.EGP / rates.SAR`
  - `AED/EGP = rates.EGP / rates.AED`
  - `KWD/EGP = rates.EGP / rates.KWD`
  - Inverted rate: `1 EGP = 1 / target_rate`
- **Reliability Limitations**:
  - These represent mid-market interbank / reference rates, not retail physical cash exchange rates with Egyptian bank commission margins.
- **Fallback Provider 1**: `https://api.exchangerate-api.com/v4/latest/USD`
  - Free open v4 endpoint returning `rates.EGP`.
- **Fallback Provider 2**: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
  - Highly available CDN mirror updated daily.
- **Cache Strategy**: In-memory server cache for 15 minutes. In case all remote providers fail, the last cached value is served with status `"stale"`.

### Official Reference: Central Bank of Egypt (CBE)
- **URL**: `https://www.cbe.org.eg/en/economic-research/statistics/cbe-exchange-rates`
- **Status**: The CBE website is guarded by an enterprise Web Application Firewall (F5 ASM / WAF) that rejects direct programmatic scraping from cloud IP addresses with HTTP 200 "Request Rejected". Rather than inventing fake numbers, Egypt Markets Pulse displays the primary market rate with clear attribution and provides a direct link to the CBE official exchange rate bulletin.

---

## 2. Gold Market (International Spot & Egyptian Local Retail)

### A. International Gold Spot Price (XAU/USD)
- **Primary Provider**: Gold API (`api.gold-api.com`)
- **Endpoint**: `GET https://api.gold-api.com/price/XAU`
- **Authentication**: None required for the public live endpoint.
- **Update Frequency**: Live, approximately every 60 seconds during active international bullion trading.
- **Response Fields**:
  - `name`: `"Gold"`
  - `symbol`: `"XAU"`
  - `price`: Live price in USD per Troy Ounce (e.g., ~$3,996.90)
  - `currency`: `"USD"`
  - `updatedAt`: ISO 8601 timestamp
  - `updatedAtReadable`: Human-readable latency indicator (e.g. "a few seconds ago")
- **Intrinsic Value Calculation Formula**:
  - 1 Troy Ounce = 31.1034768 grams.
  - `gold24EGP = (goldOunceUSD / 31.1034768) * usdToEgp`
  - `gold21EGP = gold24EGP * (21 / 24)`
  - `gold18EGP = gold24EGP * (18 / 24)`
  - `goldPoundEGP = gold21EGP * 8`
- **Important Disclaimer**:
  - Clearly tagged as **"Estimated intrinsic gold value — not an Egyptian retail quotation."** Excludes Egyptian jeweler fabrication fees (*masna'iyya*), local stamp duties (*damgha*), retail dealer markups, and value-added tax (VAT).

### B. Egyptian Local Retail Gold Market (iSagha & Local Egyptian Jewelers)
- **Source**: `https://market.isagha.com/prices` (iSagha - Egypt's leading gold and jewelry pricing platform)
- **Server Adapter**: Server-side normalized parser extracting real Egyptian retail buying and selling quotes:
  - Gold 24K (Sell & Buy)
  - Gold 21K (Sell & Buy) — Most popular karat in Egypt
  - Gold 18K (Sell & Buy)
  - Gold Pound (8g of 21K) (Sell & Buy)
  - Market Price Spread & Gap between local and international gold prices
- **Update Frequency**: Polled server-side with a 3-minute cache TTL.
- **Fallback**: If iSagha is unreachable, the system automatically falls back to the calculated intrinsic gold value, labeled as `"estimated"`.

---

## 3. Egyptian Stock Exchange (EGX)

### Primary Integration: TradingView Advanced Charts & Ticker Widgets
- **Symbols**:
  - `EGX:EGX30` — Egyptian Exchange Benchmark 30 Index
  - `EGX:EGX70EWI` — EGX 70 Equal Weight Small/Mid-Cap Index
  - `EGX:EGX100EWI` — EGX 100 Equal Weight Broad Market Index
- **Embed URL**: `https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js`
- **Documentation**: [TradingView Advanced Chart Widget](https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/)
- **Market Data Terms**:
  - Real-time/delayed per TradingView EGX data policies (typically 15-minute delayed during session unless real-time exchange package is enabled).
  - TradingView terms strictly prohibit scraping internal JSON endpoints; official React-compatible iframe/script embedding is used.
- **EGX Session Schedule (Africa/Cairo Time)**:
  - Sunday to Thursday:
    - Pre-Opening: 09:30 AM – 10:00 AM
    - Main Continuous Trading: 10:00 AM – 02:30 PM
  - Friday & Saturday: Closed (Egyptian weekend)
- **Market Status Engine**:
  - Dynamically calculates whether EGX is currently **Open**, **Pre-Trading**, or **Closed** based on current Cairo local time and trading calendar.

---

## 4. Egyptian Macroeconomic Indicators (Central Bank of Egypt)

### Tracked Indicators:
1. **Headline Inflation (Annual %)**: Published monthly by CAPMAS & CBE.
2. **Core Inflation (Annual %)**: Published monthly by CBE (excludes volatile food and regulated prices).
3. **CBE Overnight Deposit Rate**: Set by Monetary Policy Committee (MPC).
4. **CBE Overnight Lending Rate**: Set by Monetary Policy Committee (MPC).
5. **Main Operation Rate**: CBE 7-day repo rate.
6. **Discount Rate**: CBE discount rate.

### Source & Verification:
- **Official Portal**: `https://www.cbe.org.eg/en/monetary-policy/inflation` and `https://www.cbe.org.eg/en/economic-research/statistics/overnight-deposit-and-lending-rate`
- **Data Model**: Date-stamped configuration engine capturing verified policy meeting decisions (MPC dates) and official monthly inflation releases.
- **Integrity**: Every indicator includes the exact effective month or policy decision date (e.g. October 2026 meeting), ensuring that figures are never misattributed or shown as vague estimates.

---

## 5. Normalized Data Status Taxonomy

All API responses follow the standard contract:

```typescript
type DataStatus = "live" | "delayed" | "estimated" | "stale" | "unavailable";

interface MarketData<T> {
  value: T | null;
  source: string;
  sourceUrl: string;
  asOf: string | null;
  fetchedAt: string;
  status: DataStatus;
  error?: string;
}
```

- **`live`**: Direct real-time feed within standard network latency.
- **`delayed`**: Verified market feed with exchange delay (e.g. EGX 15-minute delayed).
- **`estimated`**: Mathematical derivation (e.g. intrinsic gold karat calculation from XAU spot and USD/EGP rate).
- **`stale`**: Upstream provider is temporarily unreachable; serving the last verified cache entry with explicit warning.
- **`unavailable`**: Provider failed and no cached data exists. Never renders fake placeholder values.
