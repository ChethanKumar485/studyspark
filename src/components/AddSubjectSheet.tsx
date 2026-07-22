import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Sheet from './Sheet';
import { useStore } from '../lib/store';

const COLOR_CHOICES = ['#F2B134', '#4ECDC4', '#FF6B5B', '#8890B5', '#7C9EF2', '#B47CF2', '#6BD98A'];

export default function AddSubjectSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addSubject } = useStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_CHOICES[0]);
  const [chapters, setChapters] = useState<string[]>(['']);

  function reset() {
    setName('');
    setColor(COLOR_CHOICES[0]);
    setChapters(['']);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    if (!name.trim()) return;
    addSubject(name, color, chapters);
    handleClose();
  }

  return (
    <Sheet open={open} onClose={handleClose} title="New subject">
      <div className="flex flex-col gap-5">
        <div>
          <label className="font-body text-xs font-semibold text-ldim dark:text-dim uppercase tracking-wide">
            Subject name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Organic Chemistry"
            className="mt-1.5 w-full rounded-xl2 bg-paper dark:bg-surface2 border border-lline dark:border-line
                       px-3.5 py-2.5 font-body text-ltext dark:text-text outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="font-body text-xs font-semibold text-ldim dark:text-dim uppercase tracking-wide">
            Trail color
          </label>
          <div className="mt-2 flex gap-2 flex-wrap">
            {COLOR_CHOICES.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Choose color ${c}`}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  color === c ? 'scale-[1.15] border-ltext dark:border-text' : 'scale-100 border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="font-body text-xs font-semibold text-ldim dark:text-dim uppercase tracking-wide">
            Chapters
          </label>
          <div className="mt-2 flex flex-col gap-2">
            {chapters.map((ch, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={ch}
                  onChange={(e) => {
                    const next = [...chapters];
                    next[i] = e.target.value;
                    setChapters(next);
                  }}
                  placeholder={`Chapter ${i + 1}`}
                  className="flex-1 rounded-xl2 bg-paper dark:bg-surface2 border border-lline dark:border-line
                             px-3.5 py-2.5 font-body text-sm text-ltext dark:text-text outline-none focus:border-gold"
                />
                {chapters.length > 1 && (
                  <button
                    onClick={() => setChapters(chapters.filter((_, idx) => idx !== i))}
                    aria-label="Remove chapter"
                    className="p-2 text-ldim dark:text-dim hover:text-coral"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setChapters([...chapters, ''])}
              className="flex items-center gap-1.5 self-start font-body text-sm font-semibold text-teal mt-1"
            >
              <Plus size={16} /> Add chapter
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="mt-2 w-full py-3 rounded-xl2 bg-gold text-ink font-display font-bold
                     disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
        >
          Start the trail
        </button>
      </div>
    </Sheet>
  );
}
