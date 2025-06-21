<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="false"
    :draggable="false"
    :style="{ width: '600px', zIndex: 1000 }"
    @update:visible="$emit('update:visible', $event)"
    :pt="{
      root: 'bg-transparent',
      mask: 'bg-black/50 backdrop-blur-sm',
      content: 'border-none shadow-none bg-transparent p-0 overflow-hidden rounded-3xl',
    }"
  >
    <template #header>
      <div class="relative">
        <button
          @click="$emit('update:visible', false)"
          class="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white/30 transition-all duration-200"
        >
          <i class="pi pi-times text-sm"></i>
        </button>

        <div
          class="relative bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white/90 to-secondary-50/80"
          ></div>

          <div
            class="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-2xl"
          ></div>
          <div
            class="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-secondary-200/30 to-transparent rounded-full blur-2xl"
          ></div>

          <div class="relative z-10 p-8">
            <div class="text-center mb-8">
              <div class="relative mx-auto mb-6">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur opacity-30"
                ></div>
                <div
                  class="relative w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto"
                >
                  <i class="pi pi-box text-white text-2xl"></i>
                </div>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-3">
                {{ isEdit ? 'Editar Produto' : 'Cadastrar Novo Produto' }}
              </h3>

              <p class="text-gray-600 leading-relaxed">
                {{
                  isEdit
                    ? 'Atualize as informações do produto conforme necessário'
                    : 'Preencha as informações do produto para adicionar ao seu estoque'
                }}
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="animate-fade-in">
                <label for="barcodeCode" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="pi pi-barcode mr-2 text-primary-500"></i>
                  Código de Barras *
                </label>
                <div class="flex gap-3">
                  <div class="flex-1 relative">
                    <InputText
                      id="barcodeCode"
                      v-model="formData.barcodeCode"
                      :disabled="barcodeLoading || isEdit"
                      placeholder="Digite ou escaneie o código"
                      class="w-full pl-4 pr-4 py-3 rounded-2xl border-2 border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-primary-300 focus:bg-white/80 transition-all duration-300"
                      :class="{ 'border-danger-300 bg-danger-50/50': errors.barcodeCode }"
                    />
                    <div
                      v-if="errors.barcodeCode"
                      class="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <i class="pi pi-exclamation-triangle text-danger-400"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div class="animate-fade-in" style="animation-delay: 0.1s">
                <label for="barcodeFormat" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="pi pi-cog mr-2 text-primary-500"></i>
                  Formato do Código *
                </label>
                <div class="relative">
                  <Dropdown
                    id="barcodeFormat"
                    v-model="formData.barcodeFormat"
                    :options="barcodeFormats"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecione o formato"
                    class="w-full"
                    :pt="{
                      root: 'w-full',
                      input:
                        'w-full pl-4 pr-12 py-3 rounded-2xl border-2 border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-primary-300 focus:bg-white/80 transition-all duration-300',
                    }"
                    :class="{ 'border-danger-300 bg-danger-50/50': errors.barcodeFormat }"
                  />
                  <div
                    v-if="errors.barcodeFormat"
                    class="absolute inset-y-0 right-8 flex items-center pr-3"
                  >
                    <i class="pi pi-exclamation-triangle text-danger-400"></i>
                  </div>
                </div>
                <small v-if="errors.barcodeFormat" class="text-danger-500 text-xs mt-1 block">{{
                  errors.barcodeFormat
                }}</small>
              </div>

              <div
                v-if="barcodeLoading"
                class="text-center py-6 animate-fade-in bg-primary-50/50 rounded-2xl"
              >
                <ProgressSpinner style="width: 40px; height: 40px" stroke-width="4" />
                <p class="text-sm text-gray-600 mt-3 font-medium">Verificando produto...</p>
              </div>

              <div class="animate-fade-in" style="animation-delay: 0.2s">
                <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="pi pi-tag mr-2 text-primary-500"></i>
                  Nome do Produto *
                </label>
                <div class="relative">
                  <InputText
                    id="name"
                    v-model="formData.name"
                    :disabled="barcodeLoading"
                    placeholder="Digite o nome do produto"
                    class="w-full pl-4 pr-4 py-3 rounded-2xl border-2 border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-primary-300 focus:bg-white/80 transition-all duration-300"
                    :class="{ 'border-danger-300 bg-danger-50/50': errors.name }"
                  />
                  <div v-if="errors.name" class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <i class="pi pi-exclamation-triangle text-danger-400"></i>
                  </div>
                </div>
                <small v-if="errors.name" class="text-danger-500 text-xs mt-1 block">{{
                  errors.name
                }}</small>
              </div>

              <div class="animate-fade-in" style="animation-delay: 0.3s">
                <label for="brand" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="pi pi-bookmark mr-2 text-primary-500"></i>
                  Marca *
                </label>
                <div class="relative">
                  <InputText
                    id="brand"
                    v-model="formData.brand"
                    :disabled="barcodeLoading"
                    placeholder="Digite a marca do produto"
                    class="w-full pl-4 pr-4 py-3 rounded-2xl border-2 border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-primary-300 focus:bg-white/80 transition-all duration-300"
                    :class="{ 'border-danger-300 bg-danger-50/50': errors.brand }"
                  />
                  <div
                    v-if="errors.brand"
                    class="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <i class="pi pi-exclamation-triangle text-danger-400"></i>
                  </div>
                </div>
                <small v-if="errors.brand" class="text-danger-500 text-xs mt-1 block">{{
                  errors.brand
                }}</small>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="animate-fade-in" style="animation-delay: 0.4s">
                  <label for="quantity" class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="pi pi-hashtag mr-2 text-primary-500"></i>
                    Quantidade *
                  </label>
                  <div class="relative">
                    <InputNumber
                      id="quantity"
                      v-model="formData.quantity"
                      :disabled="barcodeLoading"
                      :min="1"
                      :max="1000"
                      placeholder="Qtd."
                      class="w-full"
                      :pt="{
                        input:
                          'w-full pl-4 pr-4 py-3 rounded-2xl border-2 border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-primary-300 focus:bg-white/80 transition-all duration-300',
                      }"
                      :inputClass="{ 'border-danger-300 bg-danger-50/50': errors.quantity }"
                    />
                    <div
                      v-if="errors.quantity"
                      class="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <i class="pi pi-exclamation-triangle text-danger-400"></i>
                    </div>
                  </div>
                  <small v-if="errors.quantity" class="text-danger-500 text-xs mt-1 block">{{
                    errors.quantity
                  }}</small>
                </div>

                <div class="animate-fade-in" style="animation-delay: 0.5s">
                  <label
                    for="expirationDate"
                    class="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <i class="pi pi-calendar mr-2 text-primary-500"></i>
                    Data de Validade *
                  </label>
                  <div class="relative">
                    <Calendar
                      id="expirationDate"
                      v-model="formData.expirationDate"
                      :disabled="barcodeLoading"
                      date-format="dd/mm/yy"
                      :min-date="new Date()"
                      placeholder="dd/mm/aaaa"
                      class="w-full"
                      show-icon
                      :pt="{
                        input:
                          'w-full pl-4 pr-12 py-3 rounded-2xl border-2 border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-primary-300 focus:bg-white/80 transition-all duration-300',
                      }"
                      :inputClass="{ 'border-danger-300 bg-danger-50/50': errors.expirationDate }"
                    />
                    <div
                      v-if="errors.expirationDate"
                      class="absolute inset-y-0 right-12 flex items-center pr-3"
                    >
                      <i class="pi pi-exclamation-triangle text-danger-400"></i>
                    </div>
                  </div>
                  <small v-if="errors.expirationDate" class="text-danger-500 text-xs mt-1 block">{{
                    errors.expirationDate
                  }}</small>
                </div>
              </div>

              <div
                v-if="productExists"
                class="animate-fade-in bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-4"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center"
                  >
                    <i class="pi pi-check-circle text-white"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-green-800 mb-1">Produto encontrado!</h4>
                    <p class="text-sm text-green-700">
                      Dados preenchidos automaticamente. Ajuste a quantidade e data de validade
                      conforme necessário.
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="flex justify-end gap-4 pt-6 animate-fade-in"
                style="animation-delay: 0.6s"
              >
                <Button
                  label="Cancelar"
                  @click="$emit('update:visible', false)"
                  :disabled="loading"
                  class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300"
                />
                <Button
                  type="submit"
                  :label="isEdit ? 'Atualizar Produto' : 'Cadastrar Produto'"
                  :loading="loading"
                  :disabled="barcodeLoading"
                  class="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-none"
                />
              </div>
            </form>
          </div>
        </div>
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
  productSaved: [product: Product]
  openBarcodeScanner: []
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
  expirationDate: null as Date | null,
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
  { label: 'Code 39', value: 'CODE_39' },
]

const isEdit = computed(() => !!props.product)

const resetForm = () => {
  formData.value = {
    barcodeCode: '',
    barcodeFormat: 'EAN_13',
    name: '',
    brand: '',
    quantity: 1,
    expirationDate: null,
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
    expirationDate: new Date(product.expirationDate),
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
      expirationDate: formData.value.expirationDate!.toISOString().split('T')[0],
    }

    let savedProduct: Product

    if (isEdit.value && props.product) {
      const updateData: ProductUpdateRequest = {
        id: props.product.id,
        ...productData,
      }
      savedProduct = await productService.updateProduct(updateData)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Produto atualizado com sucesso',
        life: 3000,
      })
    } else {
      savedProduct = await productService.createProduct(productData as ProductCreateRequest)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Produto cadastrado com sucesso',
        life: 3000,
      })
    }

    emit('productSaved', savedProduct)
    emit('update:visible', false)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: isEdit.value ? 'Erro ao atualizar produto' : 'Erro ao cadastrar produto',
      life: 3000,
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
      life: 3000,
    })
  } finally {
    barcodeLoading.value = false
  }
}

const setBarcodeCode = (code: string, format: string = 'EAN_13') => {
  formData.value.barcodeCode = code
  formData.value.barcodeFormat = format
  verifyBarcode(code)
}

defineExpose({ setBarcodeCode })
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      if (props.product) {
        populateForm(props.product)
      } else {
        resetForm()
      }
    }
  },
)

watch(
  () => formData.value.barcodeCode,
  (newCode) => {
    if (newCode && newCode.length >= 8) {
      verifyBarcode(newCode)
    }
  },
)
</script>
