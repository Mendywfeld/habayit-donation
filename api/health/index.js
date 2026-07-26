"use strict";
// Dependency-free probe. Its only job is to localise failures:
//   /api/health 200 + /api/create-checkout 500  -> the runtime is fine, the
//       fault is in create-checkout or its "stripe" dependency.
//   /api/health 500                             -> the Functions host itself
//       is not starting (runtime/config problem, not our code).
// Reports which secrets are present WITHOUT revealing any value.

module.exports = async function (context, req) {
  let cfg = null;
  let cfgError = null;
  try {
    const config = require("../shared/config");
    cfg = {
      stripeKey: Boolean(config.stripe.secretKey),
      stripeWebhookSecret: Boolean(config.stripe.webhookSecret),
      icountOneTime: Boolean(config.icount.oneTimeUrl),
      icountRecurring: Boolean(config.icount.recurringUrl),
      icountIpnSecret: Boolean(config.icount.ipnSecret),
      mondayToken: Boolean(config.monday.apiToken),
      enabledCurrencies: config.enabledCurrencies
    };
  } catch (e) {
    cfgError = e && e.message ? e.message : String(e);
  }

  let stripeModule = "not-checked";
  try {
    require.resolve("stripe");
    stripeModule = "installed";
  } catch (e) {
    stripeModule = "MISSING";
  }

  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: {
      ok: true,
      node: process.version,
      functionsWorker: process.env.FUNCTIONS_WORKER_RUNTIME || null,
      functionsVersion: process.env.FUNCTIONS_EXTENSION_VERSION || null,
      stripeModule,
      config: cfg,
      configError: cfgError
    }
  };
};
