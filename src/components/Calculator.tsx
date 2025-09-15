import { useMemo, useState } from 'react'
import { Modal } from './Modal.tsx'

export function Calculator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expr, setExpr] = useState('')
  const result = useMemo(() => {
    try {
      // Simple, safe eval: only digits, operators, parentheses, dot
      if (!expr.trim()) return ''
      if (!/^[-+*/().,\d\s%]+$/.test(expr)) return 'Invalid'
      // eslint-disable-next-line no-new-func
      const val = Function(`return (${expr.replace(/,/g, '')})`)()
      if (typeof val === 'number' && Number.isFinite(val)) return val.toString()
      return 'Invalid'
    } catch {
      return 'Invalid'
    }
  }, [expr])

  return (
    <Modal open={open} onClose={onClose} title="Calculator" maxWidth="28rem">
      <div className="space-y-3">
        <input className="input text-right text-xl" placeholder="e.g. 12*1.13 + 5" value={expr} onChange={(e) => setExpr(e.target.value)} />
        <div className="glass p-3 text-right text-2xl font-semibold">{result || 'Result'}</div>
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setExpr('')}>Clear</button>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  )
}
