import type { Product } from './product'

export interface ExpiringStockProduct {
  id: string
  barcode: string
  name: string
  brand: string
  category: string
  cost_price: number
  base_price: number
  sales_frequency: number
  created_at: string
  updated_at: string
  min_stock_level: number | null
}

export interface ExpiringStockItem {
  id: string
  product_id: string
  product: ExpiringStockProduct
  quantity: number
  expiration_date: string
  created_at: string
  updated_at: string
}

export interface ExpiringProduct {
  stock: ExpiringStockItem
  daysUntilExpiration: number
  isExpired: boolean
  isExpiringSoon: boolean
}

export interface WeeklyExpirationData {
  productsExpiringThisWeek: ExpiringProduct[]
  totalQuantityExpiring: number
  expirationByDate: Map<string, { products: ExpiringProduct[]; totalQuantity: number }>
  urgentProducts: ExpiringProduct[]
  weekRange: { start: Date; end: Date }
}

export interface WeekOption {
  label: string
  value: string
  start: Date
  end: Date
}
