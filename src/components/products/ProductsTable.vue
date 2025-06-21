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

    <DataTable
      :value="products"
      :loading="loading"
      responsive-layout="scroll"
      class="p-datatable-sm"
    >
      <Column field="name" header="Nome">
        <template #body="{ data }">
          <span class="font-medium">{{ data.name }}</span>
        </template>
      </Column>

      <Column field="brand" header="Marca">
        <template #body="{ data }">
          <Tag :value="data.brand" severity="info" />
        </template>
      </Column>

      <Column field="quantity" header="Quantidade">
        <template #body="{ data }">
          <Badge
            :value="data.quantity"
            :severity="data.quantity <= 2 ? 'danger' : data.quantity <= 5 ? 'warning' : 'success'"
          />
        </template>
      </Column>

      <Column field="expirationDate" header="Data de Validade">
        <template #body="{ data }">
          <span :class="getExpirationDateClass(data.expirationDate)" class="font-medium">
            {{ formatDate(data.expirationDate) }}
          </span>
        </template>
      </Column>

      <Column header="Ações" :exportable="false" style="min-width: 4rem">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            severity="info"
            text
            rounded
            @click="$emit('editProduct', data)"
            v-tooltip.top="'Editar produto'"
          />
        </template>
      </Column>

      <template #empty>
        <div v-if="!loading" class="text-center py-8">
          <i class="pi pi-inbox text-4xl text-gray-400 mb-4 block"></i>
          <p class="text-gray-500 text-lg">Nenhum produto encontrado</p>
          <p class="text-gray-400 text-sm mt-2">
            Cadastre seu primeiro produto usando o botão acima
          </p>
        </div>
      </template>

      <template #loading>
        <div class="text-center py-8">
          <ProgressSpinner style="width: 50px; height: 50px" stroke-width="4" />
          <p class="text-gray-500 mt-4">Carregando produtos...</p>
        </div>
      </template>
    </DataTable>
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
