import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { CheckCircle2, Filter, PencilLine } from 'lucide-react'
import { currency, displayClient } from '@/utils/format'
import type { Order, SortDir } from '@/types'
import { OrderModal } from './modals/OrderModal'

type Col = 'code' | 'client' | 'total' | 'balance' | 'status' | 'date'

export default function Orders({ onNew }: { onNew: () => void }) {
  const { data, privateMode, markOrderPaid } = useApp()
  const [sortCol, setSortCol] = useState<Col>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [status, setStatus] = useState<'All' | 'Unpaid' | 'Completed'>('All')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [edit, setEdit] = useState<Order | null>(null)

  const rows = useMemo(() => {
    let list = data.orders.slice()
    if (status !== 'All') list = list.filter((o) => o.status === status)
    if (from) list = list.filter((o) => new Date(o.date) >= new Date(from))
    if (to) list = list.filter((o) => new Date(o.date) <= new Date(to))
    list.sort((a, b) => compareOrders(a, b, sortCol) * (sortDir === 'asc' ? 1 : -1))
    return list
  }, [data.orders, status, from, to, sortCol, sortDir])

  function setSort(col: Col) {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex items-center gap-2">
          <button className="btn-ghost"><Filter className="w-4 h-4" /> Filters</button>
          <button className="btn-primary" onClick={onNew}>New Order</button>
        </div>
      </div>

      <div className="glass p-3 rounded-xl flex flex-wrap items-center gap-3">
        <select className="select w-40" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option>All</option>
          <option>Unpaid</option>
          <option>Completed</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="label">From</label>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <label className="label">To</label>
          <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto glass rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="text-white/70">
            <tr className="border-b border-white/10">
              <Th label="Order ID" onClick={() => setSort('code')} active={sortCol==='code'} dir={sortDir} />
              <Th label="Client" onClick={() => setSort('client')} active={sortCol==='client'} dir={sortDir} />
              <Th label="Total" onClick={() => setSort('total')} active={sortCol==='total'} dir={sortDir} />
              <Th label="Balance" onClick={() => setSort('balance')} active={sortCol==='balance'} dir={sortDir} />
              <Th label="Status" onClick={() => setSort('status')} active={sortCol==='status'} dir={sortDir} />
              <Th label="Date" onClick={() => setSort('date')} active={sortCol==='date'} dir={sortDir} />
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => {
              const client = data.clients.find((c) => c.id === o.clientId)!
              const total = orderTotal(o)
              const balance = total - (o.amountPaid || 0)
              return (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setEdit(o)}>
                  <td className="px-4 py-3">#{o.code}</td>
                  <td className="px-4 py-3">{displayClient(client, privateMode)}</td>
                  <td className="px-4 py-3">{currency(total)}</td>
                  <td className="px-4 py-3">{currency(balance)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${o.status==='Unpaid' ? 'bg-orange-500/15 text-orange-200 border-orange-500/30' : 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3">{new Date(o.date).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {o.status==='Unpaid' ? (
                      <button className="btn-ghost" onClick={() => markOrderPaid(o.id)}>
                        <CheckCircle2 className="w-4 h-4" /> Mark Paid
                      </button>
                    ) : (
                      <button className="btn-ghost" onClick={() => setEdit(o)}>
                        <PencilLine className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted">No orders</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderModal open={!!edit} onClose={() => setEdit(null)} order={edit || undefined} />
    </div>
  )
}

function orderTotal(o: Order) {
  const items = o.items.reduce((a, i) => a + i.price * i.quantity, 0)
  return Math.max(0, items + (o.fees || 0) - (o.discount || 0))
}

function compareOrders(a: Order, b: Order, col: Col) {
  switch (col) {
    case 'code': return a.code.localeCompare(b.code)
    case 'client': return a.clientId.localeCompare(b.clientId)
    case 'total': return orderTotal(a) - orderTotal(b)
    case 'balance': return (orderTotal(a) - (a.amountPaid || 0)) - (orderTotal(b) - (b.amountPaid || 0))
    case 'status': return a.status.localeCompare(b.status)
    case 'date': return new Date(a.date).getTime() - new Date(b.date).getTime()
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

