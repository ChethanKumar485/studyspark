# ⚡ StudySpark — The Trail (React edition)

An installable phone app that fights the "study the night before the exam" habit — by turning the
syllabus into a **trail walked a little every day**, with recall flashcards, a focus timer,
streaks, XP, badges, and a weekly activity chart.

This is the upgraded build: **React + TypeScript + Tailwind CSS**, animated with
**Framer Motion**, charted with **Recharts**, installable as a real **PWA**. No backend, no
signup — all data stays on the student's own phone.

---

## What's new in this version

| Before (plain HTML) | Now (React edition) |
|---|---|
| Vanilla HTML/CSS/JS | React 19 + TypeScript, component-based |
| Flat colors, no motion | Framer Motion transitions, animated trail nodes, card flips |
| One dark theme only | **Dark and light theme toggle** |
| Chapters shown in one fixed color | **Per-subject trail colors** you pick when creating a subject |
| No analytics | **Weekly activity bar chart** (Recharts) on the Progress tab |
| No backup | **Export / import your data as JSON** — a real backup, since everything is local-only |
| Manual `<script>` service worker | `vite-plugin-pwa` — auto-generated, auto-updating service worker |
| Manual GitHub Pages steps | **GitHub Actions workflow included** — push to `main` and it deploys itself |

Core study mechanics carried over and kept: the trail of chapters, the daily "quest" that always
suggests the subject untouched longest, the focus timer, spaced-repetition flashcards, streaks,
XP/levels, and badges.

---

## Tech stack

- **React 19 + TypeScript** — app logic and UI
- **Vite** — dev server and build
- **Tailwind CSS** — styling, dark/light theme via a token system
- **Framer Motion** — trail node reveals, card flips, toast/sheet transitions
- **Recharts** — the weekly activity chart
- **lucide-react** — icons
- **vite-plugin-pwa** — installable, offline-capable app, auto-updating service worker

---

## Project structure

```
studyspark-react/
├── src/
│   ├── main.tsx               # entry point
│   ├── App.tsx                 # screen router + evening nudge
│   ├── index.css                # Tailwind + base styles
│   ├── lib/
│   │   ├── store.tsx              # all app state, logic, spaced repetition, badges
│   │   └── types.ts                # shared TypeScript types
│   └── components/
│       ├── TopBar.tsx              # streak, level, theme toggle
│       ├── BottomNav.tsx            # Trail / Focus / Cards / Progress tabs
│       ├── TrailScreen.tsx           # the winding trail (signature visual)
│       ├── FocusScreen.tsx            # pomodoro-style timer
│       ├── CardsScreen.tsx             # spaced-repetition flashcard review
│       ├── ProgressScreen.tsx           # XP, stats, weekly chart, badges, backup
│       ├── AddSubjectSheet.tsx           # add subject + chapters + color
│       ├── ChapterSheet.tsx               # chapter detail + add card + mark walked
│       ├── Sheet.tsx                       # reusable bottom-sheet modal
│       └── Toast.tsx                        # toast notifications
├── public/icons/               # app icons (192px, 512px)
├── .github/workflows/deploy.yml  # auto-deploy to GitHub Pages on push
├── vite.config.ts               # PWA manifest + relative base path
├── tailwind.config.js            # design tokens (colors, fonts)
└── package.json
```

---

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

Build a production bundle:

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

---

## Step 1 — Push it to GitHub

```bash
cd studyspark-react
git init
git add .
git commit -m "StudySpark React: initial version"
git branch -M main
git remote add origin https://github.com/ChethanKumar485/studyspark.git
git push -u origin main
```

## Step 2 — Turn on GitHub Pages (auto-deploy, no manual build step)

This project ships with `.github/workflows/deploy.yml`, so GitHub builds and deploys it for you
on every push to `main`.

1. On GitHub, open your repo → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not "Deploy from a branch").
3. Push to `main` (or re-run the workflow from the **Actions** tab).
4. After the workflow finishes (~1 minute), your live URL appears at:
   `https://<ChethanKumar485>.github.io/<repo-name>/`

Because `vite.config.ts` uses a relative base path (`base: './'`), this works regardless of the
repo name — no extra config needed.

## Step 3 — Install it on a phone

**Android (Chrome):**
1. Open the GitHub Pages URL in Chrome.
2. Tap **⋮** → **Add to Home screen** (or use the automatic "Install app" banner).
3. The StudySpark icon appears on the home screen and opens full-screen.

**iPhone (Safari):**
1. Open the URL in Safari.
2. Tap **Share** → **Add to Home Screen**.
3. It now opens full-screen from the home screen icon.

---

🌐 **Live Demo:** https://chethankumar485.github.io/studyspark/

---

## ✨ Features

- 📖 Subject & Chapter Management
- 🗺️ Interactive Study Trail
- ⏱️ Pomodoro Focus Timer
- 🧠 Spaced Repetition Flashcards
- 🔥 Daily Study Streaks
- ⭐ XP, Levels & Achievement Badges
- 📊 Weekly Progress Analytics
- 🎨 Dark & Light Theme
- 💾 Export & Import Study Data
- 📱 Installable Progressive Web App (PWA)
- 🌐 Offline Support
- ⚡ Fast Performance with Vite

---

# 📱 Screens

- Trail
- Focus
- Flashcards
- Progress Dashboard
- Subject Manager
- Chapter Manager
- Backup & Restore

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Development |
| TypeScript | Type Safety |
| Vite | Development & Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Weekly Activity Charts |
| Lucide React | Icons |
| Vite Plugin PWA | Progressive Web App Support |
| GitHub Actions | Automatic Deployment |
| GitHub Pages | Hosting |




---

# 🌐 GitHub Pages Deployment

This project uses **GitHub Actions** to automatically build and deploy the application to **GitHub Pages**.

Every push to the **main** branch automatically:

- Installs dependencies
- Builds the project
- Deploys to GitHub Pages

Live Website:

**https://chethankumar485.github.io/studyspark/**

---

# ⚙️ GitHub Pages Configuration

1. Open your repository.
2. Go to **Settings → Pages**.
3. Under **Build and Deployment**:
   - Source → **GitHub Actions**
4. Push your changes to the **main** branch.
5. Wait for the deployment workflow to finish.

Your latest version will automatically be available online.

---

# 📲 Install as an App

## Android (Chrome)

1. Open the website.
2. Tap **⋮ Menu**.
3. Select **Add to Home Screen** or **Install App**.
4. Launch StudySpark directly from your home screen.

---

## iPhone (Safari)

1. Open the website in Safari.
2. Tap **Share**.
3. Select **Add to Home Screen**.
4. Launch the installed app from your home screen.

---

# 📊 Core Features

## 🗺️ Study Trail

- Organize subjects into chapters.
- Complete chapters one by one.
- Visual learning path.
- Progress tracking.

---

## ⏱️ Focus Timer

- Pomodoro study timer.
- Improves concentration.
- Tracks completed sessions.

---

## 🧠 Flashcards

- Spaced Repetition algorithm.
- Daily revision cards.
- Improves long-term memory.

---

## 📈 Progress Dashboard

- Weekly activity chart.
- Study statistics.
- XP tracking.
- Level progression.
- Badges & achievements.

---

## 💾 Backup & Restore

Export all study data as a JSON file.

Import previously exported backups anytime.

No account required.

Everything stays on your own device.

---

# 🎯 Why StudySpark?

Traditional study habits often lead to:

- Last-minute exam preparation
- Poor retention
- Low motivation
- Irregular study schedules

StudySpark solves this by encouraging:

- Daily learning
- Gamified progress
- Better memory retention
- Consistent revision
- Visual progress tracking

---

# 🔒 Privacy

StudySpark is designed with privacy in mind.

- No Login
- No Account
- No Ads
- No Tracking
- No Cloud Storage

All data remains stored locally in your browser unless you choose to export a backup.





---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for details.

---

# 👨‍💻 Author

**Chethan Kumar**

GitHub:
https://github.com/ChethanKumar485

Live Website:
https://chethankumar485.github.io/studyspark/


---

## ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the project

📢 Share it with your friends

Happy Studying! 📚✨
