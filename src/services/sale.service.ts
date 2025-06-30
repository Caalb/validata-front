import type { Product } from '@/types/product'
import type { Stock } from '@/types/stock'
import api from '@/lib/axios'

interface SaleItem {
  productId: string
  stockId: string
  quantity: number
}

interface SaleItemResponse {
  id: string
  sale_id: string
  product_id: string
  stock_id: string
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
  product: {
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
}

interface UserResponse {
  id: string
  name: string
  email: string
  type: string
  created_at: string
  updated_at: string
}

interface CreateSaleRequest {
  userId: string
  items: SaleItem[]
}

interface Sale {
  id: string
  user_id: string
  sale_date: string
  total_value: number
  created_at: string
  updated_at: string
  user?: UserResponse
  items?: SaleItemResponse[]
}

interface SalesAnalytics {
  summary: {
    totalSales: number
    totalRevenue: number
    totalItems: number
    averageSaleValue: number
  }
  topProducts: Array<{
    productId: string
    productName: string
    totalQuantity: number
    totalRevenue: number
    salesCount: number
  }>
  salesByDay: Array<{
    date: string
    totalSales: number
    totalRevenue: number
    salesCount: number
  }>
  recentSales: Sale[]
}

interface ProductWithStock extends Product {
  availableStocks: Stock[]
}

export const saleService = {
  async getProductByBarcode(barcode: string): Promise<ProductWithStock | null> {
    try {
      const response = await api.get<ProductWithStock>(`/sales/product-by-barcode/${barcode}`)
      console.log('Product with stock from API:', response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar produto por código de barras:', error)
      return null
    }
  },

  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    try {
      console.log('Sending sale data to API:', saleData)
      const response = await api.post<Sale>('/sales', saleData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar venda:', error)
      throw error
    }
  },

  async getSales(): Promise<Sale[]> {
    try {
      const response = await api.get<Sale[]>('/sales')
      console.log('Sales data from API:', response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      throw error
    }
  },

  async getSaleById(id: string): Promise<Sale | null> {
    try {
      const response = await api.get<Sale>(`/sales/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar venda por ID:', error)
      return null
    }
  },

  async getSalesAnalytics(
    options: {
      startDate?: string
      endDate?: string
    } = {},
  ): Promise<SalesAnalytics> {
    try {
      const sales = await this.getSales()
      console.log('Raw sales for analytics:', sales)
      console.log('Filter options:', options)

      let filteredSales = sales
      if (options.startDate || options.endDate) {
        filteredSales = sales.filter((sale) => {
          try {
            const saleDate = new Date(sale.sale_date)

            // Normaliza as datas para comparação (remove horário)
            const saleDateOnly = new Date(
              saleDate.getFullYear(),
              saleDate.getMonth(),
              saleDate.getDate(),
            )

            if (options.startDate) {
              const startDate = new Date(options.startDate)
              const startDateOnly = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
              )
              if (saleDateOnly < startDateOnly) return false
            }

            if (options.endDate) {
              const endDate = new Date(options.endDate)
              const endDateOnly = new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
              )
              if (saleDateOnly > endDateOnly) return false
            }

            return true
          } catch (error) {
            console.error('Erro ao processar data da venda:', sale.sale_date, error)
            return false
          }
        })
      }

      const totalSales = filteredSales.length
      const totalRevenue = filteredSales.reduce(
        (sum, sale) => sum + (Number(sale.total_value) || 0),
        0,
      )
      const totalItems = filteredSales.reduce((sum, sale) => {
        return (
          sum +
          (sale.items?.reduce((itemSum, item) => itemSum + (Number(item.quantity) || 0), 0) || 0)
        )
      }, 0)
      const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0

      const productStats = new Map<
        string,
        {
          productId: string
          productName: string
          totalQuantity: number
          totalRevenue: number
          salesCount: number
        }
      >()

      filteredSales.forEach((sale) => {
        sale.items?.forEach((item) => {
          const productId = item.product_id
          const existing = productStats.get(productId) || {
            productId,
            productName: item.product.name,
            totalQuantity: 0,
            totalRevenue: 0,
            salesCount: 0,
          }

          existing.totalQuantity += Number(item.quantity) || 0
          existing.totalRevenue += (Number(item.unit_price) || 0) * (Number(item.quantity) || 0)
          existing.salesCount += 1
          productStats.set(productId, existing)
        })
      })

      const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10)

      const salesByDayMap = new Map<
        string,
        { totalSales: number; totalRevenue: number; salesCount: number }
      >()
      filteredSales.forEach((sale) => {
        const date = new Date(sale.sale_date).toISOString().split('T')[0]
        const existing = salesByDayMap.get(date) || {
          totalSales: 0,
          totalRevenue: 0,
          salesCount: 0,
        }
        existing.totalSales += Number(sale.total_value) || 0
        existing.totalRevenue += Number(sale.total_value) || 0
        existing.salesCount += 1
        salesByDayMap.set(date, existing)
      })

      const salesByDay = Array.from(salesByDayMap.entries())
        .map(([date, data]) => ({
          date,
          ...data,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Get recent sales
      const recentSales = filteredSales
        .sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())
        .slice(0, 10)

      const result = {
        summary: {
          totalSales,
          totalRevenue,
          totalItems,
          averageSaleValue,
        },
        topProducts,
        salesByDay,
        recentSales,
      }

      console.log('Final analytics result:', result)
      console.log('Total Revenue:', totalRevenue)
      console.log('Total Items:', totalItems)
      console.log('Top Products:', topProducts)
      console.log('Sales By Day:', salesByDay)
      console.log('Recent Sales:', recentSales)
      return result
    } catch (error) {
      console.error('Erro ao calcular analytics de vendas:', error)
      throw error
    }
  },

  // Legacy methods for backward compatibility
  async getSalesReport(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    totalSales: number
    totalRevenue: number
    totalItems: number
    sales: Sale[]
  }> {
    const analytics = await this.getSalesAnalytics({ startDate, endDate })
    return {
      totalSales: analytics.summary.totalSales,
      totalRevenue: analytics.summary.totalRevenue,
      totalItems: analytics.summary.totalItems,
      sales: analytics.recentSales,
    }
  },
}

export type {
  Sale,
  SaleItem,
  SaleItemResponse,
  UserResponse,
  CreateSaleRequest,
  SalesAnalytics,
  ProductWithStock,
}
