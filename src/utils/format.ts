import type { Client, Product } from '@/types'

export const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })

export function currency(v: number) {
  return fmt.format(v)
}

export function displayClient(client: Client, privateMode: boolean) {
  return privateMode ? `#${client.code}` : client.name
}

export function displayProduct(product: Product, privateMode: boolean) {
  return privateMode ? `#${product.code}` : product.name
}

