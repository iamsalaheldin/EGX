import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { CurrencyService } from "./src/server/services/currencyService.js";
import { GoldService } from "./src/server/services/goldService.js";
import { EgxService } from "./src/server/services/egxService.js";
import { EconomyService } from "./src/server/services/economyService.js";
import { OverviewService } from "./src/server/services/overviewService.js";
import { MarketCache } from "./src/server/cache.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const isProd = process.env.NODE_ENV === "production";

app.use(express.json());

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
app.get("/api/health", (_req: Request, res: Response) => {
  const cairoTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date());

  res.json({
    status: "ok",
    app: "Egypt Markets Pulse",
    timestamp: new Date().toISOString(),
    cairoTime,
    uptimeSeconds: process.uptime(),
    nodeEnv: process.env.NODE_ENV || "development",
  });
});

// ----------------------------------------------------
// Market Endpoints
// ----------------------------------------------------
app.get("/api/markets/overview", async (_req: Request, res: Response) => {
  try {
    const data = await OverviewService.getOverview();
    res.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      value: null,
      source: "Egypt Markets Pulse",
      sourceUrl: "/api/markets/overview",
      asOf: null,
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
      error: msg,
    });
  }
});

app.get("/api/markets/currencies", async (_req: Request, res: Response) => {
  try {
    const data = await CurrencyService.getCurrencyRates();
    res.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      value: null,
      source: "Currency Providers",
      sourceUrl: "https://open.er-api.com",
      asOf: null,
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
      error: msg,
    });
  }
});

app.get("/api/markets/gold", async (_req: Request, res: Response) => {
  try {
    const data = await GoldService.getGoldPrices();
    res.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      value: null,
      source: "Gold Providers",
      sourceUrl: "https://gold-api.com",
      asOf: null,
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
      error: msg,
    });
  }
});

app.get("/api/markets/egx", async (_req: Request, res: Response) => {
  try {
    const data = await EgxService.getEgxData();
    res.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      value: null,
      source: "EGX",
      sourceUrl: "https://www.egx.com.eg/",
      asOf: null,
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
      error: msg,
    });
  }
});

app.get("/api/markets/economy", async (_req: Request, res: Response) => {
  try {
    const data = await EconomyService.getEconomicIndicators();
    res.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      value: null,
      source: "Central Bank of Egypt",
      sourceUrl: "https://www.cbe.org.eg/",
      asOf: null,
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
      error: msg,
    });
  }
});

app.post("/api/markets/refresh", async (_req: Request, res: Response) => {
  try {
    MarketCache.clear();
    const overview = await OverviewService.getOverview();
    res.json({
      refreshed: true,
      timestamp: new Date().toISOString(),
      overview,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ refreshed: false, error: msg });
  }
});

// ----------------------------------------------------
// Dev / Prod Vite Middleware
// ----------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve pre-built static assets
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`[Egypt Markets Pulse] Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
