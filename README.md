# GlassCook 🍳

A personal, offline-first cooking recipe notebook built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Dexie (IndexedDB)**, and the **Apple Glassmorphic Theme System**.

Bundled as a standalone, zero-server single-file application via `vite-plugin-singlefile`.

---

## ✨ Features

- **Apple Glassmorphism Design**: Translucent blurred cards, dynamic glass borders, glowing focus rings, and silky micro-interactions.
- **7 Curated Theme Presets**:
  - Modern Apple (Default)
  - Ocean Sapphire
  - Cyberpunk Neon
  - Emerald Forest
  - Sunset Amber
  - Rose Velvet
  - Nordic Frost
- **Dark & Light Mode**: Instant toggle with persistence in `localStorage` and zero-flash initialization.
- **Pre-loaded with your Google Keep Recipes**:
  1. **Dal Curry 🌾** (Pressure cooker recipe with timing & spice ratios)
  2. **Noodles 🍜** (Mushroom stir-fry with Scrambled Eggs & Egg Drop method variations + web citations)
  3. **Biryani 🍗** (One-pot chicken & vegetable pressure cooker biryani)
- **Local-first / Offline-first**:
  - Powered by **Dexie (IndexedDB)** for fast indexed queries.
  - Mirrored in browser **`localStorage`** for fail-safe data storage.
  - Zero backend required — completely private and offline.
- **Interactive Chef Tools**:
  - Click to check off ingredients in real-time while cooking.
  - Variation switcher for alternate cooking methods.
  - One-click copy/share recipe to clipboard.
  - Filter by category, favorite, and full-text keyword search across titles, ingredients, and chef notes.
- **Data Export & Import**:
  - One-click backup to `.json` file.
  - Import existing `.json` recipes files.
  - Copy raw `localStorage` payload directly from the Data menu.
- **Single-File Standalone HTML**:
  - Production build outputs a single file `dist/index.html` (JS, CSS, SVGs completely inlined).
  - Can be double-clicked or opened directly via `file:///` in any web browser without needing a web server!

---

## 🚀 Quick Start

### Development
```bash
pnpm install
pnpm run dev
```

### Build Single-File Standalone App
```bash
pnpm run build
```
The output file will be generated at [`dist/index.html`](dist/index.html). You can double-click it directly or open it from file manager in Chrome, Edge, Safari, or Firefox!

---

## 📦 Pushing to GitHub

To push this repository to your GitHub account:
```bash
# 1. Authenticate with GitHub CLI:
gh auth login

# 2. Create the remote repository:
gh repo create recipe-app --public --source=. --remote=origin --push

# Or push to an existing GitHub repo URL:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
