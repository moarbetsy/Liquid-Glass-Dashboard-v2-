import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { currency } from '@/utils/format'

export default function StatsCarousel() {
  const { data } = useApp()
  const stats = useMemo(() => {
    const totalInventory = data.products.reduce((a, p) => a + (p.pricing[0]?.price || 0) * p.stock, 0)
    const today = new Date().toDateString()
    const salesToday = data.orders.filter((o) => new Date(o.date).toDateString() === today)
      .reduce((a, o) => a + orderTotal(o), 0)
    const unpaid = data.orders.filter((o) => o.status === 'Unpaid')
      .reduce((a, o) => a + (orderTotal(o) - (o.amountPaid || 0)), 0)
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000
    const salesWeek = data.orders.filter((o) => new Date(o.date).getTime() >= weekAgo)
      .reduce((a, o) => a + orderTotal(o), 0)
    return [
      { label: 'Total Inventory Value', value: currency(totalInventory) },
      { label: 'Sales Today', value: currency(salesToday) },
      { label: 'Outstanding Debt', value: currency(unpaid) },
      { label: 'Sales This Week', value: currency(salesWeek) },
    ]
  }, [data])

  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % stats.length), 5000)
    return () => clearInterval(t)
  }, [stats.length])

  return (
    <div className="relative h-24 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="glass p-4 rounded-xl border border-white/15"
        >
          <div className="text-sm text-white/70">{stats[idx].label}</div>
          <div className="text-3xl font-semibold tracking-wide">{stats[idx].value}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function orderTotal(o: any) {
  const items = (o.items || []).reduce((a: number, i: any) => a + i.price * i.quantity, 0)
  return Math.max(0, items + (o.fees || 0) - (o.discount || 0))
}

