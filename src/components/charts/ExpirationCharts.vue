<template>
  <div class="expiration-charts">
    <!-- Week Filter at Top -->
    <Card class="mb-6">
      <template #header>
        <div class="p-4 pb-0">
          <h2 class="text-xl font-bold text-gray-800">Análise de Vencimentos</h2>
          <p class="text-gray-600 text-sm">
            Selecione o período para visualizar produtos com validade próxima
          </p>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2"> Período de Análise </label>
            <Dropdown
              v-model="selectedWeek"
              :options="weekOptions"
              option-label="label"
              placeholder="Selecione uma semana"
              class="w-full sm:w-80"
            />
            <div v-if="analytics?.weekRange" class="text-xs text-gray-500 mt-1">
              {{ analytics.weekRange.start.toLocaleDateString('pt-BR') }} até
              {{ analytics.weekRange.end.toLocaleDateString('pt-BR') }}
            </div>
          </div>

          <div class="flex gap-2">
            <Button
              icon="pi pi-refresh"
              label="Atualizar"
              size="small"
              outlined
              @click="refreshData"
              :loading="loading"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Summary Card -->
    <Card class="mb-6">
      <template #content>
        <div class="text-center">
          <div v-if="loading" class="flex items-center justify-center py-8">
            <ProgressSpinner />
            <span class="ml-2 text-gray-600">Carregando dados...</span>
          </div>
          <div v-else-if="analytics">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Total Products Expiring -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">
                  {{ analytics.productsExpiringThisWeek.length }}
                </div>
                <div class="text-sm text-gray-600">Produtos vencendo no período</div>
              </div>

              <!-- Total Quantity -->
              <div class="bg-orange-50 p-4 rounded-lg">
                <div class="text-2xl font-bold text-orange-600">
                  {{ analytics.totalQuantityExpiring }}
                </div>
                <div class="text-sm text-gray-600">Unidades no total</div>
              </div>

              <!-- Urgent Products -->
              <div class="bg-red-50 p-4 rounded-lg">
                <div class="text-2xl font-bold text-red-600">
                  {{ analytics.urgentProducts.length }}
                </div>
                <div class="text-sm text-gray-600">Produtos urgentes (hoje/amanhã)</div>
              </div>
            </div>

            <!-- Weekly Message -->
            <div v-if="analytics.productsExpiringThisWeek.length > 0" class="mt-4">
              <div class="text-lg font-semibold text-gray-800">
                Você tem {{ analytics.productsExpiringThisWeek.length }}
                {{
                  analytics.productsExpiringThisWeek.length === 1
                    ? 'produto vencendo'
                    : 'produtos vencendo'
                }}
                no período selecionado
              </div>
              <div v-if="analytics.urgentProducts.length > 0" class="text-red-600 font-medium mt-1">
                ⚠️ {{ analytics.urgentProducts.length }}
                {{
                  analytics.urgentProducts.length === 1 ? 'produto precisa' : 'produtos precisam'
                }}
                de atenção imediata!
              </div>
            </div>
            <div v-else class="mt-4">
              <div class="text-lg font-semibold text-green-600">
                ✅ Nenhum produto vencendo no período selecionado
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Chart Controls -->
    <div v-if="analytics?.productsExpiringThisWeek.length" class="mb-4">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Visualização dos Dados</h3>
          <p class="text-gray-600 text-sm">
            {{ selectedWeek?.label }} - {{ analytics.productsExpiringThisWeek.length }} produtos
          </p>
        </div>

        <div class="flex gap-2">
          <Button
            :outlined="chartType !== 'pie'"
            :severity="chartType === 'pie' ? 'primary' : 'secondary'"
            icon="pi pi-chart-pie"
            label="Pizza"
            size="small"
            @click="chartType = 'pie'"
          />
          <Button
            :outlined="chartType !== 'bar'"
            :severity="chartType === 'bar' ? 'primary' : 'secondary'"
            icon="pi pi-chart-bar"
            label="Barras"
            size="small"
            @click="chartType = 'bar'"
          />
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div v-if="analytics?.productsExpiringThisWeek.length">
      <Card>
        <template #content>
          <div class="chart-wrapper">
            <PieChart
              v-if="chartType === 'pie'"
              ref="pieChartRef"
              :week-offset="getWeekOffset()"
              :key="`pie-chart-${selectedWeek?.value}`"
            />
            <BarChart
              v-else-if="chartType === 'bar'"
              ref="barChartRef"
              :week-offset="getWeekOffset()"
              :key="`bar-chart-${selectedWeek?.value}`"
            />
          </div>
        </template>
      </Card>

      <!-- Products List -->
      <Card class="mt-6">
        <template #header>
          <div class="p-4 pb-0">
            <h3 class="text-lg font-semibold text-gray-800">Detalhes dos Produtos</h3>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in analytics.productsExpiringThisWeek"
              :key="item.product.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              :class="{
                'border-red-300 bg-red-50': item.isExpiringSoon || item.isExpired,
                'border-orange-300 bg-orange-50':
                  !item.isExpiringSoon && !item.isExpired && item.daysUntilExpiration <= 3,
                'border-gray-200': item.daysUntilExpiration > 3,
              }"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800 text-sm">{{ item.product.name }}</h4>
                <Badge
                  :value="item.product.quantity"
                  :severity="
                    item.product.quantity <= 2
                      ? 'danger'
                      : item.product.quantity <= 5
                        ? 'warning'
                        : 'success'
                  "
                />
              </div>
              <p class="text-xs text-gray-600 mb-2">{{ item.product.brand }}</p>
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-600">
                  {{ new Date(item.product.expirationDate).toLocaleDateString('pt-BR') }}
                </span>
                <span
                  :class="{
                    'text-red-600 font-bold': item.isExpired || item.isExpiringSoon,
                    'text-orange-600':
                      !item.isExpired && !item.isExpiringSoon && item.daysUntilExpiration <= 3,
                    'text-gray-600': item.daysUntilExpiration > 3,
                  }"
                >
                  {{ getDaysText(item.daysUntilExpiration) }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'
import PieChart from './PieChart.vue'
import BarChart from './BarChart.vue'
import {
  expirationAnalyticsService,
  type WeeklyExpirationData,
  type WeekOption,
} from '@/services/expiration-analytics.service'

const chartType = ref<'pie' | 'bar'>('pie')
const loading = ref(true)
const analytics = ref<WeeklyExpirationData | null>(null)
const selectedWeek = ref<WeekOption | null>(null)
const weekOptions = ref<WeekOption[]>([])

const pieChartRef = ref<InstanceType<typeof PieChart>>()
const barChartRef = ref<InstanceType<typeof BarChart>>()

const loadAnalytics = async () => {
  try {
    loading.value = true
    const weekOffset = getWeekOffset()
    analytics.value = await expirationAnalyticsService.getWeeklyExpirationAnalytics(weekOffset)
  } catch (error) {
    console.error('Error loading expiration analytics:', error)
  } finally {
    loading.value = false
  }
}

const getWeekOffset = (): number => {
  if (!selectedWeek.value) return 0
  return parseInt(selectedWeek.value.value.replace('week-', ''))
}

const refreshData = async () => {
  await loadAnalytics()

  // Refresh active chart
  const weekOffset = getWeekOffset()
  if (chartType.value === 'pie' && pieChartRef.value) {
    pieChartRef.value.refresh(weekOffset)
  } else if (chartType.value === 'bar' && barChartRef.value) {
    barChartRef.value.refresh(weekOffset)
  }
}

const getDaysText = (days: number): string => {
  if (days < 0) {
    const absDays = Math.abs(days)
    return `Vencido há ${absDays} ${absDays === 1 ? 'dia' : 'dias'}`
  } else if (days === 0) {
    return 'Vence hoje!'
  } else if (days === 1) {
    return 'Vence amanhã'
  } else {
    return `${days} dias restantes`
  }
}

// Watch for week selection changes
watch(selectedWeek, async () => {
  if (selectedWeek.value) {
    await refreshData()
  }
})

onMounted(async () => {
  // Load week options
  weekOptions.value = expirationAnalyticsService.getWeekOptions()
  selectedWeek.value = weekOptions.value[0] // Default to current week

  await loadAnalytics()
})
</script>

<style scoped>
.expiration-charts {
  width: 100%;
}

.chart-wrapper {
  min-height: 400px;
}
</style>
