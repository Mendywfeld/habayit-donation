"use strict";
// Creates a hosted checkout and returns { url } for the browser to redirect to.
//  - USD  -> Stripe Checkout Session (one-time payment or monthly subscription)
//  - ILS  -> iCount hosted payment page (one-time or standing order), prefilled
//  - EUR  -> not enabled yet (no Austrian Stripe/entity)
// Card data never touches our server (PCI-safe). Confirmation arrives via webhooks.

const config = require("../shared/config");

function bad(context, status, message) {
  context.res = { status, headers: { "Content-Type": "application/json" }, body: { message } };
}

module.exports = async function (context, req) {
  const b = req.body || {};
  const currency = String(b.currency || "").toUpperCase();
  const frequency = b.frequency === "monthly" ? "monthly" : "onetime";
  const amount = Math.round(Number(b.amount) || 0);
  const origin = (typeof b.origin === "string" && /^https?:\/\//.test(b.origin)) ? b.origin : "";

  if (!amount || amount <= 0) return bad(context, 400, "סכום לא תקין.");
  if (config.enabledCurrencies.indexOf(currency) === -1) {
    return bad(context, 400, "המטבע הזה עדיין לא זמין לתרומה.");
  }

  const meta = {
    firstName: b.firstName || "",
    lastName: b.lastName || "",
    email: b.email || "",
    idNumber: (b.idNumber || "").toString().replace(/\D/g, ""),
    currency, frequency, amount: String(amount)
  };

  try {
    // ----- ILS via iCount hosted page -----
    if (currency === "ILS") {
      const base = frequency === "monthly" ? config.icount.recurringUrl : config.icount.oneTimeUrl;
      const p = new URLSearchParams();
      p.set("sum", String(amount));
      if (meta.firstName) p.set("fname", meta.firstName);
      if (meta.lastName) p.set("lname", meta.lastName);
      if (meta.email) p.set("email", meta.email);
      if (meta.idNumber) p.set("id_no", meta.idNumber);
      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { url: base + "?" + p.toString(), provider: "icount" }
      };
      return;
    }

    // ----- USD via Stripe Checkout -----
    if (currency === "USD") {
      if (!config.stripe.secretKey) return bad(context, 503, "התשלום בכרטיס אשראי עדיין לא חובר.");
      const stripe = require("stripe")(config.stripe.secretKey);

      const productName = "תרומה לקהילת הבית · וינה";
      const successUrl = (origin || "") + "/?status=success";
      const cancelUrl = (origin || "") + "/?status=cancel";

      const line_item = {
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: amount * 100,
          ...(frequency === "monthly" ? { recurring: { interval: "month" } } : {})
        },
        quantity: 1
      };

      const session = await stripe.checkout.sessions.create({
        mode: frequency === "monthly" ? "subscription" : "payment",
        line_items: [line_item],
        customer_email: meta.email || undefined,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: meta,
        ...(frequency === "monthly" ? { subscription_data: { metadata: meta } } : {})
      });

      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { url: session.url, provider: "stripe" }
      };
      return;
    }

    return bad(context, 400, "המטבע הזה עדיין לא זמין.");
  } catch (err) {
    context.log.error("create-checkout error:", err && err.message);
    return bad(context, 500, "אירעה תקלה ביצירת התשלום. נסו שוב בעוד רגע.");
  }
};
