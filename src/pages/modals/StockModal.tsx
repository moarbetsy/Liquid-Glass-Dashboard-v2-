import { useEffect, useState } from 'react'
import { Modal } from '@/components/Modal.tsx'
import { useApp } from '@/context/AppContext'
import type { Product } from '@/types'

export function StockModal({ open, onClose, product }: { open: boolean; onClose: () => void; product?: Product }) {
  const { upsertProduct, addExpense } = useApp()
  const [delta, setDelta] = useState(0)
  const [cost, setCost] = useState(0)
  const [createExpense, setCreateExpense] = useState(true)

  useEffect(() => { setDelta(0); setCost(0) }, [product, open])

  function save() {
    if (!product) return
    const newStock = Math.max(0, (product.stock || 0) + delta)
    upsertProduct({ id: product.id, stock: newStock })
    if (createExpense && delta > 0 && cost > 0) {
      addExpense({ category: 'Inventory', description: `Stock for ${product.name}`, amount: cost })
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Adjust Stock" maxWidth="32rem">
      <div className="space-y-3">
        <div>
          <div className="label">Change Quantity (use negative to remove)</div>
          <input type="number" className="input" value={delta} onChange={(e) => setDelta(Number(e.target.value))} />
        </div>
        <div>
          <div className="label">Purchase Cost (optional)</div>
          <input type="number" className="input" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={createExpense} onChange={(e) => setCreateExpense(e.target.checked)} />
          Create expense entry
        </label>
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </Modal>
  )
}
