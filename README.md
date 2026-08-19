# Scanned By Nexlink Solutions — Mobile

> **TapShare** — A single-user, local-first digital contact card app built with Expo & React Native. Generate QR codes and write NFC tags that open the phone's native "Add Contact" screen directly — no intermediate webpage, no backend required.

---

## ✨ What It Does

TapShare turns your phone into a shareable digital business card:

1. **Edit your profile** (name, phone, email, social links) on-device.
2. **Generate a QR code** containing your contact information as a standard vCard 3.0 payload.
3. **Write an NFC tag** with the same vCard data — anyone who taps it gets your contact card instantly.
4. **Track scan counts** (optional) via a lightweight CountAPI integration — no database required.

Scanning the QR code or tapping the NFC tag opens the phone's **native "Add Contact" screen** with your info pre-filled. No website loads, no app install needed on the scanner's side.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                  TapShare App                    │
│                                                  │
│  ┌──────────────┐    ┌────────────────────────┐  │
│  │ AsyncStorage │───▶│   AppContext (state)    │  │
│  │  (on-device) │    │  user profile, stats   │  │
│  └──────────────┘    └───────────┬────────────┘  │
│                                  │               │
│                    ┌─────────────┼──────────┐    │
│                    ▼             ▼          ▼    │
│              ┌──────────┐ ┌──────────┐ ┌──────┐ │
│              │ QR Code  │ │ NFC Tag  │ │ Stats│ │
│              │ (vCard)  │ │ (vCard)  │ │ View │ │
│              └──────────┘ └──────────┘ └──┬───┘ │
│                                           │     │
│                              ┌────────────▼───┐ │
│                              │  CountAPI GET  │ │
│                              │  (read-only)   │ │
│                              └────────────────┘ │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│           Optional: Vercel Serverless            │
│                                                  │
│  /api/card.js                                    │
│  ├── Reads config/profile.js                     │
│  ├── Hits CountAPI /hit/ (increment)             │
│  └── Returns text/vcard (native Add Contact)     │
└──────────────────────────────────────────────────┘
```

### Local-First Design

The core "share my card" flow has **zero network dependency**:

- QR codes and NFC tags embed the vCard string directly — no URL, no server call.
- Editing your profile in the app instantly changes what new QR codes and NFC tags contain.
- Anyone who clones this repo can fill in their profile and generate working QR codes immediately, with no backend deployed.

### Optional Backend (`/api/card.js`)

A lightweight Vercel serverless function is included for **tracked sharing**:

- Serves the same vCard data as a downloadable `.vcf` file via HTTP.
- Logs each scan to CountAPI for a running total displayed in the Stats screen.
- To enable: deploy `api/card.js` and paste your URL into **Settings → Scan tracking (optional)**.
- If left blank, the app remains 100% local, QR/NFC embed raw vCard data, and Stats screen clearly explains tracking is off.

---

## 📁 Project Structure

```
├── App.tsx                          # Root component with ErrorBoundary
├── api/
│   └── card.js                      # Vercel serverless vCard endpoint (optional)
├── config/
│   └── profile.js                   # Server-side profile config (for api/card.js)
├── src/
│   ├── components/
│   │   ├── AddLinkModal.tsx          # Modal for adding social/website links
│   │   ├── CustomButton.tsx          # Reusable styled button component
│   │   ├── DualCardLogo.tsx          # Animated logo for onboarding screens
│   │   ├── ErrorBoundary.tsx         # React error boundary with retry UI
│   │   ├── HeaderNav.tsx             # Safe-area-aware navigation header bar
│   │   └── NFCWaveAnimation.tsx      # Animated NFC pulse rings
│   ├── config/
│   │   └── profile.ts               # TypeScript profile defaults & env config
│   ├── constants/
│   │   └── theme.ts                  # Design tokens: colors, spacing, radii, shadows
│   ├── context/
│   │   └── AppContext.tsx            # Global state: user profile, scan count, actions
│   ├── navigation/
│   │   ├── BottomTabNavigator.tsx    # Floating bottom tab bar (Dashboard, QR, Settings)
│   │   └── RootNavigator.tsx         # Stack navigator with all screens
│   ├── screens/
│   │   ├── DashboardScreen.tsx       # Main hub: QR preview, NFC shortcut, live stats
│   │   ├── EditProfileScreen.tsx     # Edit name, phone, and social links
│   │   ├── GetStartedScreen.tsx      # Onboarding welcome screen
│   │   ├── LoginScreen.tsx           # Login/signup screen (single-user MVP)
│   │   ├── NFCTagSharingScreen.tsx   # NFC tag writing flow with state animations
│   │   ├── ProfileSetupScreen.tsx    # Initial profile setup after onboarding
│   │   ├── PublicProfileScreen.tsx   # Public-facing profile card view
│   │   ├── QRCodeReadyScreen.tsx     # "Your QR code is ready!" celebration screen
│   │   ├── QRCodeViewScreen.tsx      # Full QR code view with share/save actions
│   │   ├── QRScannerScreen.tsx       # Camera-based QR code scanner
│   │   ├── SettingsScreen.tsx        # App settings and profile reset
│   │   ├── SplashScreen.tsx          # Animated app launch screen
│   │   └── StatsScreen.tsx           # Live scan count from CountAPI
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces for all data models
│   └── utils/
│       └── vcard.ts                  # Local-first vCard 3.0 string generator
├── app.json                          # Expo configuration
├── package.json                      # Dependencies and build scripts
├── tsconfig.json                     # TypeScript configuration
└── vercel.json                       # Vercel deployment routing
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [Expo CLI](https://docs.expo.dev/) (`npm install -g expo-cli`)
- A phone with [Expo Go](https://expo.dev/go) installed, or an emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/HarryMofoka/Scanned-By-Nexlink-Solutions--Mobile.git
cd Scanned-By-Nexlink-Solutions--Mobile

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code in the terminal with Expo Go on your phone, or press `w` for web.

### Set Up Your Profile

1. Open the app → navigate to **Settings** → **Edit Profile**.
2. Enter your name, phone number, and add social links.
3. Go back to the **Dashboard** — your QR code is ready to share!

No server deployment, no API keys, no config files to edit.

---

## 🔧 Configuration

### Profile Configuration (Single-User)

The app reads profile data from **AsyncStorage** on the device. Default values come from [`src/config/profile.ts`](src/config/profile.ts), which can be customised:

| Field          | Description                                | Default                                       |
|----------------|--------------------------------------------|-----------------------------------------------|
| `firstName`    | First name                                 | `Thabo`                                       |
| `lastName`     | Last name                                  | `Nkosi`                                       |
| `phone`        | Phone number                               | `+27 82 123 4567`                             |
| `email`        | Email address                              | `thabo@tapshare.app`                          |
| `links`        | Array of `{label, url}` social links       | LinkedIn, Instagram, GitHub, Website          |
| `countApiKey`  | CountAPI namespace for scan tracking       | `tapshare-thabo`                              |
| `cardUrl`      | Deployed vCard endpoint (optional backend) | `https://tapshare-scanned.vercel.app/api/card`|

### Environment Variables (Optional)

| Variable                    | Purpose                                  |
|-----------------------------|------------------------------------------|
| `EXPO_PUBLIC_CARD_URL`      | Override the deployed vCard endpoint URL  |
| `EXPO_PUBLIC_COUNT_API_KEY` | Override the CountAPI namespace           |
| `CARD_URL`                  | Server-side override for `api/card.js`    |
| `VERCEL_URL`                | Auto-set by Vercel; used as fallback URL  |

---

## 📱 Screens Overview

| Screen              | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| **Dashboard**       | Main hub showing QR code preview, NFC shortcut, and live scan count     |
| **QR Code View**    | Full-screen QR code with share and save options                         |
| **QR Code Ready**   | Celebration screen shown after first profile setup                      |
| **NFC Tag Sharing** | Guided NFC tag writing flow with animated states                        |
| **QR Scanner**      | Camera-based QR code reader                                             |
| **Stats**           | Live total scan count from CountAPI with "no scans yet" empty state     |
| **Edit Profile**    | Edit name, phone, and manage social links                               |
| **Settings**        | Profile overview, app preferences, and profile reset                    |
| **Public Profile**  | How your profile looks to someone who scans your QR/NFC                 |

---

## 🔌 Optional: Deploy the Backend

The app works fully offline, but you can optionally deploy the serverless vCard endpoint for tracked sharing:

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the project root
vercel
```

The deployment uses `vercel.json` to:
- Serve the Expo web export from `dist/` as a static SPA.
- Route `/api/card` to the `api/card.js` serverless function.

Each time someone visits `/api/card`, the function:
1. Increments a CountAPI counter (`/hit/tapshare-thabo/scans`).
2. Returns the profile as a `text/vcard` response, triggering the phone's native "Add Contact" screen.

---

## 🛠️ Build Scripts

| Command            | Description                                 |
|--------------------|---------------------------------------------|
| `npm start`        | Start Expo dev server                       |
| `npm run android`  | Start on Android emulator                   |
| `npm run ios`      | Start on iOS simulator                      |
| `npm run web`      | Start web dev server                        |
| `npm run build`    | Export production bundles to `dist/`         |
| `npm run build:web`| Export production web bundle to `dist/`      |

---

## 🧪 Verification

```bash
# TypeScript type checking (should report 0 errors)
npx tsc --noEmit

# Expo SDK compatibility check (should report all checks passed)
npx expo-doctor

# Production export (generates dist/ for all platforms)
npx expo export
```

---

## 📄 Tech Stack

| Technology                        | Purpose                              |
|-----------------------------------|--------------------------------------|
| **Expo SDK 57**                   | React Native framework & toolchain   |
| **React Native 0.86**            | Cross-platform mobile UI             |
| **React 19**                     | Component rendering                  |
| **TypeScript 6**                 | Type-safe development                |
| **AsyncStorage**                 | On-device profile persistence        |
| **react-native-qrcode-svg**     | QR code generation from vCard data   |
| **expo-camera**                  | QR code scanning                     |
| **react-navigation**            | Stack & tab navigation               |
| **CountAPI** (optional)          | Free serverless scan counter         |
| **Vercel** (optional)            | Serverless deployment platform       |

---

## 📝 License

This project is private. All rights reserved by [Nexlink Solutions](https://github.com/HarryMofoka).

---

## 👤 Author

**Harry Mofoka** — [Nexlink Solutions](https://github.com/HarryMofoka)

Built with ❤️ using Expo & React Native.
