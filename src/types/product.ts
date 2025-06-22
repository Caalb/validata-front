export interface Product {
  id: string
  name: string
  brand: string
  category: string
  barcode: string
  base_price: number
  sales_frequency: number
  created_at: Date
  updated_at: Date
}

export interface ProductCreateRequest {
  name: string
  barcode: string
  brand: string
  category: string
  base_price: number
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string
}