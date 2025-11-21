<!-- pages/components/ExpensePieChart.vue -->
<template>
  <div class="expense-pie-chart">
    <div class="chart-container" ref="chartContainer">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="legend q-mt-md">
      <div v-for="(item, index) in props.data" :key="index" class="legend-item row items-center q-mb-xs">
        <div class="color-indicator q-mr-sm" :style="{ backgroundColor: item.color }"></div>
        <div class="text-caption">{{ item.name }} ({{ item.value }}%)</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartCanvas = ref(null)
const chartContainer = ref(null)
let chartInstance = null

onMounted(() => {
  renderChart()
})

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  renderChart()
})

const renderChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.data.map(item => item.name),
      datasets: [{
        data: props.data.map(item => item.value),
        backgroundColor: props.data.map(item => item.color),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`
            }
          }
        }
      },
      cutout: '60%'
    }
  })
}
</script>

<style scoped>
.expense-pie-chart {
  height: 300px;
}

.chart-container {
  height: 200px;
  position: relative;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-item {
  padding: 2px 0;
}
</style>