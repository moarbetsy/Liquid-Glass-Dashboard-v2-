import { createContext, useContext, useMemo, useState } from 'react'
import { initialData } from '@/data/initialData'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { AppData, Client, Expense, ID, Order, Product } from '@/types'

type NavTab = 'Dashboard' | 'Orders' | 'Clients' | 'Products' | 'Reports' | 'Expenses' | 'Settings' | 'POS'

type Ctx = {
  data: AppData
  setData: (fn: (d: AppData) => AppData) => void
  privateMode: boolean
  setPrivateMode: (v: boolean) => void
  search: string
  setSearch: (q: string) => void
  tab: NavTab
  setTab: (t: NavTab) => void
  authenticated: boolean
  login: (u: string, p: string) => boolean
  logout: () => void
  // CRUD helpers
  upsertClient: (c: Partial<Client> & { id?: ID }) => Client
  upsertProduct: (p: Partial<Product> & { id?: ID }) => Product
  upsertOrder: (o: Partial<Order> & { id?: ID }) => Order
  addExpense: (e: Partial<Expense>) => Expense
  markOrderPaid: (orderId: ID) => void
  deleteAll: () => void
  exportData: () => string
  importData: (json: string) => void
}

const AppContext = createContext<Ctx>(null as any)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useLocalStorage<AppData>('lg:data', initialData)
  const [privateMode, setPrivateMode] = useLocalStorage<boolean>('lg:private', false)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useLocalStorage<NavTab>('lg:tab', 'Dashboard')
  const [authenticated, setAuthenticated] = useLocalStorage<boolean>('lg:auth', false)

  function setData(updater: (d: AppData) => AppData) {
    setDataState((prev) => updater(structuredClone(prev)))
  }

  const login = (u: string, p: string) => {
    const ok = u === 'Admin' && p === 'Admin000'
    setAuthenticated(ok)
    return ok
  }
  const logout = () => setAuthenticated(false)

  function genCode(prefix: string, n: number) {
    return `${prefix}${n}`
  }

  const upsertClient: Ctx['upsertClient'] = (c) => {
    let created: Client
    setData((d) => {
      if (!c.id) {
        const id = `c${d.clients.length + 1}`
        created = { id, code: genCode('C', d.clients.length + 1), name: c.name?.trim() || 'New Client' }
        d.clients.push(created)
      } else {
        const idx = d.clients.findIndex((x) => x.id === c.id)
        if (idx >= 0) d.clients[idx] = { ...d.clients[idx], ...c }
        created = d.clients[idx]
      }
      return d
    })
    // @ts-expect-error assigned in closure
    return created!
  }

  const upsertProduct: Ctx['upsertProduct'] = (p) => {
    let created: Product
    setData((d) => {
      if (!p.id) {
        const id = `p${d.products.length + 1}`
        created = {
          id,
          code: genCode('P', d.products.length + 1),
          name: p.name?.trim() || 'New Product',
          stock: p.stock ?? 0,
          pricing: p.pricing ?? [{ name: 'Default', price: p['price' as any] ?? 0 }],
          cost: p.cost ?? 0,
        }
        d.products.push(created)
      } else {
        const idx = d.products.findIndex((x) => x.id === p.id)
        if (idx >= 0) d.products[idx] = { ...d.products[idx], ...p }
        created = d.products[idx]
      }
      return d
    })
    // @ts-expect-error assigned in closure
    return created!
  }

  const upsertOrder: Ctx['upsertOrder'] = (o) => {
    let created: Order
    setData((d) => {
      const computeStatus = (ord: Partial<Order>) => (ord.amountPaid ?? 0) >= orderTotal(ord as Order, d) ? 'Completed' : 'Unpaid'
      if (!o.id) {
        const id = `o${d.orders.length + 1}`
        created = {
          id,
          code: genCode('O', d.orders.length + 1),
          clientId: o.clientId!,
          date: o.date || new Date().toISOString(),
          items: o.items || [],
          fees: o.fees ?? 0,
          discount: o.discount ?? 0,
          amountPaid: o.amountPaid ?? 0,
          paymentMethods: o.paymentMethods ?? [],
          status: computeStatus(o as Order),
        }
        d.orders.push(created)
      } else {
        const idx = d.orders.findIndex((x) => x.id === o.id)
        if (idx >= 0) {
          const updated = { ...d.orders[idx], ...o }
          updated.status = computeStatus(updated)
          d.orders[idx] = updated
          created = d.orders[idx]
        }
      }
      // Update lastOrderedAt for products
      for (const item of (o.items || [])) {
        const p = d.products.find((pp) => pp.id === item.productId)
        if (p) p.lastOrderedAt = new Date().toISOString()
      }
      return d
    })
    // @ts-expect-error assigned in closure
    return created!
  }

  const addExpense: Ctx['addExpense'] = (e) => {
    let created: Expense
    setData((d) => {
      const id = `e${d.expenses.length + 1}`
      created = {
        id,
        code: genCode('E', d.expenses.length + 1),
        date: e.date || new Date().toISOString(),
        category: e.category || 'General',
        description: e.description || '',
        amount: e.amount || 0,
      }
      d.expenses.push(created)
      return d
    })
    return created!
  }

  const markOrderPaid = (orderId: ID) => {
    setData((d) => {
      const ord = d.orders.find((o) => o.id === orderId)
      if (!ord) return d
      const total = orderTotal(ord, d)
      ord.amountPaid = total
      ord.status = 'Completed'
      return d
    })
  }

  const deleteAll = () => setDataState(initialData)

  const exportData = () => JSON.stringify(data, null, 2)
  const importData = (json: string) => {
    try {
      const parsed = JSON.parse(json) as AppData
      setDataState(parsed)
    } catch (e) {
      console.error('Import failed', e)
    }
  }

  const value: Ctx = useMemo(() => ({
    data, setData,
    privateMode, setPrivateMode,
    search, setSearch,
    tab, setTab,
    authenticated, login, logout,
    upsertClient, upsertProduct, upsertOrder, addExpense,
    markOrderPaid,
    deleteAll, exportData, importData,
  }), [data, privateMode, search, tab, authenticated])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}

// Helpers
function orderTotal(order: Order | Partial<Order>, data: AppData) {
  const items = (order.items || []).map((i) => i.quantity * i.price).reduce((a, b) => a + b, 0)
  const fees = order.fees || 0
  const discount = order.discount || 0
  return Math.max(0, items + fees - discount)
}

export type { NavTab }

