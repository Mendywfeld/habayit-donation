# הבית · וינה — דף תרומה

דף תרומה למסך אחד לקהילת **הבית – הקהילה הישראלית בוינה**. מהיר, קליל, RTL,
עם הוראת קבע חודשית מומלצת. בנוי כאתר סטטי על **Azure Static Web Apps** עם
**Azure Functions** לצד-שרת (Stripe / iCount / monday.com).

## מבנה
```
app/                      הפרונט (סטטי, ללא build)
  index.html              הטופס המלא + עיצוב + לוגיקה
  staticwebapp.config.json  ניתוב, כותרות אבטחה, הרשאת הטמעה עתידית
api/                      Azure Functions (Node.js)
  create-checkout/        יוצר תשלום: ₪→iCount, $→Stripe, ומחזיר url להפניה
  stripe-webhook/         מאשר תשלום Stripe ורושם ב-monday
  icount-webhook/         IPN של iCount → רישום ב-monday
  shared/                 config + לקוח monday
```

כל תרומה נרשמת בלוח **"תרומות - Donations"** (`5093338251`) עם עמודות ייעודיות:
שם, סכום, תאריך, סוג (חד-פעמי/הוראת קבע), **מטבע**, **אימייל**, **אסמכתא**, שפה והערות.

## מטבעות (v1)
- **₪ שקל** — iCount (דף סליקה מתארח, קבלה מוכרת לסעיף 46). חד-פעמי + הוראת קבע.
- **$ דולר** — Stripe Checkout (עמותת 501(c)(3)). חד-פעמי + מנוי חודשי.
- **€ אירו** — שמור לעתיד (אין עדיין Stripe/עמותה באוסטריה).

## הגדרות נדרשות (Application settings ב-Static Web Apps)
הסודות לא נשמרים בקוד. ב-Azure Portal → Static Web App → Settings → **Configuration**:

| שם | תיאור |
|----|-------|
| `STRIPE_SECRET_KEY` | מפתח סודי של Stripe (sk_live_… / sk_test_…) |
| `STRIPE_WEBHOOK_SECRET` | סוד ה-webhook של Stripe (whsec_…) |
| `MONDAY_API_TOKEN` | טוקן API של monday.com |
| `MONDAY_DONATIONS_BOARD_ID` | ברירת מחדל: `5093338251` (לוח "תרומות - Donations") |
| `ICOUNT_ONETIME_URL` | (אופציונלי) דף סליקה חד-פעמי ב-iCount |
| `ICOUNT_RECURRING_URL` | (אופציונלי) דף הוראת קבע ב-iCount |
| `ICOUNT_IPN_SECRET` | (אופציונלי) מפתח לאימות ה-IPN דרך `?key=` |

המפתח **הפומבי** של Stripe לא נדרש בפרונט (משתמשים ב-Stripe Checkout בהפניה).

## חיבור webhooks
- **Stripe** → Developers → Webhooks → endpoint: `https://<האתר>/api/stripe-webhook`
  אירועים: `checkout.session.completed`, `invoice.paid`. העתק את ה-signing secret ל-`STRIPE_WEBHOOK_SECRET`.
- **iCount** → בהגדרות דף הסליקה, כתובת IPN: `https://<האתר>/api/icount-webhook`
  (אם הגדרת `ICOUNT_IPN_SECRET`, הוסף `?key=<הסוד>`).

## פיתוח מקומי
```bash
npm i -g @azure/static-web-apps-cli
# (בתוך api/) npm install
swa start app --api-location api
```
לסודות מקומיים: `api/local.settings.json` (לא נכנס ל-git).

## פריסה
Push ל-`main` מפעיל את ה-GitHub Action ופורס לפרודקשן.
פתיחת PR יוצרת **סביבת preview** נפרדת לבדיקה. הדומיין `habaitwien.com/donation`
מחובר דרך Azure + GoDaddy (שלב ידני).
