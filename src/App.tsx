import { useEffect, useState } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import TrailScreen from './components/TrailScreen';
import FocusScreen from './components/FocusScreen';
import CardsScreen from './components/CardsScreen';
import ProgressScreen from './components/ProgressScreen';
import Toast, { type ToastMessage } from './components/Toast';
import { useStore } from './lib/store';

export type Screen = 'trail' | 'focus' | 'cards' | 'progress';

export default function App() {
  const { getQuest } = useStore();
  const [screen, setScreen] = useState<Screen>('trail');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [nudgeShown, setNudgeShown] = useState(false);

  function pushToast(text: string) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  // Evening nudge: if it's past 7pm local time and there's an outstanding quest, nudge once per session.
  useEffect(() => {
    if (nudgeShown) return;
    const hour = new Date().getHours();
    if (hour >= 19) {
      const quest = getQuest();
      if (quest) {
        pushToast(`Evening check-in: ${quest.subjectName} is still waiting for you today.`);
        setNudgeShown(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-ink text-ltext dark:text-text transition-colors">
      <TopBar />
      <Toast toasts={toasts} />
      <main className="flex-1">
        {screen === 'trail' && <TrailScreen pushToast={pushToast} />}
        {screen === 'focus' && <FocusScreen pushToast={pushToast} />}
        {screen === 'cards' && <CardsScreen pushToast={pushToast} />}
        {screen === 'progress' && <ProgressScreen pushToast={pushToast} />}
      </main>
      <BottomNav active={screen} onChange={setScreen} />
    </div>
  );
}
