export type ID = string

export type PricingTier = {
  name: string
  price: number
}

export type Product = {
  id: ID
  code: string
  name: string
  stock: number
  pricing: PricingTier[]
  cost?: number
  lastOrderedAt?: string
}

export type Client = {
  id: ID
  code: string
  name: string
}

export type PaymentMethod = 'Cash' | 'E-Transfer'

export type OrderItem = {
  productId: ID
  tier?: string
  quantity: number
  price: number
}

export type OrderStatus = 'Unpaid' | 'Completed'

export type Order = {
  id: ID
  code: string
  clientId: ID
  date: string
  items: OrderItem[]
  fees?: number
  discount?: number
  amountPaid?: number
  paymentMethods?: PaymentMethod[]
  status: OrderStatus
}

export type Expense = {
  id: ID
  code: string
  date: string
  category: string
  description?: string
  amount: number
}

export type AppData = {
  clients: Client[]
  products: Product[]
  orders: Order[]
  expenses: Expense[]
}

export type SortDir = 'asc' | 'desc'

