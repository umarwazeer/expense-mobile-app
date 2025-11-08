<template>
  <div class="q-pa-md">
    <div class="text-h5 text-bold text-indigo-8 q-mb-md">Statistics Overview</div>

    <div class="q-gutter-md">
      <q-card class="shadow-2">
        <q-card-section>
          <div class="text-subtitle2 text-grey">Total Income</div>
          <div class="text-h6 text-green-8">{{ totalIncome }} PKR</div>
        </q-card-section>
      </q-card>

      <q-card class="shadow-2">
        <q-card-section>
          <div class="text-subtitle2 text-grey">Total Expenses</div>
          <div class="text-h6 text-red-8">{{ totalExpense }} PKR</div>
        </q-card-section>
      </q-card>

      <q-card class="shadow-2">
        <q-card-section>
          <div class="text-subtitle2 text-grey">Balance</div>
          <div class="text-h6 text-blue-8">{{ totalBalance }} PKR</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-lg">
      <ReportChart title="Monthly Overview" :data="monthlyStats" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReportChart from 'pages/components/ReportChart.vue'

const totalIncome = ref(3200)
const totalExpense = ref(210)
const totalBalance = ref(totalIncome.value - totalExpense.value)
const monthlyStats = [1000, 2000, 1500, 2500, 1800, 3000]
</script>
