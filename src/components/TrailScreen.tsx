import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Plus } from 'lucide-react';
import { useStore } from '../lib/store';
import AddSubjectSheet from './AddSubjectSheet';
import ChapterSheet from './ChapterSheet';
import type { Chapter, Subject } from '../lib/types';

export default function TrailScreen({ pushToast }: { pushToast: (text: string) => void }) {
  const { subjects, getQuest } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [active, setActive] = useState<{ subject: Subject; chapter: Chapter } | null>(null);

  const quest = getQuest();

  return (
    <div className="max-w-md mx-auto px-4 pt-5 pb-8">
      {quest && (
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            const subject = subjects.find((s) => s.id === quest.subjectId);
            const chapter = subject?.chapters.find((c) => c.id === quest.chapterId);
            if (subject && chapter) setActive({ subject, chapter });
          }}
          className="w-full text-left mb-6 rounded-xl2 p-4 flex items-center gap-3"
          style={{ backgroundColor: `${quest.color}1A`, border: `1px solid ${quest.color}55` }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: quest.color }}
          >
            <Compass size={18} color="#0B0E1A" />
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs font-semibold uppercase tracking-wide" style={{ color: quest.color }}>
              Today's quest
            </p>
            <p className="font-display font-bold text-sm text-ltext dark:text-text truncate">
              {quest.chapterName} · {quest.subjectName}
            </p>
          </div>
        </motion.button>
      )}

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-3 py-16">
          <p className="font-display font-bold text-lg text-ltext dark:text-text">Your trail is empty</p>
          <p className="font-body text-sm text-ldim dark:text-dim max-w-xs">
            Add a subject and its chapters — every chapter becomes a stop on your trail.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {subjects.map((subject) => (
            <SubjectTrail
              key={subject.id}
              subject={subject}
              onSelectChapter={(chapter) => setActive({ subject, chapter })}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-20 right-1/2 translate-x-[9.5rem] z-20 w-14 h-14 rounded-full bg-gold
                   text-ink shadow-card flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Add subject"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <AddSubjectSheet open={addOpen} onClose={() => setAddOpen(false)} />
      <ChapterSheet
        subject={active?.subject ?? null}
        chapter={active?.chapter ?? null}
        onClose={() => setActive(null)}
        onWalked={() => {
          pushToast(`Nice — ${active?.chapter.name} walked! +15 XP`);
        }}
      />
    </div>
  );
}

function SubjectTrail({
  subject,
  onSelectChapter,
}: {
  subject: Subject;
  onSelectChapter: (c: Chapter) => void;
}) {
  const total = subject.chapters.length;
  const walked = subject.chapters.filter((c) => c.walked).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
          <h3 className="font-display font-bold text-ltext dark:text-text">{subject.name}</h3>
        </div>
        <span className="font-mono text-xs text-ldim dark:text-dim">
          {walked}/{total}
        </span>
      </div>

      {total === 0 ? (
        <p className="font-body text-sm text-ldim dark:text-dim italic pl-4">No chapters yet.</p>
      ) : (
        <div className="relative pl-4">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-0.5 rounded-full"
            style={{ backgroundColor: `${subject.color}33` }}
          />
          <div className="flex flex-col gap-3">
            {subject.chapters.map((chapter, i) => (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelectChapter(chapter)}
                className="relative flex items-center gap-3 text-left"
              >
                <span
                  className="relative z-10 w-4 h-4 rounded-full border-2 shrink-0"
                  style={{
                    backgroundColor: chapter.walked ? subject.color : 'transparent',
                    borderColor: subject.color,
                  }}
                />
                <span
                  className={`font-body text-sm ${
                    chapter.walked ? 'text-ldim dark:text-dim line-through' : 'text-ltext dark:text-text'
                  }`}
                >
                  {chapter.name}
                </span>
                <span className="ml-auto font-mono text-[10px] text-ldim dark:text-dim">
                  {chapter.cards.length > 0 ? `${chapter.cards.length} cards` : ''}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
