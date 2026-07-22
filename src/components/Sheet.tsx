import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Sheet({ open, onClose, title, children }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 right-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto
                       bg-lsurface dark:bg-surface rounded-t-xl2 border-t border-lline dark:border-line
                       shadow-card"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-inherit flex items-center justify-between px-5 py-4 border-b border-lline dark:border-line">
              <h2 className="font-display font-bold text-lg text-ltext dark:text-text">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-full hover:bg-surface2/20 transition-colors"
              >
                <X size={20} className="text-ldim dark:text-dim" />
              </button>
            </div>
            <div className="px-5 py-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
