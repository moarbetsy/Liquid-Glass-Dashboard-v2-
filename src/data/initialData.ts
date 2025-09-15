import type { AppData } from '@/types'

export const initialData: AppData = {
  clients: [
    { id: 'c1', code: 'C1', name: 'Acme Corp' },
    { id: 'c2', code: 'C2', name: 'Blue Horizon' },
    { id: 'c3', code: 'C3', name: 'Nimbus Labs' },
  ],
  products: [
    {
      id: 'p1', code: 'P1', name: 'Liquid Glass 500ml', stock: 42,
      pricing: [
        { name: 'Retail', price: 19.99 },
        { name: 'Wholesale', price: 14.5 },
      ],
      cost: 8.0,
    },
    {
      id: 'p2', code: 'P2', name: 'Liquid Glass 1L', stock: 18,
      pricing: [
        { name: 'Retail', price: 34.99 },
        { name: 'Wholesale', price: 26.0 },
      ],
      cost: 15.0,
    },
    {
      id: 'p3', code: 'P3', name: 'Applicator Kit', stock: 60,
      pricing: [
        { name: 'Standard', price: 9.99 },
      ],
      cost: 3.0,
    },
  ],
  orders: [],
  expenses: [
    { id: 'e1', code: 'E1', date: new Date().toISOString(), category: 'Supplies', description: 'Packaging', amount: 120.50 },
  ],
}

