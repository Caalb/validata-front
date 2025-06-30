<template>
  <div class="sales-view">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
      <p class="text-gray-600">Carregando dados de vendas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-4"></i>
      <p class="text-gray-600 mb-4">Erro ao carregar dados de vendas</p>
      <Button label="Tentar novamente" @click="loadSalesData" outlined />
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Date Range Filter -->
      <Card class="mb-6">
        <template #content>
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-800 mb-1">Dashboard de Vendas</h2>
              <p class="text-gray-600 text-sm">Análise completa do desempenho de vendas</p>
              <div v-if="dateRange && dateRange.length === 2" class="mt-2">
                <Badge
                  :value="`Filtro: ${formatDateOnly(dateRange[0])} - ${formatDateOnly(dateRange[1])}`"
                  severity="info"
                  class="text-xs"
                />
              </div>
            </div>
            <div class="flex gap-3">
              <Calendar
                v-model="dateRange"
                selection-mode="range"
                :manual-input="false"
                show-icon
                placeholder="Selecionar período"
                class="w-64"
                @date-select="onDateRangeChange"
              />
              <Button label="Hoje" size="small" outlined @click="setTodayRange" />
              <Button label="Últimos 30 dias" size="small" outlined @click="setLast30DaysRange" />
              <Button
                v-if="dateRange && dateRange.length > 0"
                label="Limpar"
                size="small"
                severity="secondary"
                outlined
                @click="clearDateRange"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card class="text-center">
          <template #content>
            <div class="py-4">
              <i class="pi pi-dollar text-3xl text-blue-600 mb-3"></i>
              <div class="text-2xl font-bold text-gray-800 mb-1">
                {{ formatCurrency(analytics?.summary.totalRevenue || 0) }}
              </div>
              <div class="text-sm text-gray-600">Receita Total</div>
            </div>
          </template>
        </Card>

        <Card class="text-center">
          <template #content>
            <div class="py-4">
              <i class="pi pi-shopping-cart text-3xl text-green-600 mb-3"></i>
              <div class="text-2xl font-bold text-gray-800 mb-1">
                {{ analytics?.summary.totalSales || 0 }}
              </div>
              <div class="text-sm text-gray-600">Total de Vendas</div>
            </div>
          </template>
        </Card>

        <Card class="text-center">
          <template #content>
            <div class="py-4">
              <i class="pi pi-box text-3xl text-purple-600 mb-3"></i>
              <div class="text-2xl font-bold text-gray-800 mb-1">
                {{ analytics?.summary.totalItems || 0 }}
              </div>
              <div class="text-sm text-gray-600">Itens Vendidos</div>
            </div>
          </template>
        </Card>

        <Card class="text-center">
          <template #content>
            <div class="py-4">
              <i class="pi pi-chart-line text-3xl text-orange-600 mb-3"></i>
              <div class="text-2xl font-bold text-gray-800 mb-1">
                {{ formatCurrency(analytics?.summary.averageSaleValue || 0) }}
              </div>
              <div class="text-sm text-gray-600">Ticket Médio</div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Sales by Day Chart -->
        <Card>
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="font-semibold text-gray-800">Vendas por Dia</h3>
              <p class="text-sm text-gray-600">Evolução das vendas no período</p>
            </div>
          </template>
          <template #content>
            <div class="h-80">
              <BarChart
                v-if="salesByDayData"
                :data="salesByDayData"
                title="Vendas por Dia"
                x-axis-label="Data"
                y-axis-label="Receita (R$)"
              />
              <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center">
                  <i class="pi pi-chart-bar text-3xl text-gray-400 mb-2"></i>
                  <p class="text-gray-500">Nenhum dado disponível</p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Top Products Chart -->
        <Card>
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="font-semibold text-gray-800">Produtos Mais Vendidos</h3>
              <p class="text-sm text-gray-600">Ranking por receita</p>
            </div>
          </template>
          <template #content>
            <div class="h-80">
              <PieChart
                v-if="topProductsData"
                :data="topProductsData"
                title="Produtos Mais Vendidos"
              />
              <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center">
                  <i class="pi pi-chart-pie text-3xl text-gray-400 mb-2"></i>
                  <p class="text-gray-500">Nenhum dado disponível</p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Recent Sales Table -->
      <Card>
        <template #header>
          <div class="p-4 pb-0">
            <h3 class="font-semibold text-gray-800">Vendas Recentes</h3>
            <p class="text-sm text-gray-600">Últimas transações realizadas</p>
          </div>
        </template>
        <template #content>
          <DataTable
            :value="analytics?.recentSales || []"
            :rows="10"
            :loading="loading"
            class="p-datatable-sm"
            responsive-layout="scroll"
          >
            <Column field="sale_date" header="Data" class="w-32">
              <template #body="{ data }">
                {{ formatDate(data.sale_date) }}
              </template>
            </Column>
            <Column field="items" header="Produtos" class="w-48">
              <template #body="{ data }">
                <div class="space-y-1">
                  <div v-for="item in data.items?.slice(0, 2)" :key="item.id" class="text-sm">
                    <span class="font-medium">{{ item.product?.name || 'Produto' }}</span>
                    <span class="text-gray-500"> ({{ item.quantity }}x)</span>
                  </div>
                  <div v-if="(data.items?.length || 0) > 2" class="text-xs text-gray-500">
                    +{{ (data.items?.length || 0) - 2 }} mais produtos
                  </div>
                </div>
              </template>
            </Column>
            <Column field="total_value" header="Valor Total" class="w-32">
              <template #body="{ data }">
                {{ formatCurrency(data.total_value) }}
              </template>
            </Column>
            <Column field="items" header="Itens" class="w-20">
              <template #body="{ data }">
                <Badge :value="getTotalItems(data.items)" severity="info" />
              </template>
            </Column>
            <Column header="Status" class="w-24">
              <template #body>
                <Badge value="Concluída" severity="success" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Badge from 'primevue/badge'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import { saleService, type SalesAnalytics } from '@/services/sale.service'

const toast = useToast()

// State
const loading = ref(false)
const error = ref(false)
const analytics = ref<SalesAnalytics | null>(null)
const dateRange = ref<Date[]>([])

// Computed
const salesByDayData = computed(() => {
  if (!analytics.value?.salesByDay?.length) return null

  try {
    return {
      labels: analytics.value.salesByDay.map((day) => {
        try {
          return new Date(day.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          })
        } catch (error) {
          console.error('Erro ao formatar data:', day.date, error)
          return 'Data inválida'
        }
      }),
      datasets: [
        {
          label: 'Receita Diária',
          data: analytics.value.salesByDay.map((day) => (day.totalRevenue || 0) / 100), // Convert from cents
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    }
  } catch (error) {
    console.error('Erro ao processar dados de vendas por dia:', error)
    return null
  }
})

const topProductsData = computed(() => {
  if (!analytics.value?.topProducts?.length) return null

  try {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
      '#84CC16',
      '#F97316',
      '#EC4899',
      '#6366F1',
    ]

    return {
      labels: analytics.value.topProducts
        .slice(0, 5)
        .map((product) => product.productName || 'Produto não identificado'),
      datasets: [
        {
          data: analytics.value.topProducts
            .slice(0, 5)
            .map((product) => (product.totalRevenue || 0) / 100),
          backgroundColor: colors.slice(0, 5),
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    }
  } catch (error) {
    console.error('Erro ao processar dados dos produtos mais vendidos:', error)
    return null
  }
})

// Methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100) // Convert from cents
}

const formatDate = (date: string | Date) => {
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida'
    }

    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Erro ao formatar data:', date, error)
    return 'Data inválida'
  }
}

const formatDateOnly = (date: string | Date) => {
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida'
    }

    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch (error) {
    console.error('Erro ao formatar data:', date, error)
    return 'Data inválida'
  }
}

const getTotalItems = (items: { quantity: number }[] | undefined) => {
  if (!items || items.length === 0) return 0
  return items.reduce((total, item) => total + (item.quantity || 0), 0)
}

const loadSalesData = async () => {
  loading.value = true
  error.value = false

  try {
    const options: { startDate?: string; endDate?: string } = {}

    if (dateRange.value && dateRange.value.length === 2) {
      const [startDate, endDate] = dateRange.value
      if (startDate && endDate) {
        // Formata as datas para YYYY-MM-DD
        options.startDate = startDate.toISOString().split('T')[0]
        options.endDate = endDate.toISOString().split('T')[0]
      }
    }

    analytics.value = await saleService.getSalesAnalytics(options)
  } catch (err) {
    console.error('Erro ao carregar dados de vendas:', err)
    error.value = true
    analytics.value = null // Garante que analytics seja null em caso de erro

    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível carregar os dados de vendas. Tente novamente.',
      life: 5000,
    })
  } finally {
    loading.value = false
  }
}

const onDateRangeChange = () => {
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    if (startDate && endDate && startDate <= endDate) {
      loadSalesData()
    }
  }
}

const setTodayRange = () => {
  const today = new Date()
  const startOfDay = new Date(today)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)

  dateRange.value = [startOfDay, endOfDay]
  loadSalesData()
}

const setLast30DaysRange = () => {
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  // Define o início e fim dos dias
  const startOfDay = new Date(thirtyDaysAgo)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)

  dateRange.value = [startOfDay, endOfDay]
  loadSalesData()
}

const clearDateRange = () => {
  dateRange.value = []
  loadSalesData()
}

// Lifecycle
onMounted(() => {
  // Load all data by default (no date filter)
  loadSalesData()
})
</script>

<style scoped>
.sales-view {
  width: 100%;
}
</style>
