import { useRef } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Award, Download, Upload } from 'lucide-react';
import { useStore } from '../lib/store';

function lastSevenDays(history: { date: string; minutesFocused: number; cardsReviewed: number; chaptersWalked: number }[]) {
  const days: { label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const entry = history.find((h) => h.date === key);
    days.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' })[0], minutes: entry?.minutesFocused ?? 0 });
  }
  return days;
}

export default function ProgressScreen({ pushToast }: { pushToast: (text: string) => void }) {
  const store = useStore();
  const { xp, level, streak, subjects, badges, history, exportBackup, importBackup } = store;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalChapters = subjects.reduce((s, sub) => s + sub.chapters.length, 0);
  const walkedChapters = subjects.reduce((s, sub) => s + sub.chapters.filter((c) => c.walked).length, 0);
  const chartData = lastSevenDays(history);
  const unlockedBadges = badges.filter((b) => b.unlockedAt);
  const lockedBadges = badges.filter((b) => !b.unlockedAt);

  function handleExport() {
    const data = exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyspark-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast('Backup downloaded');
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importBackup(String(reader.result));
      pushToast(ok ? 'Backup restored' : 'Could not read that backup file');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-8 flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="XP" value={xp.toString()} />
        <StatCard label="Level" value={level.toString()} />
        <StatCard label="Streak" value={`${streak}d`} />
      </div>

      <div className="rounded-xl2 border border-lline dark:border-line bg-lsurface dark:bg-surface p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold text-sm text-ltext dark:text-text">Chapters walked</h3>
          <span className="font-mono text-xs text-ldim dark:text-dim">
            {walkedChapters}/{totalChapters}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-lline dark:bg-line overflow-hidden mt-2">
          <div
            className="h-full bg-teal rounded-full transition-all"
            style={{ width: `${totalChapters ? (walkedChapters / totalChapters) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl2 border border-lline dark:border-line bg-lsurface dark:bg-surface p-4">
        <h3 className="font-display font-bold text-sm text-ltext dark:text-text mb-3">This week's focus (min)</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8890B5' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(242,177,52,0.08)' }}
                contentStyle={{ background: '#151933', border: '1px solid #2C3358', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#8890B5' }}
              />
              <Bar dataKey="minutes" fill="#F2B134" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-sm text-ltext dark:text-text mb-3">Badges</h3>
        <div className="grid grid-cols-4 gap-3">
          {[...unlockedBadges, ...lockedBadges].map((b) => (
            <div key={b.id} className="flex flex-col items-center gap-1.5" title={b.description}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                  b.unlockedAt ? 'bg-gold/15 border-gold text-gold' : 'bg-lline/40 dark:bg-line/40 border-transparent text-ldim dark:text-dim'
                }`}
              >
                <Award size={20} />
              </div>
              <span className="font-body text-[10px] text-center text-ldim dark:text-dim leading-tight">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl2 border border-lline dark:border-line bg-lsurface dark:bg-surface p-4">
        <h3 className="font-display font-bold text-sm text-ltext dark:text-text mb-1">Backup</h3>
        <p className="font-body text-xs text-ldim dark:text-dim mb-3">
          Everything lives on this device only. Export before switching phones or clearing browser data.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl2 bg-gold text-ink font-body text-sm font-semibold"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={handleImportClick}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl2 border border-lline dark:border-line text-ltext dark:text-text font-body text-sm font-semibold"
          >
            <Upload size={16} /> Import
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl2 border border-lline dark:border-line bg-lsurface dark:bg-surface py-3 flex flex-col items-center">
      <span className="font-mono text-xl font-bold text-ltext dark:text-text">{value}</span>
      <span className="font-body text-[10px] text-ldim dark:text-dim uppercase tracking-wide mt-0.5">{label}</span>
    </div>
  );
}
