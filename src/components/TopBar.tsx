import { Flame, Moon, Sun } from 'lucide-react';
import { useStore } from '../lib/store';

export default function TopBar() {
  const { streak, level, xpIntoLevel, xpSpanForLevel, theme, toggleTheme } = useStore();
  const pct = Math.min(100, Math.round((xpIntoLevel / xpSpanForLevel) * 100));

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-paper/85 dark:bg-ink/85 border-b border-lline dark:border-line">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-extrabold text-ltext dark:text-text tracking-tight">
            StudySpark
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-coral/10 text-coral">
            <Flame size={15} strokeWidth={2.5} />
            <span className="font-mono text-xs font-bold">{streak}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-14 h-1.5 rounded-full bg-lline dark:bg-line overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono text-xs font-bold text-ldim dark:text-dim">Lv{level}</span>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-full text-ldim dark:text-dim hover:bg-lline/60 dark:hover:bg-line/60 transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
