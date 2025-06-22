import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
} from '@/types/product'
import api from '@/lib/axios'

export const productService = {
  async getProducts(): Promise<{ products: Product[]; total: number }> {
    try {
      const response = await api.get<Product[]>('/products')
      return {
        products: response.data,
        total: response.data.length,
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      throw error
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get<Product>(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error)
      return null
    }
  },

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await api.get<Product>(`/products/barcode/${barcode}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar produto por código de barras:', error)
      return null
    }
  },

  async createProduct(productData: ProductCreateRequest): Promise<Product> {
    try {
      const response = await api.post<Product>('/products', productData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      throw error
    }
  },

  async updateProduct(productData: ProductUpdateRequest): Promise<Product> {
    try {
      const { id, ...updateData } = productData
      const response = await api.patch<Product>(`/products/${id}`, updateData)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      throw error
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`)
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      throw error
    }
  },
}