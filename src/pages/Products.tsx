import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { Product, SortDir } from '@/types'
import { displayProduct } from '@/utils/format'
import { ProductModal } from './modals/ProductModal'
import { StockModal } from './modals/StockModal'
import { Boxes } from 'lucide-react'

type Col = 'name' | 'stock' | 'value'

export default function Products() {
  const { data, privateMode } = useApp()
  const [sortCol, setSortCol] = useState<Col>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [edit, setEdit] = useState<Product | null>(null)
  const [stockProduct, setStockProduct] = useState<Product | null>(null)

  const rows = useMemo(() => {
    const list = data.products.slice()
    // Sort only by the selected column, like other pages
    list.sort((a, b) => columnCompare(a, b, sortCol) * (sortDir === 'asc' ? 1 : -1))
    return list
  }, [data.products, sortCol, sortDir])

  function setSort(col: Col) {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="btn-primary" onClick={() => setEdit({ id: '', code: '', name: '', stock: 0, pricing: [{ name: 'Default', price: 0 }] })}>Add Product</button>
      </div>
      <div className="overflow-x-auto glass rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="text-white/70">
            <tr className="border-b border-white/10">
              <Th label="Product" onClick={() => setSort('name')} active={sortCol==='name'} dir={sortDir} />
              <Th label="Stock" onClick={() => setSort('stock')} active={sortCol==='stock'} dir={sortDir} />
              <Th label="Inventory Value" onClick={() => setSort('value')} active={sortCol==='value'} dir={sortDir} />
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3">{displayProduct(p, privateMode)} <span className="text-muted">#{p.code}</span></td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">${(p.pricing[0]?.price || 0 * p.stock).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="btn-ghost mr-2" onClick={() => setEdit(p)}>
                    Edit
                  </button>
                  <button className="btn-ghost" onClick={() => setStockProduct(p)}>Adjust Stock</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (<tr><td colSpan={4} className="px-4 py-8 text-center text-muted">No products</td></tr>)}
          </tbody>
        </table>
      </div>

      <ProductModal open={!!edit} onClose={() => setEdit(null)} product={edit || undefined} />
      <StockModal open={!!stockProduct} onClose={() => setStockProduct(null)} product={stockProduct || undefined} />
    </div>
  )
}

// Removed priority-based pre-sorting to match other pages' behavior

function columnCompare(a: Product, b: Product, col: Col) {
  switch (col) {
    case 'name': return a.name.localeCompare(b.name)
    case 'stock': return a.stock - b.stock
    case 'value': return (a.pricing[0]?.price || 0) * a.stock - (b.pricing[0]?.price || 0) * b.stock
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
