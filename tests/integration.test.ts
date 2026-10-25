import { describe, it, expect } from "vitest";
import { CurrencyService } from "../src/server/services/currencyService.js";
import { GoldService } from "../src/server/services/goldService.js";
import { EgxService } from "../src/server/services/egxService.js";
import { EconomyService } from "../src/server/services/economyService.js";
import { OverviewService } from "../src/server/services/overviewService.js";

describe("Live Integration Smoke Tests", () => {
  it("fetches real live foreign exchange rates with EGP", async () => {
    const res = await CurrencyService.getCurrencyRates();
    expect(res.status).toBe("live");
    expect(res.value).not.toBeNull();
    expect(res.value?.usdToEgp).toBeGreaterThan(40); // EGP is floating > 40
    expect(res.value?.currencies.length).toBeGreaterThanOrEqual(6);

    const usd = res.value?.currencies.find((c) => c.code === "USD");
    const sar = res.value?.currencies.find((c) => c.code === "SAR");
    const eur = res.value?.currencies.find((c) => c.code === "EUR");

    expect(usd?.rateToEgp).toBeGreaterThan(40);
    expect(sar?.rateToEgp).toBeGreaterThan(10);
    expect(eur?.rateToEgp).toBeGreaterThan(40);
  });

  it("fetches live gold spot and parses local Egyptian retail gold prices", async () => {
    const res = await GoldService.getGoldPrices();
    expect(res.value).not.toBeNull();
    // International spot price > $2,000 / oz
    expect(res.value?.international.ounceUsd).toBeGreaterThan(2000);

    const k21 = res.value?.karats.k21;
    expect(k21).toBeDefined();
    expect(k21?.estimatedEgp).toBeGreaterThan(3000);

    if (k21?.retailSellEgp && k21?.retailBuyEgp) {
      expect(k21.retailSellEgp).toBeGreaterThan(3000);
      expect(k21.retailBuyEgp).toBeGreaterThan(3000);
      expect(k21.retailSellEgp).toBeGreaterThan(k21.retailBuyEgp); // Sell to customer is higher than buy from customer
    }

    const pound = res.value?.karats.pound;
    expect(pound?.estimatedEgp).toBeGreaterThan(24000);
  });

  it("calculates accurate Cairo market session state", () => {
    const status = EgxService.getCairoMarketStatus();
    expect(status.cairoTime).toBeDefined();
    expect(["open", "pre_open", "closed", "weekend"]).toContain(status.sessionState);
  });

  it("provides date-stamped Central Bank of Egypt economic indicators", async () => {
    const res = await EconomyService.getEconomicIndicators();
    expect(res.status).toBe("live");
    expect(res.value?.headlineInflation.value).toBe(26.4);
    expect(res.value?.depositRate.value).toBe(27.25);
    expect(res.value?.nextMpcMeeting).toBeDefined();
  });

  it("aggregates all KPIs in Overview without NaN or undefined", async () => {
    const res = await OverviewService.getOverview();
    expect(res.value).not.toBeNull();
    const kpis = res.value!.kpis;

    for (const [key, kpi] of Object.entries(kpis)) {
      expect(kpi.numericValue, `KPI ${key} numericValue should not be NaN`).not.toBeNaN();
      expect(kpi.valueFormatted, `KPI ${key} should have a formatted value`).toBeTruthy();
      expect(kpi.valueFormatted).not.toContain("NaN");
      expect(kpi.valueFormatted).not.toContain("undefined");
    }
  });
});
