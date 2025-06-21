import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  BarcodeVerificationResponse,
} from '@/types/product'

// Helper function to get dates relative to today
const getDateString = (daysFromToday: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split('T')[0]
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Iogurte Natural',
    brand: 'Danone',
    quantity: 6,
    expirationDate: getDateString(0), // Vence hoje
    barcodeCode: '7891000100127',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Pão de Forma',
    brand: 'Wickbold',
    quantity: 3,
    expirationDate: getDateString(1), // Vence amanhã
    barcodeCode: '7891910000016',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    name: 'Queijo Mussarela',
    brand: 'Tirolez',
    quantity: 2,
    expirationDate: getDateString(2), // Vence em 2 dias
    barcodeCode: '7896003701326',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    name: 'Presunto Fatiado',
    brand: 'Sadia',
    quantity: 4,
    expirationDate: getDateString(3), // Vence em 3 dias
    barcodeCode: '7891164000014',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '5',
    name: 'Leite Integral',
    brand: 'Nestlé',
    quantity: 8,
    expirationDate: getDateString(4), // Vence em 4 dias
    barcodeCode: '7896058251234',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-19T11:20:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
  },
  {
    id: '6',
    name: 'Margarina',
    brand: 'Qualy',
    quantity: 5,
    expirationDate: getDateString(5), // Vence em 5 dias
    barcodeCode: '7891234567890',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-01-20T08:30:00Z',
  },
  {
    id: '7',
    name: 'Requeijão',
    brand: 'Catupiry',
    quantity: 3,
    expirationDate: getDateString(6), // Vence em 6 dias
    barcodeCode: '7891987654321',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-21T15:45:00Z',
    updatedAt: '2024-01-21T15:45:00Z',
  },
  {
    id: '8',
    name: 'Açúcar Cristal',
    brand: 'União',
    quantity: 10,
    expirationDate: getDateString(30), // Vence em 30 dias
    barcodeCode: '7891910000099',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-22T12:00:00Z',
    updatedAt: '2024-01-22T12:00:00Z',
  },
  {
    id: '9',
    name: 'Arroz Branco',
    brand: 'Tio João',
    quantity: 15,
    expirationDate: getDateString(60), // Vence em 60 dias
    barcodeCode: '7891164000099',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-23T10:30:00Z',
    updatedAt: '2024-01-23T10:30:00Z',
  },
  {
    id: '10',
    name: 'Feijão Preto',
    brand: 'Camil',
    quantity: 12,
    expirationDate: getDateString(90), // Vence em 90 dias
    barcodeCode: '7896058251999',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-24T14:15:00Z',
    updatedAt: '2024-01-24T14:15:00Z',
  },
  // Produtos para próxima semana
  {
    id: '11',
    name: 'Cream Cheese',
    brand: 'Philadelphia',
    quantity: 4,
    expirationDate: getDateString(8), // Próxima semana
    barcodeCode: '7891234567811',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z',
  },
  {
    id: '12',
    name: 'Salsicha Viena',
    brand: 'Perdigão',
    quantity: 6,
    expirationDate: getDateString(10), // Próxima semana
    barcodeCode: '7891234567812',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-26T11:30:00Z',
    updatedAt: '2024-01-26T11:30:00Z',
  },
  {
    id: '13',
    name: 'Bacon Fatiado',
    brand: 'Seara',
    quantity: 3,
    expirationDate: getDateString(12), // Próxima semana
    barcodeCode: '7891234567813',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-27T14:00:00Z',
    updatedAt: '2024-01-27T14:00:00Z',
  },
  // Produtos para semana seguinte
  {
    id: '14',
    name: 'Mortadela',
    brand: 'Sadia',
    quantity: 2,
    expirationDate: getDateString(15), // Duas semanas
    barcodeCode: '7891234567814',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-28T16:30:00Z',
    updatedAt: '2024-01-28T16:30:00Z',
  },
  {
    id: '15',
    name: 'Linguiça Calabresa',
    brand: 'Perdigão',
    quantity: 5,
    expirationDate: getDateString(18), // Duas semanas
    barcodeCode: '7891234567815',
    barcodeFormat: 'EAN_13',
    createdAt: '2024-01-29T10:45:00Z',
    updatedAt: '2024-01-29T10:45:00Z',
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const productService = {
  async getProducts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ products: Product[]; total: number }> {
    await delay(500)

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = mockProducts.slice(startIndex, endIndex)

    return {
      products: paginatedProducts,
      total: mockProducts.length,
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(300)

    const product = mockProducts.find((p) => p.id === id)
    return product || null
  },

  async verifyBarcode(barcodeCode: string): Promise<BarcodeVerificationResponse> {
    await delay(800)

    const existingProduct = mockProducts.find((p) => p.barcodeCode === barcodeCode)

    if (existingProduct) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { expirationDate, quantity, ...productWithoutExpiration } = existingProduct
      return {
        exists: true,
        product: productWithoutExpiration,
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
      updatedAt: new Date().toISOString(),
    }

    mockProducts.push(newProduct)
    return newProduct
  },

  async updateProduct(productData: ProductUpdateRequest): Promise<Product> {
    await delay(500)

    const index = mockProducts.findIndex((p) => p.id === productData.id)
    if (index === -1) {
      throw new Error('Produto não encontrado')
    }

    const updatedProduct: Product = {
      ...mockProducts[index],
      ...productData,
      updatedAt: new Date().toISOString(),
    }

    mockProducts[index] = updatedProduct
    return updatedProduct
  },
}
