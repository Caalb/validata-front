<template>
  <div class="chart-container">
    <Bar v-if="loaded" :data="chartData" :options="chartOptions" :plugins="plugins" />
    <div v-else class="flex items-center justify-center h-64">
      <ProgressSpinner />
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  data?: ChartData<'bar'>
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Gráfico de Barras',
  xAxisLabel: 'Categoria',
  yAxisLabel: 'Valor',
})

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [],
})

const loaded = ref(false)

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
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed.y
          return `${value}`
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
        font: {
          size: 12,
          weight: 'bold',
        },
        color: '#6B7280',
      },
      grid: {
        display: false,
      },
      ticks: {
        color: '#6B7280',
      },
    },
    y: {
      title: {
        display: true,
        text: props.yAxisLabel,
        font: {
          size: 12,
          weight: 'bold',
        },
        color: '#6B7280',
      },
      beginAtZero: true,
      ticks: {
        color: '#6B7280',
      },
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
      },
    },
  },
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false,
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

const updateChartData = () => {
  if (props.data) {
    chartData.value = props.data
    loaded.value = true
  }
}

watch(() => props.data, updateChartData, { deep: true })

onMounted(() => {
  updateChartData()
})

defineExpose({
  refresh: updateChartData,
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
