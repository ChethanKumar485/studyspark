import { useState } from 'react';
import { CheckCircle2, Footprints, Plus } from 'lucide-react';
import Sheet from './Sheet';
import { useStore } from '../lib/store';
import type { Chapter, Subject } from '../lib/types';

interface Props {
  subject: Subject | null;
  chapter: Chapter | null;
  onClose: () => void;
  onWalked: () => void;
}

export default function ChapterSheet({ subject, chapter, onClose, onWalked }: Props) {
  const { markChapterWalked, addCard } = useStore();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  if (!subject || !chapter) return null;

  function handleWalk() {
    if (!subject || !chapter || chapter.walked) return;
    markChapterWalked(subject.id, chapter.id);
    onWalked();
  }

  function handleAddCard() {
    if (!subject || !chapter || !front.trim() || !back.trim()) return;
    addCard(subject.id, chapter.id, front.trim(), back.trim());
    setFront('');
    setBack('');
  }

  return (
    <Sheet open={!!chapter} onClose={onClose} title={chapter.name}>
      <div className="flex flex-col gap-6">
        <button
          onClick={handleWalk}
          disabled={chapter.walked}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl2 font-display font-bold
                     disabled:opacity-60 transition-transform active:scale-[0.98]"
          style={{
            backgroundColor: chapter.walked ? 'transparent' : subject.color,
            color: chapter.walked ? undefined : '#0B0E1A',
            border: chapter.walked ? `1.5px solid ${subject.color}` : 'none',
          }}
        >
          {chapter.walked ? (
            <>
              <CheckCircle2 size={18} style={{ color: subject.color }} />
              <span style={{ color: subject.color }}>Walked</span>
            </>
          ) : (
            <>
              <Footprints size={18} />
              Mark as walked (+15 XP)
            </>
          )}
        </button>

        <div>
          <h3 className="font-display font-bold text-sm text-ltext dark:text-text mb-3">
            Flashcards ({chapter.cards.length})
          </h3>

          <div className="flex flex-col gap-2 mb-4 max-h-40 overflow-y-auto">
            {chapter.cards.map((c) => (
              <div
                key={c.id}
                className="rounded-xl2 bg-paper dark:bg-surface2 border border-lline dark:border-line px-3.5 py-2.5"
              >
                <p className="font-body text-sm text-ltext dark:text-text">{c.front}</p>
                <p className="font-body text-xs text-ldim dark:text-dim mt-0.5">{c.back}</p>
              </div>
            ))}
            {chapter.cards.length === 0 && (
              <p className="font-body text-sm text-ldim dark:text-dim italic">No cards yet — add one below.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Question / front"
              className="rounded-xl2 bg-paper dark:bg-surface2 border border-lline dark:border-line
                         px-3.5 py-2.5 font-body text-sm text-ltext dark:text-text outline-none focus:border-gold"
            />
            <input
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Answer / back"
              className="rounded-xl2 bg-paper dark:bg-surface2 border border-lline dark:border-line
                         px-3.5 py-2.5 font-body text-sm text-ltext dark:text-text outline-none focus:border-gold"
            />
            <button
              onClick={handleAddCard}
              disabled={!front.trim() || !back.trim()}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl2 border border-teal text-teal
                         font-body text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} /> Add card
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
