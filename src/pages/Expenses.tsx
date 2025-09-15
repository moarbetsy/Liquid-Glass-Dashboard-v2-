import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { currency } from '@/utils/format'
import { ExpenseModal } from './modals/ExpenseModal'
import type { Expense, SortDir } from '@/types'

type Col = 'code' | 'date' | 'category' | 'description' | 'amount'

export default function Expenses() {
  const { data } = useApp()
  const [open, setOpen] = useState(false)
  const [sortCol, setSortCol] = useState<Col>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const rows = useMemo(() => {
    const list = data.expenses.slice()
    list.sort((a, b) => compare(a, b, sortCol) * (sortDir === 'asc' ? 1 : -1))
    return list
  }, [data.expenses, sortCol, sortDir])

  const total = useMemo(() => rows.reduce((a, e) => a + e.amount, 0), [rows])

  function setSort(col: Col) {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>Add Expense</button>
      </div>
      <div className="glass rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-white/70">
            <tr className="border-b border-white/10">
              <Th label="#ID" onClick={() => setSort('code')} active={sortCol==='code'} dir={sortDir} />
              <Th label="Date" onClick={() => setSort('date')} active={sortCol==='date'} dir={sortDir} />
              <Th label="Category" onClick={() => setSort('category')} active={sortCol==='category'} dir={sortDir} />
              <Th label="Description" onClick={() => setSort('description')} active={sortCol==='description'} dir={sortDir} />
              <Th label="Amount" onClick={() => setSort('amount')} active={sortCol==='amount'} dir={sortDir} />
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-white/5">
                <td className="px-4 py-3">#{e.code}</td>
                <td className="px-4 py-3">{new Date(e.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{e.category}</td>
                <td className="px-4 py-3">{e.description}</td>
                <td className="px-4 py-3">{currency(e.amount)}</td>
              </tr>
            ))}
            {rows.length === 0 && (<tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No expenses</td></tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-4 py-3 text-right text-white/70" colSpan={4}>Total</td>
              <td className="px-4 py-3">{currency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <ExpenseModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function compare(a: Expense, b: Expense, col: Col) {
  switch (col) {
    case 'code': return a.code.localeCompare(b.code)
    case 'date': return new Date(a.date).getTime() - new Date(b.date).getTime()
    case 'category': return (a.category || '').localeCompare(b.category || '')
    case 'description': return (a.description || '').localeCompare(b.description || '')
    case 'amount': return a.amount - b.amount
  }
}

function Th({ label, onClick, active, dir }: { label: string; onClick: () => void; active: boolean; dir: SortDir }) {
  return (
    <th className="px-4 py-3 text-left select-none">
      <button className={`inline-flex items-center gap-1 ${active ? 'text-white' : 'text-white/70'}`} onClick={onClick}>
        {label}
        <span className="text-xs opacity-80">{active ? (dir === 'asc' ? '▲' : '▼') : ''}</span>
      </button>
    </th>
  )
}
