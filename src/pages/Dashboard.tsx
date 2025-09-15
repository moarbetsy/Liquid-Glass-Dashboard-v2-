import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { displayClient, displayProduct } from '@/utils/format'
import StatsCarousel from '@/components/StatsCarousel'

export default function Dashboard({ onNewOrder }: { onNewOrder: () => void }) {
  const { data, search, privateMode, setTab } = useApp()

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return null
    const clients = data.clients.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    const products = data.products.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    const orders = data.orders.filter((o) => {
      const c = data.clients.find((x) => x.id === o.clientId)
      return o.code.toLowerCase().includes(q) || (c?.name.toLowerCase() || '').includes(q)
    })
    return { clients, products, orders }
  }, [data, search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-muted">Here’s what’s happening today</p>
        </div>
        <button className="btn-primary" onClick={onNewOrder}>New Order</button>
      </div>

      <StatsCarousel />

      {results && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass p-4 rounded-xl">
            <h3 className="font-medium mb-2">Clients</h3>
            <div className="space-y-1">
              {results.clients.map((c) => (
                <button key={c.id} className="block w-full text-left p-2 rounded-lg hover:bg-white/5" onClick={() => setTab('Clients')}>
                  {displayClient(c, privateMode)} <span className="text-muted">#{c.code}</span>
                </button>
              ))}
              {results.clients.length === 0 && <div className="text-muted">No clients found</div>}
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <h3 className="font-medium mb-2">Orders</h3>
            <div className="space-y-1">
              {results.orders.map((o) => (
                <div key={o.id} className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                  <span>#{o.code}</span>
                  <span className="badge text-xs border-white/10">{o.status}</span>
                </div>
              ))}
              {results.orders.length === 0 && <div className="text-muted">No orders found</div>}
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <h3 className="font-medium mb-2">Products</h3>
            <div className="space-y-1">
              {results.products.map((p) => (
                <button key={p.id} className="block w-full text-left p-2 rounded-lg hover:bg-white/5" onClick={() => setTab('Products')}>
                  {displayProduct(p, privateMode)} <span className="text-muted">#{p.code}</span>
                </button>
              ))}
              {results.products.length === 0 && <div className="text-muted">No products found</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

