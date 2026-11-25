<p align="center">
  <img src="assets/images/keli-icon.png" alt="Keli" width="96" />
</p>

<h1 align="center">Keli</h1>

<p align="center">
  <strong>Know where your money goes, in seconds.</strong><br />
  A simple income and expense tracker for iOS and Android, in English and Spanish.
</p>

<p align="center">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-SDK%2055-000020?logo=expo&logoColor=white" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.83-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Status" src="https://img.shields.io/badge/status-in%20development-orange" />
</p>

<!-- Screenshots: replace with your images -->
<p align="center">
  <img src="docs/screenshots/home.png" alt="Home" width="230" />
  <img src="docs/screenshots/transactions.png" alt="Transactions" width="230" />
  <img src="docs/screenshots/statistics.png" alt="Statistics" width="230" />
</p>

---

## What is Keli?

Most finance apps try to do everything. Keli does one thing well: it answers four questions about your money.

- **How much do I earn?**
- **How much do I spend?**
- **How much do I have left?**
- **How much am I saving?**

You record your income and expenses, assign them a category, and Keli shows you the full picture: balance, totals, monthly trends and where your money goes by category.

No bank connections, no spreadsheets, no accounting jargon.

## Features

- **Income and expense tracking.** Add, edit and delete transactions in a few taps.
- **Categories.** Each account starts with ready-to-use categories.
- **Dashboard.** Current balance, total income, total expenses and recent activity.
- **Statistics.** Monthly income vs. expenses and charts by category.
- **Your local currency.** USD, EUR, COP, MXN, PEN, CLP, ARS, UYU, BRL, CAD and GBP, detected automatically from your region.
- **English and Spanish.** Detected from your device and changeable at any time.
- **Light and dark mode.**
- **Sign in with email, Google or Apple.**

## Coming soon: Keli Plus

Keli will always be free for personal use. Keli Plus is an optional subscription that adds:

- **Shared finances.** Manage money together with your partner, family or roommates in a shared workspace. Only the owner needs Keli Plus; invited members join for free.
- **Financial strategies.** Apply popular rules such as **50/30/20** or **70/20/10** to your workspace and see how your real spending compares. They are educational templates that you choose to use, not financial advice.

## Roadmap

**Release 1: free MVP**

- [x] Authentication (email, Google, Apple)
- [x] Automatic personal workspace and default categories
- [x] Income and expense transactions
- [x] Dashboard and statistics
- [x] Workspace currency and language settings
- [ ] Create, edit and delete categories
- [ ] Short onboarding (welcome, currency confirmation, first transaction)
- [ ] In-app account deletion
- [ ] App Store and Google Play release

**Release 2: Keli Plus**

- [ ] Subscriptions with RevenueCat
- [ ] Shared workspaces and invitations
- [ ] Financial strategies (50/30/20, 70/20/10, 80/20)

## Tech stack

| Layer           | Technology                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Mobile app      | React Native, Expo, Expo Router, TypeScript                                                     |
| Styling         | NativeWind (Tailwind CSS)                                                                       |
| State and forms | Zustand, React Hook Form, Zod                                                                   |
| Charts          | Victory Native, React Native Skia                                                               |
| Localization    | i18next, expo-localization                                                                      |
| Authentication  | Clerk                                                                                           |
| Backend         | Node.js, Express, TypeScript, Zod ([keli-backend](https://github.com/KevinLuna17/keli-backend)) |
| Database        | PostgreSQL on Neon, Drizzle ORM                                                                 |
| Subscriptions   | RevenueCat (Release 2)                                                                          |

### Design principles

- **Workspace-first.** Transactions and categories belong to a workspace, not to a user, so shared finances work without changing the data model.
- **The backend does the math.** All balances and statistics are calculated on the server; the app only displays them.
- **No floating-point money.** Amounts are stored as integers in the smallest currency unit (`$10.50` → `1050`).
- **Never trust the client.** The user's identity always comes from the verified Clerk session.

## Project structure

```
src/
├── app/          # Screens and navigation (Expo Router)
├── components/   # UI components grouped by feature
├── hooks/        # Data and form hooks
├── services/     # API clients for each backend module
├── stores/       # Client-only state (Zustand)
├── lib/          # Utilities: currency, validation, API client
├── locales/      # Translations (en, es)
└── providers/    # Clerk, i18n and backend sync providers
```

## Getting started

### Requirements

- Node.js 20+
- Xcode (iOS) or Android Studio (Android)
- A [Clerk](https://dashboard.clerk.com) application
- The [keli-backend](https://github.com/KevinLuna17/keli-backend) API running locally

### Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy the environment variables

   ```bash
   cp .env.example .env
   ```

   | Variable                            | Description                                                                                                    |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
   | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key from the Clerk Dashboard                                                                       |
   | `EXPO_PUBLIC_API_URL`               | Backend URL, e.g. `http://localhost:3000/api` (iOS Simulator) or `http://10.0.2.2:3000/api` (Android Emulator) |

3. Run the app

   ```bash
   npm run ios      # or: npm run android
   ```

   The app uses native modules, so it runs as a development build, not in Expo Go.

## Contributing

Keli is a personal project in active development. Issues and suggestions are welcome.
