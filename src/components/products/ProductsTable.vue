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
      :paginator="true" 
      :rows="10"
      :totalRecords="totalRecords"
      :lazy="true"
      @page="onPage"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      current-page-report-template="Mostrando {first} a {last} de {totalRecords} produtos"
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
          <span 
            :class="getExpirationDateClass(data.expirationDate)"
            class="font-medium"
          >
            {{ formatDate(data.expirationDate) }}
          </span>
        </template>
      </Column>
      
      <Column header="Ações" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              severity="info" 
              text 
              rounded 
              @click="$emit('editProduct', data)"
              v-tooltip.top="'Editar produto'"
            />
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              text 
              rounded 
              @click="confirmDelete(data)"
              v-tooltip.top="'Excluir produto'"
            />
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="text-center py-8">
          <i class="pi pi-inbox text-4xl text-gray-400 mb-4 block"></i>
          <p class="text-gray-500 text-lg">Nenhum produto encontrado</p>
          <p class="text-gray-400 text-sm mt-2">Cadastre seu primeiro produto usando o botão acima</p>
        </div>
      </template>

      <template #loading>
        <div class="text-center py-8">
          <ProgressSpinner style="width: 50px; height: 50px" stroke-width="4" />
          <p class="text-gray-500 mt-4">Carregando produtos...</p>
        </div>
      </template>
    </DataTable>

    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'
import type { Product } from '@/types/product'
import { productService } from '@/services/product.service'

interface PageEvent {
  first: number
  rows: number
  page: number
  pageCount: number
}

defineEmits<{
  openCreateModal: []
  editProduct: [product: Product]
}>()

const confirm = useConfirm()
const toast = useToast()

const products = ref<Product[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)

const loadProducts = async (page: number = 1) => {
  loading.value = true
  try {
    const response = await productService.getProducts(page, 10)
    products.value = response.products
    totalRecords.value = response.total
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao carregar produtos',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const onPage = (event: PageEvent) => {
  currentPage.value = event.page + 1
  loadProducts(currentPage.value)
}

const confirmDelete = (product: Product) => {
  confirm.require({
    message: `Tem certeza que deseja excluir o produto "${product.name}"?`,
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Excluir',
      severity: 'danger'
    },
    accept: () => deleteProduct(product)
  })
}

const deleteProduct = async (product: Product) => {
  try {
    await productService.deleteProduct(product.id)
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto excluído com sucesso',
      life: 3000
    })
    loadProducts(currentPage.value)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao excluir produto',
      life: 3000
    })
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
  loadProducts(currentPage.value)
}

defineExpose({ refreshTable })

onMounted(() => {
  loadProducts()
})
</script>