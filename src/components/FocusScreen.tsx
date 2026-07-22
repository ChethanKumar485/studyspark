import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useStore } from '../lib/store';

const DURATIONS = [15, 25, 45];

export default function FocusScreen({ pushToast }: { pushToast: (text: string) => void }) {
  const { logFocusSession } = useStore();
  const [durationMin, setDurationMin] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          const minutes = durationMin;
          logFocusSession(minutes);
          pushToast(`Focus session complete — +${minutes} XP`);
          return 0;
        }
        elapsedRef.current += 1;
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function selectDuration(min: number) {
    setDurationMin(min);
    setSecondsLeft(min * 60);
    setRunning(false);
    elapsedRef.current = 0;
  }

  function reset() {
    setSecondsLeft(durationMin * 60);
    setRunning(false);
    elapsedRef.current = 0;
  }

  function stopEarlyAndLog() {
    setRunning(false);
    const minutes = Math.round(elapsedRef.current / 60);
    if (minutes > 0) {
      logFocusSession(minutes);
      pushToast(`Logged ${minutes} min of focus — +${minutes} XP`);
    }
    setSecondsLeft(durationMin * 60);
    elapsedRef.current = 0;
  }

  const total = durationMin * 60;
  const pct = ((total - secondsLeft) / total) * 100;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="max-w-md mx-auto px-4 pt-8 pb-8 flex flex-col items-center">
      <div className="flex gap-2 mb-8">
        {DURATIONS.map((d) => (
          <button
            key={d}
            onClick={() => selectDuration(d)}
            className={`px-4 py-1.5 rounded-full font-body text-sm font-semibold transition-colors ${
              durationMin === d
                ? 'bg-gold text-ink'
                : 'bg-paper dark:bg-surface2 text-ldim dark:text-dim border border-lline dark:border-line'
            }`}
          >
            {d} min
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg width="256" height="256" className="-rotate-90">
          <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="10" fill="none" className="text-lline dark:text-line" />
          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            stroke="#F2B134"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
            transition={{ duration: 0.4 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-5xl font-bold text-ltext dark:text-text tabular-nums">
            {mm}:{ss}
          </span>
          <span className="font-body text-xs text-ldim dark:text-dim mt-1">
            {running ? 'stay with it' : secondsLeft === total ? 'ready when you are' : 'paused'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          aria-label="Reset"
          className="w-12 h-12 rounded-full flex items-center justify-center text-ldim dark:text-dim
                     border border-lline dark:border-line"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? 'Pause' : 'Start'}
          className="w-16 h-16 rounded-full bg-gold text-ink flex items-center justify-center shadow-card
                     active:scale-95 transition-transform"
        >
          {running ? <Pause size={26} fill="#0B0E1A" /> : <Play size={26} fill="#0B0E1A" className="ml-1" />}
        </button>
        <button
          onClick={stopEarlyAndLog}
          disabled={elapsedRef.current === 0}
          aria-label="Stop and log"
          className="w-12 h-12 rounded-full flex items-center justify-center text-coral border border-coral/40 disabled:opacity-30"
        >
          <span className="w-3.5 h-3.5 bg-coral rounded-sm" />
        </button>
      </div>

      <p className="font-body text-xs text-ldim dark:text-dim mt-8 text-center max-w-[16rem]">
        Every focused minute counts toward XP. Finish the timer or stop early to log your progress.
      </p>
    </div>
  );
}
