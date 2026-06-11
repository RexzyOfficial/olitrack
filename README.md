# OliTrack – Honda BeAT Deluxe Oil Change Tracker
> Pengingat Ganti Oli Mesin & Oli Gardan · Progressive Web App

A mobile-first PWA to track oil change schedules for Honda BeAT Deluxe.  
No backend, no account — all data stored locally in your browser.

---

## 📁 File Structure

```
olitrack/
├── index.html       ← Main app (HTML + Tailwind + JS)
├── sw.js            ← Service Worker (offline + caching)
├── manifest.json    ← PWA manifest (installable on Android/iOS)
├── icon-192.svg     ← App icon (192×192)
├── icon-512.svg     ← App icon (512×512)
└── README.md        ← This file
```

---

## 🚀 Deploy in 60 Seconds

### Option A — Netlify (Drag & Drop)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `olitrack/` folder into the browser
3. Done — your URL is ready instantly ✅

### Option B — Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the olitrack/ folder
cd olitrack
vercel --prod
```

### Option C — GitHub Pages
```bash
# 1. Create a repo on github.com
# 2. Push files
git init
git add .
git commit -m "feat: OliTrack PWA"
git remote add origin https://github.com/USERNAME/olitrack.git
git push -u origin main

# 3. Go to repo Settings → Pages → Source: main branch / root
```

---

## 📱 Install as Android App

1. Open your deployed URL in **Chrome for Android**
2. Tap the **⋮** menu → "Add to Home Screen"
3. Tap "Add" → OliTrack icon appears on your home screen
4. Open it — it runs fullscreen like a native app!

---

## ⚙️ Default Settings

| Component   | Interval Default |
|-------------|-----------------|
| Oli Mesin   | 30 hari         |
| Oli Gardan  | 60 hari         |
| Peringatan  | 5 hari sebelum  |

Customizable via **Pengaturan** tab in the app.

---

## 🛠 Tech Stack

- **Tailwind CSS** (CDN) — utility-first styling
- **Vanilla JavaScript** — zero dependencies
- **LocalStorage** — persistent data, no server needed
- **Service Worker** — offline capability
- **PWA Manifest** — installable on home screen
- **Font Awesome 6** — icons
- **Google Fonts** — Space Grotesk + Inter + JetBrains Mono

---

## 🔒 Privacy

All data stays on **your device only**.  
Nothing is sent to any server. Ever.
