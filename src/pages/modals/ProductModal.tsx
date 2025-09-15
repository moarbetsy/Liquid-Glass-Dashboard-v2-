import { useEffect, useState } from 'react'
import { Modal } from '@/components/Modal.tsx'
import { useApp } from '@/context/AppContext'
import type { Product, PricingTier } from '@/types'

export function ProductModal({ open, onClose, product }: { open: boolean; onClose: () => void; product?: Product }) {
  const { upsertProduct } = useApp()
  const [name, setName] = useState('')
  const [stock, setStock] = useState(0)
  const [cost, setCost] = useState(0)
  const [pricing, setPricing] = useState<PricingTier[]>([{ name: 'Default', price: 0 }])

  useEffect(() => {
    setName(product?.name || '')
    setStock(product?.stock || 0)
    setCost(product?.cost || 0)
    setPricing(product?.pricing || [{ name: 'Default', price: 0 }])
  }, [product])

  function addTier() {
    setPricing((p) => [...p, { name: `Tier ${p.length + 1}`, price: 0 }])
  }
  function updateTier(i: number, field: 'name' | 'price', value: string) {
    setPricing((p) => p.map((t, idx) => idx === i ? { ...t, [field]: field==='price' ? Number(value) : value } : t))
  }

  function save() {
    upsertProduct({ id: product?.id, name, stock, cost, pricing })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={product?.id ? 'Edit Product' : 'New Product'}>
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Stock</label>
            <input className="input" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Cost</label>
            <input className="input" type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label">Pricing Tiers</label>
            <button className="btn-ghost" onClick={addTier}>Add Tier</button>
          </div>
          <div className="space-y-2">
            {pricing.map((t, i) => (
              <div key={i} className="grid gap-2 md:grid-cols-2">
                <input className="input" value={t.name} onChange={(e) => updateTier(i, 'name', e.target.value)} />
                <input className="input" type="number" value={t.price} onChange={(e) => updateTier(i, 'price', e.target.value)} />
              </div>
            ))}
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
