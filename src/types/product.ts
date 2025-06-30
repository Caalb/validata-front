import type { Stock } from './stock'

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  barcode: string
  cost_price: number
  base_price: number
  sales_frequency: number
  created_at: Date
  updated_at: Date
}

export interface ProductWithStock {
  productId: string
  productName: string
  brand: string
  category: string
  basePrice: number
  basePriceInBRL: number
  costPrice: number
  costPriceInBRL: number
  availableStocks: Stock[]
  hasDiscounts: boolean
  lowestPrice: number
  lowestPriceInBRL: number
}

export interface ProductCreateRequest {
  name: string
  barcode: string
  brand: string
  category: string
  cost_price: number
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string
}
