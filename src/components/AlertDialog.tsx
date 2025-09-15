import { Modal } from './Modal.tsx'

export function AlertDialog({ open, title = 'Alert', message, onClose }: {
  open: boolean
  title?: string
  message: string
  onClose: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="28rem">
      <div className="space-y-4">
        <p className="text-white/80">{message}</p>
        <div className="flex justify-end">
          <button className="btn-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </Modal>
  )
}
