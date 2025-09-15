import { useState } from 'react'
import { Modal } from '@/components/Modal.tsx'
import { useApp } from '@/context/AppContext'

export function ExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addExpense } = useApp()
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10))
  const [category, setCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState<number>(0)

  function save() {
    addExpense({ date: new Date(date).toISOString(), category, description, amount })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Expense">
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Amount</label>
            <input type="number" className="input" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </Modal>
  )
}
