import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PropsWithChildren } from 'react'

type ModalProps = PropsWithChildren<{
  open: boolean
  title?: string
  onClose: () => void
  maxWidth?: string
}>

export function Modal({ open, title, onClose, children, maxWidth = '42rem' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            className="glass w-full max-w-[--mw] rounded-xl p-5"
            style={{ ['--mw' as any]: maxWidth }}
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          >
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10 mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button className="btn-ghost p-2" onClick={onClose} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

