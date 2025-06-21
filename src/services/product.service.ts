import type { Product, ProductCreateRequest, ProductUpdateRequest, BarcodeVerificationResponse } from '@/types/product'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Leite Integral',
    brand: 'Nestlé',
    quantity: 5,
    expirationDate: '2025-07-15',
    barcodeCode: '7891000100127',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Açúcar Cristal',
    brand: 'União',
    quantity: 3,
    expirationDate: '2025-12-31',
    barcodeCode: '7891910000016',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    name: 'Biscoito Cream Cracker',
    brand: 'Marilan',
    quantity: 8,
    expirationDate: '2025-08-20',
    barcodeCode: '7896003701326',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    name: 'Arroz Branco Tipo 1',
    brand: 'Tio João',
    quantity: 2,
    expirationDate: '2025-11-10',
    barcodeCode: '7891164000014',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '5',
    name: 'Feijão Preto',
    brand: 'Camil',
    quantity: 6,
    expirationDate: '2025-09-05',
    barcodeCode: '7896006707011',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-19T11:20:00Z',
    updatedAt: '2024-01-19T11:20:00Z'
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getProducts(page: number = 1, limit: number = 10): Promise<{ products: Product[], total: number }> {
    await delay(500)
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = mockProducts.slice(startIndex, endIndex)
    
    return {
      products: paginatedProducts,
      total: mockProducts.length
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(300)
    
    const product = mockProducts.find(p => p.id === id)
    return product || null
  },

  async verifyBarcode(barcodeCode: string): Promise<BarcodeVerificationResponse> {
    await delay(800)
    
    const existingProduct = mockProducts.find(p => p.barcodeCode === barcodeCode)
    
    if (existingProduct) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { expirationDate, quantity, ...productWithoutExpiration } = existingProduct
      return {
        exists: true,
        product: productWithoutExpiration
      }
    }
    
    return { exists: false }
  },

  async createProduct(productData: ProductCreateRequest): Promise<Product> {
    await delay(600)
    
    const newProduct: Product = {
      id: (mockProducts.length + 1).toString(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockProducts.push(newProduct)
    return newProduct
  },

  async updateProduct(productData: ProductUpdateRequest): Promise<Product> {
    await delay(500)
    
    const index = mockProducts.findIndex(p => p.id === productData.id)
    if (index === -1) {
      throw new Error('Produto não encontrado')
    }
    
    const updatedProduct: Product = {
      ...mockProducts[index],
      ...productData,
      updatedAt: new Date().toISOString()
    }
    
    mockProducts[index] = updatedProduct
    return updatedProduct
  }
}