# MyTelkomsel Clone - Next.js & React

Website clone MyTelkomsel dengan Next.js 14 dan React 18 menggunakan App Router.

## Fitur

- ✅ Next.js 14 dengan App Router
- ✅ React 18 dengan TypeScript
- ✅ Context API untuk state management
- ✅ Component-based architecture
- ✅ Responsive design
- ✅ Modern CSS dengan CSS Variables
- ✅ Smooth animations dan transitions
- ✅ Popup AI Recommendation
- ✅ Tab navigation dengan state management

## Teknologi

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: CSS Modules + Global CSS
- **Font**: Inter (Google Fonts)

## Setup

### Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### Development

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build untuk Production

```bash
npm run build
npm start
```

## Struktur Project

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Header component
│   ├── Header.module.css   # Header styles
│   ├── SpecialSection.tsx  # Special packages section
│   ├── PackageSection.tsx  # Package selection section
│   ├── PackageCard.tsx     # Package card component
│   ├── TabButton.tsx       # Tab button component
│   └── Popup.tsx           # AI recommendation popup
├── context/
│   └── PackageContext.tsx  # Package context & state
├── public/
│   └── src/
│       └── logo.png        # Logo file
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Fitur Komponen

### Header
- Navigation menu
- Language selector
- Balance display
- Top-up button

### SpecialSection
- Menampilkan paket spesial
- Horizontal scrollable cards
- Badge "Berlangganan" pada semua cards

### PackageSection
- Tab navigation (6 kategori)
- Dynamic content berdasarkan tab aktif
- Section "Rekomendasi Utama" dan "Spesial Waktu Terbatas"
- Grid layout untuk paket internet

### PackageCard
- Reusable card component
- Hover effects
- Click handler untuk popup
- Badge support

### Popup
- AI recommendation modal
- Accept/reject actions
- Smooth animations

## State Management

Menggunakan React Context API untuk:
- Package data management
- Popup state
- Recommendation logic

## Catatan

- Logo harus ditempatkan di `public/src/logo.png`
- Semua styles menggunakan CSS Variables untuk konsistensi
- TypeScript untuk type safety
- Component-based architecture untuk maintainability
