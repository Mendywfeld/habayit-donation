"use strict";
// Creates a donation item on the monday.com board "תרומות - Donations" (id 5093338251).
// Column ids were read from the live board. Amount column is numeric (labelled €) — we
// store the numeric amount and record the actual currency + details in the notes column.

const config = require("./config");

const COLS = {
  donorName: "text_mm1h1v2p",   // שם התורם
  amount: "numeric_mm1hffbk",    // סכום תרומה
  date: "date_mm1hfbcq",         // תאריך תרומה
  type: "color_mm1hat0w",        // סוג תרומה (status)
  recurring: "boolean_mm1hja12", // הוראת קבע (checkbox)
  language: "dropdown_mm1hjjsd", // שפת התורם
  thanksSent: "boolean_mm1hr476",// מכתב תודה נשלח?
  notes: "long_text_mm1hnw1n"    // הערות
};

const CURRENCY_LABEL = { ILS: "₪ שקל", USD: "$ דולר", EUR: "€ אירו" };

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function createDonationItem(d, log) {
  if (!config.monday.apiToken) {
    if (log) log("monday: MONDAY_API_TOKEN not set — skipping CRM write.");
    return { skipped: true };
  }

  const fullName = [d.firstName, d.lastName].filter(Boolean).join(" ").trim() || "תורם/ת";
  const typeLabel = d.frequency === "monthly" ? "הוראת קבע" : "חד-פעמי";

  const notesLines = [
    `מטבע: ${CURRENCY_LABEL[d.currency] || d.currency}`,
    `סכום: ${d.amount} ${d.currency}` + (d.frequency === "monthly" ? " לחודש" : ""),
    d.email ? `אימייל: ${d.email}` : null,
    d.phone ? `טלפון: ${d.phone}` : null,
    d.idNumber ? `ת"ז/ח.פ.: ${d.idNumber}` : null,
    d.provider ? `ספק סליקה: ${d.provider}` : null,
    d.reference ? `אסמכתא: ${d.reference}` : null
  ].filter(Boolean);

  const columnValues = {
    [COLS.donorName]: fullName,
    [COLS.amount]: String(d.amount || ""),
    [COLS.date]: { date: today() },
    [COLS.type]: { label: typeLabel },
    [COLS.recurring]: { checked: d.frequency === "monthly" ? "true" : "false" },
    [COLS.language]: { labels: ["עברית"] },
    [COLS.thanksSent]: { checked: "false" },
    [COLS.notes]: notesLines.join("\n")
  };

  const query = `
    mutation ($boardId: ID!, $itemName: String!, $cols: JSON!) {
      create_item(
        board_id: $boardId,
        item_name: $itemName,
        column_values: $cols,
        create_labels_if_missing: true
      ) { id }
    }`;

  const variables = {
    boardId: config.monday.boardId,
    itemName: fullName,
    cols: JSON.stringify(columnValues)
  };

  const resp = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": config.monday.apiToken,
      "API-Version": "2024-01"
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await resp.json();
  if (data.errors) {
    throw new Error("monday API error: " + JSON.stringify(data.errors));
  }
  return { id: data.data && data.data.create_item && data.data.create_item.id };
}

module.exports = { createDonationItem };
