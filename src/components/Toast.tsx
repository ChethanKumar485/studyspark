import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
}

export default function Toast({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center px-4 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="flex items-center gap-2 bg-ink text-text px-4 py-3 rounded-xl2 shadow-card border border-line w-full"
          >
            <CheckCircle2 size={18} className="text-teal shrink-0" />
            <span className="font-body text-sm">{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
