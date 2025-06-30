<template>
  <div class="chart-container">
    <Bar v-if="loaded && chartData.labels.length > 0" :data="chartData" :options="chartOptions" :plugins="plugins" />
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
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import ProgressSpinner from 'primevue/progressspinner'
import { expiringStockService } from '@/services/expiring-stock.service'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  weekOffset?: number
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  weekOffset: 0,
  title: 'Quantidade por Data de Vencimento',
  xAxisLabel: 'Data de Vencimento',
  yAxisLabel: 'Quantidade',
})

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [],
})

const loaded = ref(false)
const loading = ref(false)

const chartOptions = ref<ChartOptions<'bar'>>({
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
      position: 'top',
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
          const label = context.dataset.label || ''
          const value = context.parsed.y
          return `${label}: ${value} unidades`
        },
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: props.xAxisLabel,
        color: '#374151',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#374151',
        font: {
          size: 11,
        },
      },
    },
    y: {
      title: {
        display: true,
        text: props.yAxisLabel,
        color: '#374151',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#374151',
        font: {
          size: 11,
        },
        beginAtZero: true,
      },
    },
  },
  elements: {
    bar: {
      borderWidth: 2,
      borderRadius: 4,
    },
  },
})

const plugins = [
  {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart: ChartJS<'bar'>) => {
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
    const data = await expiringStockService.getBarChartData(props.weekOffset)
    chartData.value = data
    loaded.value = true
  } catch (error) {
    console.error('Error loading bar chart data:', error)
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