<template>
  <div>
    <div class="text-subtitle1 text-bold q-mb-sm">{{ title }}</div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const props = defineProps({
  title: String,
  data: Array
})

const canvas = ref(null)
let chart = null

onMounted(() => {
  chart = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Amount',
          data: props.data,
          backgroundColor: '#26A69A'
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
})

watch(() => props.data, (newVal) => {
  chart.data.datasets[0].data = newVal
  chart.update()
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}
</style>
