interface SaleRequest {
  productId: string
  quantity: number
}

interface SaleResponse {
  id: string
  productId: string
  quantity: number
  saleDate: string
  productName: string
  unitPrice?: number
  totalPrice?: number
}

interface Sale {
  id: string
  productId: string
  productName: string
  quantity: number
  saleDate: string
  unitPrice: number
  totalPrice: number
}

const sales: Sale[] = []

export const saleService = {
  async sellProduct(request: SaleRequest): Promise<SaleResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockProducts = [
      { id: '1', name: 'Leite Integral', unitPrice: 4.5 },
      { id: '2', name: 'Pão Francês', unitPrice: 0.75 },
      { id: '3', name: 'Queijo Mussarela', unitPrice: 12.9 },
    ]

    const product = mockProducts.find((p) => p.id === request.productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const sale: Sale = {
      id: Date.now().toString(),
      productId: request.productId,
      productName: product.name,
      quantity: request.quantity,
      saleDate: new Date().toISOString(),
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * request.quantity,
    }

    sales.push(sale)

    return {
      id: sale.id,
      productId: sale.productId,
      quantity: sale.quantity,
      saleDate: sale.saleDate,
      productName: sale.productName,
      unitPrice: sale.unitPrice,
      totalPrice: sale.totalPrice,
    }
  },

  async getSales(): Promise<Sale[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [...sales].sort(
      (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime(),
    )
  },

  async getSaleById(id: string): Promise<Sale | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return sales.find((sale) => sale.id === id) || null
  },

  async getSalesByProduct(productId: string): Promise<Sale[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return sales
      .filter((sale) => sale.productId === productId)
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
  },

  async getSalesReport(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    totalSales: number
    totalRevenue: number
    totalItems: number
    sales: Sale[]
  }> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    let filteredSales = [...sales]

    if (startDate) {
      filteredSales = filteredSales.filter((sale) => new Date(sale.saleDate) >= new Date(startDate))
    }

    if (endDate) {
      filteredSales = filteredSales.filter((sale) => new Date(sale.saleDate) <= new Date(endDate))
    }

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)

    return {
      totalSales: filteredSales.length,
      totalRevenue,
      totalItems,
      sales: filteredSales.sort(
        (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime(),
      ),
    }
  },
}

export type { SaleRequest, SaleResponse, Sale }
