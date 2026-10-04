# Moshi Hardware: Online Store MVP

Customers browse products, fill a cart, and place an order (no account, no online payment).
The owner logs in to an admin area to manage products and orders.

**Stack:** React + Vite, Tailwind CSS, React Router, Firebase (Auth, Firestore, Storage), Vercel.

---

## 1. Install dependencies

Install [Node.js](https://nodejs.org) (version 18 or newer), then in this folder:

```bash
npm install
```

## 2. Create a Firebase project

1. Go to <https://console.firebase.google.com> and click **Add project**. Name it e.g. `moshi-hardware`. You can turn Google Analytics off.
2. In the project, click the **web icon `</>`** (Add app), give it a name, and register it.
3. Firebase shows a `firebaseConfig` block. Keep that page open: you will copy these values into `.env` (step 7).

## 3. Enable Firebase Authentication

**Build > Authentication > Get started > Sign-in method > Email/Password > Enable > Save.**

## 4. Create Firestore

1. **Build > Firestore Database > Create database.** Choose a location close to your customers (e.g. `eur3` or the nearest available), start in **production mode**.
2. Open the **Rules** tab, paste the contents of `firestore.rules` from this project, and click **Publish**.

## 5. Create Firebase Storage

1. **Build > Storage > Get started** (production mode).
   Note: Storage may ask you to upgrade the project to the Blaze (pay-as-you-go) plan. Product images need it. Small shops usually stay within the free usage, but check Firebase pricing.
2. Open the **Rules** tab, paste the contents of `storage.rules`, and **Publish**.

## 6. Create the first admin account

There is deliberately no admin sign-up page on the website. Create the admin by hand:

1. **Authentication > Users > Add user.** Enter the owner's email and a strong password. Copy the **User UID** shown in the list.
2. **Firestore Database > Start collection** (or open it if it exists), collection ID: `users`.
3. Document ID: paste the **User UID** exactly. Add a field `role` (string) with value `admin`. Save.

Only accounts with a `users/{uid}` document where `role` is `admin` can manage products and orders.

## 7. Configure `.env`

```bash
cp .env.example .env
```

Fill in the values from step 2 plus:

| Variable | Meaning |
|---|---|
| `VITE_WHATSAPP_NUMBER` | **The Moshi Hardware WhatsApp number**: country code first, digits only, no `+` or spaces. Example: `255712345678` |
| `VITE_CONTACT_PHONE` | Phone number shown on the website |
| `VITE_CONTACT_LOCATION` | Shop location shown on the website |

**This is where the owner puts the WhatsApp number: `VITE_WHATSAPP_NUMBER` in `.env` (locally) and in Vercel's Environment Variables (live site).** If it is empty, WhatsApp buttons are hidden.

Never commit `.env` (it is already in `.gitignore`).

## 8. Run locally

```bash
npm run dev
```

Open the address shown (usually <http://localhost:5173>).
Then go to `/admin/login`, sign in, open **Products**, and either add products or click **Load sample products** (10 example products, in `src/seed/sampleProducts.js`).

## 9. Deploy to Vercel

1. Push this project to a GitHub repository.
2. On <https://vercel.com>, **Add New > Project**, import the repository. Vercel detects Vite automatically (build command `npm run build`, output `dist`).
3. Before deploying, open **Environment Variables** and add every variable from `.env`.
4. Click **Deploy**.
5. In Firebase **Authentication > Settings > Authorized domains**, add your Vercel domain (e.g. `moshi-hardware.vercel.app`) so admin login works there.

`vercel.json` makes page refreshes work on routes like `/shop` and `/admin/orders`.

---

## How order numbers work

Order numbers look like `MH-20261004-001`. A small document `counters/20261004` in Firestore counts orders per day (this is the one extra collection beyond `products`, `orders`, `users`). It is updated inside the same transaction that saves the order, so two customers never get the same number.

## Known MVP limitations

- **Order prices are set by the browser.** The app re-reads current prices from Firestore when placing an order, but a technically skilled person could still send a modified order directly to Firestore. Firestore rules cannot verify per-item prices without Cloud Functions. Always check totals when you confirm an order (you confirm every order with the customer anyway).
- The shop lists all products (including unavailable ones, shown as "Unavailable") so the availability label can be displayed.
- Delivery fee is "To be confirmed": the admin enters it on the order page.
- Orders are not tracked by customers, there are no payments, no stock counts.
