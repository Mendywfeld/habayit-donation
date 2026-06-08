"use strict";
// Central config — all secrets come from Static Web Apps "Application settings" (env vars),
// never from the repo. Missing values degrade gracefully (frontend shows "demo mode").

module.exports = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ""
  },
  icount: {
    // Hosted payment pages (PCI-safe redirect). Defaults are the pages already created
    // for HaBayit; override via env if they change.
    oneTimeUrl: process.env.ICOUNT_ONETIME_URL || "https://app.icount.co.il/m/10cd7/c690490bpdcu6a009ff",
    recurringUrl: process.env.ICOUNT_RECURRING_URL || "https://app.icount.co.il/m/55419/c690490bpe1u6a00a13",
    ipnSecret: process.env.ICOUNT_IPN_SECRET || ""
  },
  monday: {
    apiToken: process.env.MONDAY_API_TOKEN || "",
    boardId: process.env.MONDAY_DONATIONS_BOARD_ID || "5093338251"
  },
  // Currencies enabled for real checkout in v1. EUR is reserved for the future
  // (no Austrian Stripe/entity yet).
  enabledCurrencies: ["ILS", "USD"]
};
