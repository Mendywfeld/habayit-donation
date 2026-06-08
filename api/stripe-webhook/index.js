"use strict";
// Stripe webhook: records a successful donation in monday.com.
//  - payment_intent / checkout.session.completed  -> one-time gift
//  - invoice.paid                                  -> monthly subscription charge
// Configure the endpoint in Stripe pointing to /api/stripe-webhook and set
// STRIPE_WEBHOOK_SECRET in Application settings.

const config = require("../shared/config");
const { createDonationItem } = require("../shared/monday");

module.exports = async function (context, req) {
  if (!config.stripe.secretKey || !config.stripe.webhookSecret) {
    context.res = { status: 503, body: "Stripe not configured" };
    return;
  }
  const stripe = require("stripe")(config.stripe.secretKey);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, config.stripe.webhookSecret);
  } catch (err) {
    context.log.error("Stripe signature verification failed:", err && err.message);
    context.res = { status: 400, body: "Invalid signature" };
    return;
  }

  try {
    let m = null, reference = null;

    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      // For subscriptions the recurring charges come via invoice.paid; record the
      // initial one-time payment here only.
      if (s.mode === "payment") { m = s.metadata || {}; reference = s.id; }
    } else if (event.type === "invoice.paid") {
      const inv = event.data.object;
      m = (inv.subscription_details && inv.subscription_details.metadata) || inv.metadata || {};
      reference = inv.id;
    }

    if (m) {
      await createDonationItem({
        firstName: m.firstName, lastName: m.lastName, email: m.email,
        idNumber: m.idNumber, currency: m.currency || "USD",
        frequency: m.frequency || "onetime", amount: m.amount,
        provider: "Stripe", reference
      }, context.log);
    }
  } catch (err) {
    context.log.error("stripe-webhook handler error:", err && err.message);
    // Return 200 anyway so Stripe doesn't retry forever on a monday hiccup; log for follow-up.
  }

  context.res = { status: 200, body: "ok" };
};
