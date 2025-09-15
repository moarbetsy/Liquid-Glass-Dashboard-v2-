import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { displayClient, currency } from '@/utils/format'
import type { Client, Order, SortDir } from '@/types'
import { ClientModal } from './modals/ClientModal'
import { List } from 'lucide-react'

type Col = 'code' | 'name' | 'orders' | 'spent' | 'balance'

export default function Clients() {
  const { data, privateMode } = useApp()
  const [sortCol, setSortCol] = useState<Col>('balance')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [edit, setEdit] = useState<Client | null>(null)
  const [openOrdersId, setOpenOrdersId] = useState<string | null>(null)

  const aggregates = useMemo(() => summarizeClients(data.orders), [data.orders])
  const rows = useMemo(() => {
    const list = data.clients.map((c) => ({
      client: c,
      orders: aggregates[c.id]?.count || 0,
      spent: aggregates[c.id]?.spent || 0,
      balance: aggregates[c.id]?.balance || 0,
    }))
    list.sort((a, b) => compare(a, b, sortCol) * (sortDir === 'asc' ? 1 : -1))
    return list
  }, [data.clients, aggregates, sortCol, sortDir])

  const totals = rows.reduce((acc, r) => ({
    orders: acc.orders + r.orders,
    spent: acc.spent + r.spent,
    balance: acc.balance + r.balance,
  }), { orders: 0, spent: 0, balance: 0 })

  function setSort(col: Col) {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <button className="btn-primary" onClick={() => setEdit({ id: '', code: '', name: '' })}>Add Client</button>
      </div>

      <div className="overflow-x-auto glass rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="text-white/70">
            <tr className="border-b border-white/10">
              <Th label="#ID" onClick={() => setSort('code')} active={sortCol==='code'} dir={sortDir} />
              <Th label="Name" onClick={() => setSort('name')} active={sortCol==='name'} dir={sortDir} />
              <Th label="Orders" onClick={() => setSort('orders')} active={sortCol==='orders'} dir={sortDir} />
              <Th label="Spent" onClick={() => setSort('spent')} active={sortCol==='spent'} dir={sortDir} />
              <Th label="Balance" onClick={() => setSort('balance')} active={sortCol==='balance'} dir={sortDir} />
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.client.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3">#{r.client.code}</td>
                <td className="px-4 py-3">{displayClient(r.client, privateMode)}</td>
                <td className="px-4 py-3">{r.orders}</td>
                <td className="px-4 py-3">{currency(r.spent)}</td>
                <td className={`px-4 py-3 ${r.balance>0 ? 'text-orange-300' : 'text-emerald-300'}`}>{currency(r.balance)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="btn-ghost mr-2" onClick={() => setOpenOrdersId(openOrdersId===r.client.id?null:r.client.id)}>
                    <List className="w-4 h-4" /> Orders
                  </button>
                  <button className="btn-ghost" onClick={() => setEdit(r.client)}>Edit</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (<tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No clients</td></tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-4 py-3 text-right text-white/70" colSpan={2}>Totals</td>
              <td className="px-4 py-3">{totals.orders}</td>
              <td className="px-4 py-3">{currency(totals.spent)}</td>
              <td className="px-4 py-3">{currency(totals.balance)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {openOrdersId && (
        <div className="glass p-4 rounded-xl">
          <h3 className="font-medium mb-2">Orders for {displayClient(data.clients.find(c=>c.id===openOrdersId)!, privateMode)}</h3>
          <ul className="space-y-2">
            {data.orders.filter(o=>o.clientId===openOrdersId).map(o => (
              <li key={o.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                <span>#{o.code} • {new Date(o.date).toLocaleDateString()}</span>
                <span className="badge">{o.status}</span>
              </li>
            ))}
            {data.orders.filter(o=>o.clientId===openOrdersId).length===0 && <div className="text-muted">No orders</div>}
          </ul>
        </div>
      )}

      <ClientModal open={!!edit} onClose={() => setEdit(null)} client={edit || undefined} />
    </div>
  )}

function summarizeClients(orders: Order[]) {
  const map: Record<string, { count: number; spent: number; balance: number }> = {}
  for (const o of orders) {
    const total = o.items.reduce((a, i) => a + i.price * i.quantity, 0) + (o.fees || 0) - (o.discount || 0)
    const bal = total - (o.amountPaid || 0)
    const m = map[o.clientId] || { count: 0, spent: 0, balance: 0 }
    m.count += 1
    m.spent += total
    m.balance += bal
    map[o.clientId] = m
  }
  return map
}

function compare(a: { client: Client; orders: number; spent: number; balance: number }, b: typeof a, col: Col) {
  switch (col) {
    case 'code': return a.client.code.localeCompare(b.client.code)
    case 'name': return a.client.name.localeCompare(b.client.name)
    case 'orders': return a.orders - b.orders
    case 'spent': return a.spent - b.spent
    case 'balance': return a.balance - b.balance
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

