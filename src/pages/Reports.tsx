import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { currency } from '@/utils/format'

export default function Reports() {
  const { data } = useApp()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const filteredOrders = useMemo(() => {
    let list = data.orders.slice()
    if (from) list = list.filter((o) => new Date(o.date) >= new Date(from))
    if (to) list = list.filter((o) => new Date(o.date) <= new Date(to))
    return list
  }, [data.orders, from, to])

  const metrics = useMemo(() => {
    const revenue = filteredOrders.reduce((a, o) => a + orderTotal(o), 0)
    const expenses = data.expenses.reduce((a, e) => a + e.amount, 0)
    const cogs = 0 // simplified for now
    const profit = revenue - cogs
    const net = profit - expenses
    return { revenue, profit, expenses, net }
  }, [filteredOrders, data.expenses])

  const topClients = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of filteredOrders) map[o.clientId] = (map[o.clientId] || 0) + orderTotal(o)
    return Object.entries(map).map(([clientId, total]) => ({ name: clientId, total }))
  }, [filteredOrders])

  const topProducts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of filteredOrders) for (const i of o.items) map[i.productId] = (map[i.productId] || 0) + i.quantity * i.price
    return Object.entries(map).map(([productId, total]) => ({ name: productId, total }))
  }, [filteredOrders])

  const expensesByCat = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of data.expenses) map[e.category] = (map[e.category] || 0) + e.amount
    return Object.entries(map).map(([cat, total]) => ({ name: cat, total }))
  }, [data.expenses])

  const monthly = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of filteredOrders) {
      const key = new Date(o.date).toISOString().slice(0, 7) // YYYY-MM
      map[key] = (map[key] || 0) + orderTotal(o)
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => ({ month, total }))
  }, [filteredOrders])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <span className="label">From</span>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <span className="label">To</span>
          <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Total Revenue" value={currency(metrics.revenue)} />
        <Metric title="Total Profit" value={currency(metrics.profit)} />
        <Metric title="Total Expenses" value={currency(metrics.expenses)} />
        <Metric title="Net Income" value={currency(metrics.net)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Top Clients by Sales">
          <Chart data={topClients} />
        </Card>
        <Card title="Top Products by Sales">
          <Chart data={topProducts} />
        </Card>
        <Card title="Expenses by Category">
          <Chart data={expensesByCat} layout="vertical" />
        </Card>
        <Card title="Monthly Sales">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={monthly} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.9)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }} />
                <Line type="monotone" dataKey="total" stroke="#6ea8ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

function orderTotal(o: any) {
  const items = (o.items || []).reduce((a: number, i: any) => a + i.price * i.quantity, 0)
  return Math.max(0, items + (o.fees || 0) - (o.discount || 0))
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-white/70">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="mb-2 font-medium">{title}</div>
      {children}
    </div>
  )
}

function Chart({ data, layout = 'horizontal' as 'horizontal' | 'vertical' }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <BarChart data={data} layout={layout as any} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          {layout === 'horizontal' ? <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" /> : <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.7)" width={80} />}
          {layout === 'horizontal' ? <YAxis stroke="rgba(255,255,255,0.7)" /> : <XAxis type="number" stroke="rgba(255,255,255,0.7)" />}
          <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.9)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }} />
          <Bar dataKey="total" fill="#6ea8ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

