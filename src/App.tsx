import { useMemo, useState } from 'react'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import { AppProvider, useApp } from '@/context/AppContext'
import Dashboard from '@/pages/Dashboard'
import Orders from '@/pages/Orders'
import Clients from '@/pages/Clients'
import Products from '@/pages/Products'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import Expenses from '@/pages/Expenses'
import POS from '@/pages/POS'
import Login from '@/pages/Login'
import { OrderModal } from '@/pages/modals/OrderModal'

function Shell() {
  const { tab, setTab, authenticated } = useApp()
  const [orderOpen, setOrderOpen] = useState(false)

  const page = useMemo(() => {
    switch (tab) {
      case 'Dashboard': return <Dashboard onNewOrder={() => setOrderOpen(true)} />
      case 'Orders': return <Orders onNew={() => setOrderOpen(true)} />
      case 'Clients': return <Clients />
      case 'Products': return <Products />
      case 'Reports': return <Reports />
      case 'Expenses': return <Expenses />
      case 'Settings': return <Settings />
      case 'POS': return <POS />
    }
  }, [tab])

  if (!authenticated) return <Login />

  return (
    <div className="min-h-screen pb-24">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {page}
      </main>
      <MobileNav onFab={() => setOrderOpen(true)} />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
