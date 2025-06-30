<template>
  <div class="chart-container">
    <Pie v-if="loaded && chartData.labels.length > 0" :data="chartData" :options="chartOptions" :plugins="plugins" />
    <div v-else-if="loading" class="flex items-center justify-center h-64">
      <ProgressSpinner />
    </div>
    <div v-else class="flex items-center justify-center h-64">
      <div class="text-center">
        <i class="pi pi-info-circle text-gray-400 text-4xl mb-3"></i>
        <p class="text-gray-600">Nenhum produto vencendo no período</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Pie } from 'vue-chartjs'
import ProgressSpinner from 'primevue/progressspinner'
import { expiringStockService } from '@/services/expiring-stock.service'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

interface Props {
  weekOffset?: number
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  weekOffset: 0,
  title: 'Produtos por Vencimento',
})

const chartData = ref<ChartData<'pie'>>({
  labels: [],
  datasets: [],
})

const loaded = ref(false)
const loading = ref(false)

const chartOptions = ref<ChartOptions<'pie'>>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: props.title,
      font: {
        size: 16,
        weight: 'bold',
      },
      color: '#374151',
    },
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
        },
        color: '#374151',
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value} unidades (${percentage}%)`
        },
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
    },
  },
  elements: {
    arc: {
      borderWidth: 2,
    },
  },
})

const plugins = [
  {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart: ChartJS<'pie'>) => {
      const { ctx } = chart
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, chart.width, chart.height)
      ctx.restore()
    },
  },
]

const loadChartData = async () => {
  loading.value = true
  loaded.value = false
  
  try {
    const data = await expiringStockService.getPieChartData(props.weekOffset)
    chartData.value = data
    loaded.value = true
  } catch (error) {
    console.error('Error loading pie chart data:', error)
  } finally {
    loading.value = false
  }
}

const refresh = async (weekOffset?: number) => {
  if (weekOffset !== undefined) {
    // Update props internally if needed
    await loadChartData()
  } else {
    await loadChartData()
  }
}

watch(() => props.weekOffset, loadChartData, { immediate: false })

onMounted(() => {
  loadChartData()
})

defineExpose({
  refresh,
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 400px;
}
</style>