export interface Product {
  id: string
  name: string
  brand: string
  quantity: number
  expirationDate: string
  barcodeCode: string
  barcodeFormat: string
  createdAt?: string
  updatedAt?: string
}

export interface ProductCreateRequest {
  barcodeCode: string
  barcodeFormat: string
  name: string
  brand: string
  quantity: number
  expirationDate: string
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string
}

export interface BarcodeVerificationResponse {
  exists: boolean
  product?: Omit<Product, 'expirationDate' | 'quantity'>
}