<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Produtos Cadastrados</h2>
      <Button
        label="Cadastrar Produto"
        icon="pi pi-plus"
        @click="$emit('openCreateModal')"
        class="p-button-success"
      />
    </div>

    <Card class="shadow-md">
      <template #content>
        <div class="relative">
          <DataTable
            :value="products"
            :loading="false"
            responsive-layout="scroll"
            stripedRows
            showGridlines
            tableStyle="min-width: 50rem"
            class="p-datatable-gridlines"
          >
          <Column field="name" header="Nome" style="min-width: 200px">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <i class="pi pi-box text-blue-500"></i>
                <span class="font-semibold text-gray-900">{{ data.name }}</span>
              </div>
            </template>
          </Column>

          <Column field="brand" header="Marca" style="min-width: 150px">
            <template #body="{ data }">
              <Tag :value="data.brand" severity="info" class="font-medium" />
            </template>
          </Column>

          <Column field="quantity" header="Quantidade" style="min-width: 120px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Badge
                  :value="data.quantity"
                  :severity="data.quantity <= 2 ? 'danger' : data.quantity <= 5 ? 'warning' : 'success'"
                  size="large"
                />
                <small class="text-gray-500">unid.</small>
              </div>
            </template>
          </Column>

          <Column field="expirationDate" header="Data de Validade" style="min-width: 150px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar" :class="getExpirationIconClass(data.expirationDate)"></i>
                <span :class="getExpirationDateClass(data.expirationDate)" class="font-medium">
                  {{ formatDate(data.expirationDate) }}
                </span>
              </div>
            </template>
          </Column>

          <Column header="Ações" :exportable="false" style="min-width: 100px">
            <template #body="{ data }">
              <div class="flex justify-center">
                <Button
                  icon="pi pi-pencil"
                  severity="info"
                  size="small"
                  outlined
                  rounded
                  @click="$emit('editProduct', data)"
                  v-tooltip.top="'Editar produto'"
                  class="hover:bg-blue-50"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div v-if="!loading" class="text-center py-12">
              <div class="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-inbox text-3xl text-gray-400"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h3>
              <p class="text-gray-500 text-sm max-w-sm mx-auto">
                Cadastre seu primeiro produto usando o botão "Cadastrar Produto" acima para começar.
              </p>
            </div>
          </template>

          </DataTable>
          
          <!-- Loading overlay quando está carregando -->
          <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg z-10">
            <div class="text-center">
              <ProgressSpinner style="width: 50px; height: 50px" stroke-width="4" />
              <p class="text-gray-600 mt-3 font-medium">Carregando produtos...</p>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import type { Product } from '@/types/product'
import { productService } from '@/services/product.service'

defineEmits<{
  openCreateModal: []
  editProduct: [product: Product]
}>()

const toast = useToast()

const products = ref<Product[]>([])
const loading = ref(false)

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getProducts(1, 1000) // Carrega todos os produtos
    products.value = response.products
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao carregar produtos',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const getExpirationDateClass = (dateString: string) => {
  const today = new Date()
  const expirationDate = new Date(dateString)
  const diffTime = expirationDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'text-red-600 font-bold' // Vencido
  } else if (diffDays <= 7) {
    return 'text-orange-500 font-semibold' // Vence em 7 dias
  } else if (diffDays <= 30) {
    return 'text-yellow-600 font-medium' // Vence em 30 dias
  }
  return 'text-green-600' // Válido
}

const getExpirationIconClass = (dateString: string) => {
  const today = new Date()
  const expirationDate = new Date(dateString)
  const diffTime = expirationDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'text-red-600' // Vencido
  } else if (diffDays <= 7) {
    return 'text-orange-500' // Vence em 7 dias
  } else if (diffDays <= 30) {
    return 'text-yellow-600' // Vence em 30 dias
  }
  return 'text-green-600' // Válido
}

const refreshTable = () => {
  loadProducts()
}

defineExpose({ refreshTable })

onMounted(() => {
  loadProducts()
})
</script>
