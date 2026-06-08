"use strict";
// iCount IPN webhook: records a successful ₪ donation in monday.com.
// iCount issues the legal §46 receipt automatically; here we only log the donor to the CRM.
// Set this endpoint as the IPN/Webhook URL in the iCount payment-page settings:
//   https://<your-site>/api/icount-webhook
// iCount posts form-encoded fields; names vary by account, so we read tolerantly.

const config = require("../shared/config");
const { createDonationItem } = require("../shared/monday");

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== "") return obj[k];
  }
  return "";
}

module.exports = async function (context, req) {
  // Optional shared-secret guard (?key=...) if ICOUNT_IPN_SECRET is set.
  if (config.icount.ipnSecret) {
    const provided = (req.query && req.query.key) || "";
    if (provided !== config.icount.ipnSecret) {
      context.res = { status: 401, body: "unauthorized" };
      return;
    }
  }

  const d = Object.assign({}, req.query || {}, req.body || {});

  const amount = pick(d, ["sum", "amount", "total", "sum_paid"]);
  const fname = pick(d, ["fname", "first_name", "firstname"]);
  const lname = pick(d, ["lname", "last_name", "lastname"]);
  const fullName = pick(d, ["client_name", "name"]);
  const email = pick(d, ["email", "client_email"]);
  const idNumber = pick(d, ["id_no", "vat_id", "id_number"]);
  const phone = pick(d, ["phone", "client_phone"]);
  const docNum = pick(d, ["docnum", "doc_id", "invoice_id", "confirmation_code"]);
  const isRecurring = String(pick(d, ["recurring", "hk", "standing_order"]) || "").match(/1|true|yes/i);

  try {
    await createDonationItem({
      firstName: fname || fullName,
      lastName: lname,
      email,
      idNumber,
      phone,
      currency: "ILS",
      frequency: isRecurring ? "monthly" : "onetime",
      amount,
      provider: "iCount",
      reference: docNum
    }, context.log);
  } catch (err) {
    context.log.error("icount-webhook handler error:", err && err.message);
  }

  // iCount expects a simple 200 acknowledgement.
  context.res = { status: 200, headers: { "Content-Type": "text/plain" }, body: "OK" };
};
