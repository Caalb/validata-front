<template>
  <Dialog 
    :visible="visible" 
    :modal="true" 
    :closable="true" 
    :draggable="false"
    :style="{ width: '500px', zIndex: 1000 }"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-box text-xl"></i>
        <span class="font-semibold text-lg">
          {{ isEdit ? 'Editar Produto' : 'Cadastrar Produto' }}
        </span>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Barcode Code -->
      <div class="field">
        <label for="barcodeCode" class="block text-sm font-medium text-gray-700 mb-2">
          Código de Barras *
        </label>
        <div class="flex gap-2">
          <InputText
            id="barcodeCode"
            v-model="formData.barcodeCode"
            :disabled="barcodeLoading || isEdit"
            placeholder="Digite ou escaneie o código"
            class="flex-1"
            :class="{ 'p-invalid': errors.barcodeCode }"
          />
          <Button
            type="button"
            icon="pi pi-camera"
            @click="$emit('openBarcodeScanner')"
            :disabled="barcodeLoading || isEdit"
            v-tooltip.top="'Escanear código de barras'"
            severity="secondary"
          />
        </div>
        <small v-if="errors.barcodeCode" class="p-error">{{ errors.barcodeCode }}</small>
      </div>

      <!-- Barcode Format -->
      <div class="field">
        <label for="barcodeFormat" class="block text-sm font-medium text-gray-700 mb-2">
          Formato do Código *
        </label>
        <Dropdown
          id="barcodeFormat"
          v-model="formData.barcodeFormat"
          :options="barcodeFormats"
          option-label="label"
          option-value="value"
          placeholder="Selecione o formato"
          class="w-full"
          :class="{ 'p-invalid': errors.barcodeFormat }"
        />
        <small v-if="errors.barcodeFormat" class="p-error">{{ errors.barcodeFormat }}</small>
      </div>

      <!-- Loading spinner for barcode verification -->
      <div v-if="barcodeLoading" class="text-center py-4">
        <ProgressSpinner style="width: 30px; height: 30px" stroke-width="4" />
        <p class="text-sm text-gray-500 mt-2">Verificando produto...</p>
      </div>

      <!-- Product Name -->
      <div class="field">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Nome do Produto *
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          :disabled="barcodeLoading"
          placeholder="Digite o nome do produto"
          class="w-full"
          :class="{ 'p-invalid': errors.name }"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Brand -->
      <div class="field">
        <label for="brand" class="block text-sm font-medium text-gray-700 mb-2">
          Marca *
        </label>
        <InputText
          id="brand"
          v-model="formData.brand"
          :disabled="barcodeLoading"
          placeholder="Digite a marca do produto"
          class="w-full"
          :class="{ 'p-invalid': errors.brand }"
        />
        <small v-if="errors.brand" class="p-error">{{ errors.brand }}</small>
      </div>

      <!-- Quantity -->
      <div class="field">
        <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
          Quantidade *
        </label>
        <InputNumber
          id="quantity"
          v-model="formData.quantity"
          :disabled="barcodeLoading"
          :min="1"
          :max="1000"
          placeholder="Digite a quantidade"
          class="w-full"
          :class="{ 'p-invalid': errors.quantity }"
        />
        <small v-if="errors.quantity" class="p-error">{{ errors.quantity }}</small>
      </div>

      <!-- Expiration Date -->
      <div class="field">
        <label for="expirationDate" class="block text-sm font-medium text-gray-700 mb-2">
          Data de Validade *
        </label>
        <Calendar
          id="expirationDate"
          v-model="formData.expirationDate"
          :disabled="barcodeLoading"
          date-format="dd/mm/yy"
          :min-date="new Date()"
          placeholder="Selecione a data de validade"
          class="w-full"
          :class="{ 'p-invalid': errors.expirationDate }"
          show-icon
        />
        <small v-if="errors.expirationDate" class="p-error">{{ errors.expirationDate }}</small>
      </div>

      <!-- Success message for existing product -->
      <Message 
        v-if="productExists" 
        severity="success" 
        class="mb-4"
        icon="pi pi-check-circle"
      >
        Produto encontrado! Dados preenchidos automaticamente. Ajuste a quantidade e data de validade conforme necessário.
      </Message>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button 
          label="Cancelar" 
          severity="secondary" 
          @click="$emit('update:visible', false)"
          :disabled="loading"
        />
        <Button 
          :label="isEdit ? 'Atualizar' : 'Cadastrar'"
          :loading="loading"
          @click="handleSubmit"
          :disabled="barcodeLoading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import type { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/product'
import { productService } from '@/services/product.service'

interface Props {
  visible: boolean
  product?: Product | null
}

interface Emits {
  'update:visible': [value: boolean]
  'productSaved': [product: Product]
  'openBarcodeScanner': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toast = useToast()

const formData = ref({
  barcodeCode: '',
  barcodeFormat: 'EAN_13',
  name: '',
  brand: '',
  quantity: 1,
  expirationDate: null as Date | null
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const barcodeLoading = ref(false)
const productExists = ref(false)

const barcodeFormats = [
  { label: 'EAN-13', value: 'EAN_13' },
  { label: 'EAN-8', value: 'EAN_8' },
  { label: 'UPC-A', value: 'UPC_A' },
  { label: 'UPC-E', value: 'UPC_E' },
  { label: 'Code 128', value: 'CODE_128' },
  { label: 'Code 39', value: 'CODE_39' }
]

const isEdit = computed(() => !!props.product)

const resetForm = () => {
  formData.value = {
    barcodeCode: '',
    barcodeFormat: 'EAN_13',
    name: '',
    brand: '',
    quantity: 1,
    expirationDate: null
  }
  errors.value = {}
  productExists.value = false
}

const populateForm = (product: Product) => {
  formData.value = {
    barcodeCode: product.barcodeCode,
    barcodeFormat: product.barcodeFormat,
    name: product.name,
    brand: product.brand,
    quantity: product.quantity,
    expirationDate: new Date(product.expirationDate)
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.barcodeCode.trim()) {
    errors.value.barcodeCode = 'Código de barras é obrigatório'
  }

  if (!formData.value.barcodeFormat) {
    errors.value.barcodeFormat = 'Formato do código é obrigatório'
  }

  if (!formData.value.name.trim()) {
    errors.value.name = 'Nome do produto é obrigatório'
  }

  if (!formData.value.brand.trim()) {
    errors.value.brand = 'Marca é obrigatória'
  }

  if (!formData.value.quantity || formData.value.quantity < 1) {
    errors.value.quantity = 'Quantidade deve ser maior que zero'
  }

  if (!formData.value.expirationDate) {
    errors.value.expirationDate = 'Data de validade é obrigatória'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  
  try {
    const productData = {
      barcodeCode: formData.value.barcodeCode,
      barcodeFormat: formData.value.barcodeFormat,
      name: formData.value.name,
      brand: formData.value.brand,
      quantity: formData.value.quantity,
      expirationDate: formData.value.expirationDate!.toISOString().split('T')[0]
    }

    let savedProduct: Product

    if (isEdit.value && props.product) {
      const updateData: ProductUpdateRequest = {
        id: props.product.id,
        ...productData
      }
      savedProduct = await productService.updateProduct(updateData)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Produto atualizado com sucesso',
        life: 3000
      })
    } else {
      savedProduct = await productService.createProduct(productData as ProductCreateRequest)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Produto cadastrado com sucesso',
        life: 3000
      })
    }

    emit('productSaved', savedProduct)
    emit('update:visible', false)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: isEdit.value ? 'Erro ao atualizar produto' : 'Erro ao cadastrar produto',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const verifyBarcode = async (barcodeCode: string) => {
  if (!barcodeCode.trim() || isEdit.value) return

  barcodeLoading.value = true
  productExists.value = false

  try {
    const response = await productService.verifyBarcode(barcodeCode)
    
    if (response.exists && response.product) {
      productExists.value = true
      formData.value.name = response.product.name
      formData.value.brand = response.product.brand
      formData.value.barcodeFormat = response.product.barcodeFormat
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao verificar código de barras',
      life: 3000
    })
  } finally {
    barcodeLoading.value = false
  }
}

// Funcção para ser chamada externamente quando um código for escaneado
const setBarcodeCode = (code: string, format: string = 'EAN_13') => {
  formData.value.barcodeCode = code
  formData.value.barcodeFormat = format
  verifyBarcode(code)
}

defineExpose({ setBarcodeCode })

// Watchers
watch(() => props.visible, (newValue) => {
  if (newValue) {
    if (props.product) {
      populateForm(props.product)
    } else {
      resetForm()
    }
  }
})

watch(() => formData.value.barcodeCode, (newCode) => {
  if (newCode && newCode.length >= 8) {
    verifyBarcode(newCode)
  }
})
</script>