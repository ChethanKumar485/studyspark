import { LayoutGrid, Layers, Timer, TrendingUp } from 'lucide-react';
import type { Screen } from '../App';

const TABS: { id: Screen; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'trail', label: 'Trail', icon: LayoutGrid },
  { id: 'focus', label: 'Focus', icon: Timer },
  { id: 'cards', label: 'Cards', icon: Layers },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export default function BottomNav({ active, onChange }: { active: Screen; onChange: (s: Screen) => void }) {
  return (
    <nav className="sticky bottom-0 z-30 backdrop-blur-md bg-paper/90 dark:bg-ink/90 border-t border-lline dark:border-line">
      <div className="max-w-md mx-auto grid grid-cols-4">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 py-2.5 relative"
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-gold' : 'text-ldim dark:text-dim'}
              />
              <span
                className={`font-body text-[11px] ${
                  isActive ? 'text-gold font-semibold' : 'text-ldim dark:text-dim'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
