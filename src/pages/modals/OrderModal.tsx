import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/Modal.tsx'
import { useApp } from '@/context/AppContext'
import type { Order, OrderItem, PaymentMethod, Product } from '@/types'
import { currency } from '@/utils/format'

export function OrderModal({ open, onClose, order }: { open: boolean; onClose: () => void; order?: Order }) {
  const { data, upsertOrder } = useApp()
  const [clientId, setClientId] = useState('')
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [items, setItems] = useState<OrderItem[]>([])
  const [fees, setFees] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [amountPaid, setAmountPaid] = useState(0)
  const [methods, setMethods] = useState<PaymentMethod[]>([])

  useEffect(() => {
    if (order) {
      setClientId(order.clientId)
      setDate(order.date.slice(0, 10))
      setItems(order.items)
      setFees(order.fees || 0)
      setDiscount(order.discount || 0)
      setAmountPaid(order.amountPaid || 0)
      setMethods(order.paymentMethods || [])
    } else {
      setClientId('')
      setDate(new Date().toISOString().slice(0, 10))
      setItems([])
      setFees(0)
      setDiscount(0)
      setAmountPaid(0)
      setMethods([])
    }
  }, [order, open])

  const subtotal = useMemo(() => items.reduce((a, i) => a + i.quantity * i.price, 0), [items])
  const total = useMemo(() => Math.max(0, subtotal + fees - discount), [subtotal, fees, discount])
  const balance = useMemo(() => Math.max(0, total - amountPaid), [total, amountPaid])
  const invalid = useMemo(() => items.some((it) => (data.products.find(p=>p.id===it.productId)?.stock || 0) < it.quantity), [items, data.products])

  function addItem(p: Product) {
    const price = p.pricing[0]?.price || 0
    setItems((arr) => [...arr, { productId: p.id, tier: p.pricing[0]?.name, quantity: 1, price }])
  }
  function updateItem(i: number, part: Partial<OrderItem>) {
    setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, ...part } : it))
  }
  function removeItem(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i))
  }

  function toggleMethod(m: PaymentMethod) {
    setMethods((arr) => arr.includes(m) ? arr.filter(x => x !== m) : [...arr, m])
  }

  function save() {
    if (!clientId) return
    upsertOrder({ id: order?.id, clientId, date: new Date(date).toISOString(), items, fees, discount, amountPaid, paymentMethods: methods })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={order ? 'Edit Order' : 'New Order'} maxWidth="56rem">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className={`glass p-3 rounded-xl ${!clientId ? 'ring-2 ring-accent/40' : ''}`}>
            <label className="label">Client</label>
            <select className="select" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Select client…</option>
              {data.clients.map((c) => <option key={c.id} value={c.id}>{c.name} #{c.code}</option>)}
            </select>
          </div>
          <div className="glass p-3 rounded-xl">
            <label className="label">Order Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className={`glass p-3 rounded-xl ${clientId && items.length===0 ? 'ring-2 ring-accent/40' : ''}`}>
            <label className="label">Add Item</label>
            <select className="select" onChange={(e) => { const p = data.products.find(p => p.id === e.target.value); if (p) addItem(p) }}>
              <option value="">Select product…</option>
              {data.products.map((p) => <option key={p.id} value={p.id}>{p.name} • Stock {p.stock}</option>)}
            </select>
          </div>
        </div>

        <div className="glass p-3 rounded-xl">
          <div className="grid gap-2 md:grid-cols-12 text-xs text-white/70 mb-2">
            <div className="md:col-span-4">Product</div>
            <div className="md:col-span-2">Tier</div>
            <div className="md:col-span-2">Qty</div>
            <div className="md:col-span-2">Price</div>
            <div className="md:col-span-2 text-right">Line Total</div>
          </div>
          {items.map((it, i) => {
            const p = data.products.find((pp) => pp.id === it.productId)!
            const tiers = p.pricing
            const line = it.quantity * it.price
            const invalidQty = it.quantity > p.stock
            return (
              <div key={i} className={`grid gap-2 md:grid-cols-12 items-center p-2 rounded-lg ${invalidQty ? 'bg-orange-500/10' : 'bg-white/5'}`}>
                <div className="md:col-span-4 font-medium">{p.name} <span className="text-muted">#{p.code}</span></div>
                <div className="md:col-span-2 flex flex-wrap gap-2">
                  {tiers.map((t) => (
                    <button key={t.name} className={`badge ${it.tier===t.name ? 'bg-accent/30 border-accent/60' : ''}`} onClick={() => updateItem(i, { tier: t.name, price: t.price })}>{t.name}</button>
                  ))}
                </div>
                <div className="md:col-span-2">
                  <input type="number" className="input" value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} />
                </div>
                <div className="md:col-span-2">
                  <input type="number" className="input" value={it.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) })} />
                </div>
                <div className="md:col-span-2 text-right font-medium">{currency(line)}</div>
                <div className="md:col-span-12 text-right">
                  <button className="btn-ghost" onClick={() => removeItem(i)}>Remove</button>
                </div>
              </div>
            )
          })}
          {items.length === 0 && <div className="text-center text-muted py-6">No items yet. Select a product to add.</div>}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="glass p-3 rounded-xl space-y-2">
            <div>
              <label className="label">Amount Paid</label>
              <input type="number" className="input" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} />
            </div>
            <div className="flex gap-3">
              <label className={`badge cursor-pointer ${methods.includes('Cash') ? 'bg-accent/30 border-accent/60' : ''}`}>
                <input type="checkbox" className="hidden" checked={methods.includes('Cash')} onChange={() => toggleMethod('Cash')} /> Cash
              </label>
              <label className={`badge cursor-pointer ${methods.includes('E-Transfer') ? 'bg-accent/30 border-accent/60' : ''}`}>
                <input type="checkbox" className="hidden" checked={methods.includes('E-Transfer')} onChange={() => toggleMethod('E-Transfer')} /> E-transfer
              </label>
            </div>
          </div>
          <div className="glass p-3 rounded-xl">
            <label className="label">Fees</label>
            <input type="number" className="input" value={fees} onChange={(e) => setFees(Number(e.target.value))} />
          </div>
          <div className="glass p-3 rounded-xl">
            <label className="label">Discount</label>
            <input type="number" className="input" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
        </div>

        <div className="glass p-4 rounded-xl grid gap-2 md:grid-cols-4">
          <Summary label="Subtotal" value={currency(subtotal)} />
          <Summary label="Total" value={currency(total)} />
          <Summary label="Paid" value={currency(amountPaid)} />
          <Summary label="Balance Due" value={currency(balance)} />
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={!clientId || items.length===0 || invalid}>Save Order</button>
        </div>
      </div>
    </Modal>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="text-white/70 text-sm">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}
