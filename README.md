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
git remote add origin https://github.com/< ChethanKumar485 >/studyspark.git
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

## Honest limitations

- Data is local to one browser/phone — no account, no cloud sync, by design (zero backend, zero
  cost, zero tracking). Use **Progress → Export backup** before switching phones or clearing
  browser data, and **Import backup** to restore it.
- The evening nudge only fires while the app is open in the foreground. True background push
  notifications need a small server component — a good next step if this grows into a bigger
  build (see below).

## Ideas for extending this project

- Cloud sync via Firebase/Supabase so a streak survives a phone change.
- Real push notifications via a backend + service worker push.
- AI-generated flashcards from a photographed textbook page.
- Study groups / class leaderboard.
