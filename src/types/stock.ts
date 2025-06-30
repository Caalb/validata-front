import type { Product } from './product'

export interface Stock {
  id: string
  stockId?: string
  productId: string
  quantity: number
  expirationDate: Date
  sellingPrice?: number
  created_at: Date
  updated_at: Date
  product?: Product
}

export interface StockCreateRequest {
  productId: string
  quantity: number
  expiration_date: string
}

export interface StockUpdateRequest extends Partial<StockCreateRequest> {
  id: string
}
