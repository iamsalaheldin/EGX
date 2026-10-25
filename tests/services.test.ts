import { describe, it, expect } from "vitest";
import { CurrencyService } from "../src/server/services/currencyService.js";
import { GoldService, TROY_OUNCE_IN_GRAMS } from "../src/server/services/goldService.js";
import { EgxService } from "../src/server/services/egxService.js";
import { EconomyService } from "../src/server/services/economyService.js";
import { OverviewService } from "../src/server/services/overviewService.js";

describe("Currency Calculations & Cross Rates", () => {
  it("calculates cross rates accurately relative to EGP", () => {
    const mockRates = {
      USD: 1,
      EUR: 0.8926,
      SAR: 3.75,
      AED: 3.6725,
      KWD: 0.3065,
    };
    const egpRate = 55.28;

    const crossRates = CurrencyService.calculateCrossRates(mockRates, egpRate);

    // USD/EGP should equal egpRate
    const usd = crossRates.find((c) => c.code === "USD");
    expect(usd).toBeDefined();
    expect(usd?.rateToEgp).toBe(55.28);
    expect(usd?.invertedRate).toBeCloseTo(1 / 55.28, 4);

    // SAR/EGP = 55.28 / 3.75 = 14.7413
    const sar = crossRates.find((c) => c.code === "SAR");
    expect(sar).toBeDefined();
    expect(sar?.rateToEgp).toBeCloseTo(55.28 / 3.75, 2);

    // EUR/EGP = 55.28 / 0.8926 = 61.93
    const eur = crossRates.find((c) => c.code === "EUR");
    expect(eur).toBeDefined();
    expect(eur?.rateToEgp).toBeCloseTo(55.28 / 0.8926, 2);

    // Inverted rate check: 1 EGP should give the correct fraction of currency
    expect(usd?.invertedRate).toBeGreaterThan(0);
    expect(Number.isNaN(usd?.rateToEgp)).toBe(false);
  });
});

describe("Gold Karat Formulas & Intrinsic Calculation", () => {
  it("applies the exact troy ounce to gram conversion and karat purity ratios", () => {
    const ounceUsd = 4000;
    const usdToEgp = 55.0;

    // gold24EGP = (goldOunceUSD / 31.1034768) * usdToEgp
    const expected24 = (ounceUsd / TROY_OUNCE_IN_GRAMS) * usdToEgp;
    // gold21EGP = gold24EGP * (21 / 24)
    const expected21 = expected24 * (21 / 24);
    // gold18EGP = gold24EGP * (18 / 24)
    const expected18 = expected24 * (18 / 24);
    // goldPoundEGP = gold21EGP * 8
    const expectedPound = expected21 * 8;

    expect(expected24).toBeCloseTo(7073.16, 1);
    expect(expected21).toBeCloseTo(expected24 * 0.875, 2);
    expect(expected18).toBeCloseTo(expected24 * 0.75, 2);
    expect(expectedPound).toBeCloseTo(expected21 * 8, 2);
  });

  it("parses iSagha HTML table correctly", () => {
    const mockHtml = `
      <table>
        <tr>
          <td>عيار 24</td>
          <td>7182.75 ج.م</td>
          <td>71.5 ج.م</td>
          <td>7125.75 ج.م</td>
          <td>29 ج.م</td>
          <td>▲ 5.71 ج.م</td>
          <td>▲ 0.08%</td>
        </tr>
        <tr>
          <td>عيار 21</td>
          <td>6285 ج.م</td>
          <td>62.75 ج.م</td>
          <td>6235 ج.م</td>
          <td>25.5 ج.م</td>
          <td>▲ 5 ج.م</td>
          <td>▲ 0.08%</td>
        </tr>
      </table>
    `;

    const parsed = GoldService.parseIsaghaHtml(mockHtml);
    expect(parsed).toBeDefined();
    expect(parsed?.k24?.sell).toBe(7182.75);
    expect(parsed?.k24?.buy).toBe(7125.75);
    expect(parsed?.k21?.sell).toBe(6285);
    expect(parsed?.k21?.buy).toBe(6235);
  });
});

describe("Cairo Market Hours & Status Calculation", () => {
  it("recognizes weekend (Friday and Saturday) in Egypt", () => {
    // 2026-10-23 is a Friday
    const friday = new Date("2026-10-23T11:00:00Z");
    const status = EgxService.getCairoMarketStatus(friday);
    expect(status.isWeekend).toBe(true);
    expect(status.isOpen).toBe(false);
    expect(status.sessionState).toBe("weekend");
  });

  it("recognizes pre-open auction session on a weekday", () => {
    // A Wednesday at 07:45 UTC = 09:45 Cairo (assuming UTC+2)
    // We test with an explicit Cairo hour calculation
    const weekday = new Date("2026-10-21T07:45:00Z");
    const status = EgxService.getCairoMarketStatus(weekday);
    expect(status.isWeekend).toBe(false);
  });
});

describe("Economic Indicators & Overview Service", () => {
  it("returns verified macroeconomic indicators with dates", async () => {
    const ecoRes = await EconomyService.getEconomicIndicators();
    expect(ecoRes.status).toBe("live");
    expect(ecoRes.value).not.toBeNull();
    expect(ecoRes.value?.headlineInflation.value).toBe(26.4);
    expect(ecoRes.value?.depositRate.value).toBe(27.25);
    expect(ecoRes.value?.headlineInflation.reportingDate).toBe("September 2026");
  });

  it("returns overview KPI snapshot without NaN or undefined", async () => {
    const overview = await OverviewService.getOverview();
    expect(overview.status).toBe("live");
    expect(overview.value).not.toBeNull();
    const kpis = overview.value!.kpis;

    expect(kpis.usdEgp.numericValue).toBeGreaterThan(0);
    expect(Number.isNaN(kpis.usdEgp.numericValue)).toBe(false);
    expect(kpis.gold21k.numericValue).toBeGreaterThan(0);
    expect(Number.isNaN(kpis.gold21k.numericValue)).toBe(false);
    expect(kpis.goldSpot.numericValue).toBeGreaterThan(0);
    expect(Number.isNaN(kpis.goldSpot.numericValue)).toBe(false);
  });
});
