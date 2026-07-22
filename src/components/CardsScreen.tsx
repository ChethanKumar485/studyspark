import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../lib/store';

const QUALITY_OPTIONS: { id: 'again' | 'hard' | 'good' | 'easy'; label: string; classes: string }[] = [
  { id: 'again', label: 'Again', classes: 'bg-coral/15 text-coral border-coral/40' },
  { id: 'hard', label: 'Hard', classes: 'bg-gold/15 text-gold border-gold/40' },
  { id: 'good', label: 'Good', classes: 'bg-teal/15 text-teal border-teal/40' },
  { id: 'easy', label: 'Easy', classes: 'bg-teal/25 text-teal border-teal/50' },
];

export default function CardsScreen({ pushToast }: { pushToast: (text: string) => void }) {
  const { getDueCards, reviewCard } = useStore();
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);

  const due = getDueCards();
  const current = due[index];

  function handleReview(quality: 'again' | 'hard' | 'good' | 'easy') {
    if (!current) return;
    reviewCard(current.subject.id, current.chapter.id, current.card.id, quality);
    setFlipped(false);
    if (index >= due.length - 1) {
      setIndex(0);
      if (due.length === 1) pushToast('All caught up on cards!');
    }
  }

  if (!current) {
    return (
      <div className="max-w-md mx-auto px-4 pt-16 pb-8 flex flex-col items-center text-center gap-3">
        <p className="font-display font-bold text-lg text-ltext dark:text-text">No cards due</p>
        <p className="font-body text-sm text-ldim dark:text-dim max-w-xs">
          Add flashcards to a chapter from the Trail tab, and they'll show up here when they're due for review.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-8 flex flex-col items-center">
      <p className="font-mono text-xs text-ldim dark:text-dim mb-4">
        {index + 1} / {due.length} due
      </p>

      <div className="w-full mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.subject.color }} />
        <span className="font-body text-xs font-semibold text-ldim dark:text-dim">
          {current.subject.name} · {current.chapter.name}
        </span>
      </div>

      <div className="relative w-full h-64 mb-6" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.card.id + String(flipped)}
            className="absolute inset-0 rounded-xl2 border border-lline dark:border-line bg-lsurface dark:bg-surface
                       shadow-card flex items-center justify-center p-6 text-center cursor-pointer select-none"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setFlipped((f) => !f)}
          >
            <p className="font-display font-semibold text-xl text-ltext dark:text-text">
              {flipped ? current.card.back : current.card.front}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {!flipped ? (
        <button
          onClick={() => setFlipped(true)}
          className="w-full py-3 rounded-xl2 bg-gold text-ink font-display font-bold active:scale-[0.98] transition-transform"
        >
          Show answer
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2 w-full">
          {QUALITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleReview(opt.id)}
              className={`py-3 rounded-xl2 border font-body text-xs font-semibold ${opt.classes}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
