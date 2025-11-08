<template>
  <div class="q-pa-sm bg-grey-1" style="min-height: 100vh;">
    <q-card flat bordered class="shadow-2 rounded-borders">

      <!-- 🔹 Tabs Navigation -->
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-7"
        active-color="teal"
        indicator-color="teal"
        align="justify"
        narrow-indicator
      >
        <q-tab name="daily" label="Today" icon="calendar_today" />
        <q-tab name="weekly" label="This Week" icon="date_range" />
        <q-tab name="monthly" label="This Month" icon="event_note" />
        <q-tab name="custom" label="Custom Range" icon="timeline" />
      </q-tabs>

      <q-separator color="teal" size="2px" />

      <!-- 🔹 Tab Panels -->
      <q-tab-panels v-model="tab" animated>
        <!-- ✅ DAILY TAB -->
        <q-tab-panel name="daily" class="q-pa-sm">
          <div class="text-h6 text-teal-9 text-bold q-mb-sm">Daily Summary ({{ today }})</div>

          <q-card flat bordered class="q-mb-md bg-white">
            <q-card-section class="row justify-around text-center">
              <div>
                <div class="text-subtitle1 text-green-7 text-bold">{{ dailyData.income.toLocaleString() }}</div>
                <div class="text-caption text-grey">Income</div>
              </div>
              <div>
                <div class="text-subtitle1 text-red-6 text-bold">{{ dailyData.expense.toLocaleString() }}</div>
                <div class="text-caption text-grey">Expense</div>
              </div>
              <div>
                <div class="text-subtitle1 text-blue-7 text-bold">{{ dailyData.balance.toLocaleString() }}</div>
                <div class="text-caption text-grey">Net Balance</div>
              </div>
            </q-card-section>
          </q-card>

          <!-- 📊 ApexChart -->
          <apexchart
            width="100%"
            height="250"
            type="bar"
            :options="dailyChartOptions"
            :series="dailyChartSeries"
          />

          <!-- 📋 Transactions Table -->
          <q-separator class="q-my-sm" />
          <div class="text-subtitle1 text-grey-8 text-bold q-mb-xs">Today's Transactions</div>

          <q-table
            v-if="dailyData.transactions.length"
            :rows="dailyData.transactions"
            :columns="columns"
            row-key="description"
            flat
            bordered
            class="shadow-1"
          />
          <q-banner v-else class="bg-grey-3 text-grey-8 q-pa-sm">No transactions available.</q-banner>

          <!-- Export Buttons -->
          <div class="q-mt-md row justify-end q-gutter-sm">
            <q-btn color="teal" icon="download" label="Export CSV" @click="exportToCSV('daily')" flat />
            <q-btn color="red" icon="picture_as_pdf" label="Export PDF" @click="exportToPDF('daily')" flat />
          </div>
        </q-tab-panel>

        <!-- ✅ WEEKLY TAB -->
        <q-tab-panel name="weekly" class="q-pa-sm">
          <div class="text-h6 text-teal-9 text-bold q-mb-sm">Weekly Overview</div>

          <apexchart
            width="100%"
            height="260"
            type="line"
            :options="weeklyChartOptions"
            :series="weeklyChartSeries"
          />

          <q-expansion-item
            v-for="(week, i) in weeklyData"
            :key="i"
            :label="week.weekLabel"
            :caption="week.dates"
            icon="event"
            expand-separator
            dense
          >
            <q-card-section
              v-for="(t, j) in week.transactions"
              :key="j"
              class="row justify-between q-py-xs"
            >
              <div>{{ t.description }}</div>
              <div :class="t.type === 'income' ? 'text-green-7' : 'text-red-6'">
                {{ t.type === 'income' ? '+' : '-' }}{{ t.amount }}
              </div>
            </q-card-section>
          </q-expansion-item>

          <div class="q-mt-md row justify-end q-gutter-sm">
            <q-btn color="teal" icon="download" label="Export CSV" @click="exportToCSV('weekly')" flat />
            <q-btn color="red" icon="picture_as_pdf" label="Export PDF" @click="exportToPDF('weekly')" flat />
          </div>
        </q-tab-panel>

        <!-- ✅ MONTHLY TAB -->
        <q-tab-panel name="monthly" class="q-pa-sm">
          <div class="text-h6 text-teal-9 text-bold q-mb-sm">Monthly Summary ({{ currentMonth }})</div>

          <apexchart
            width="100%"
            height="260"
            type="area"
            :options="monthlyChartOptions"
            :series="monthlyChartSeries"
          />

          <q-separator class="q-my-sm" />
          <div class="text-subtitle1 text-grey-8 text-bold">Category Breakdown</div>
          <div class="q-gutter-sm q-mt-sm">
            <q-chip
              v-for="(item, i) in monthlyData.categories"
              :key="i"
              :color="item.color"
              text-color="white"
              :icon="item.icon"
            >
              {{ item.label }}: {{ item.amount }}
            </q-chip>
          </div>

          <div class="q-mt-md row justify-end q-gutter-sm">
            <q-btn color="teal" icon="download" label="Export CSV" @click="exportToCSV('monthly')" flat />
            <q-btn color="red" icon="picture_as_pdf" label="Export PDF" @click="exportToPDF('monthly')" flat />
          </div>
        </q-tab-panel>

        <!-- ✅ CUSTOM RANGE TAB -->
        <q-tab-panel name="custom" class="q-pa-sm">
          <div class="text-h6 text-teal-9 text-bold q-mb-sm">Custom Range Report</div>

          <q-input filled dense v-model="customDate" label="Select Date Range" class="q-mb-md">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date range v-model="customDate" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-card v-if="customDate" flat bordered class="bg-white q-pa-md text-center">
            <div class="text-subtitle1 text-green-7 text-bold">Income: {{ customReport.income }}</div>
            <div class="text-subtitle1 text-red-6 text-bold">Expense: {{ customReport.expense }}</div>
            <div class="text-subtitle1 text-blue-8 text-bold q-mt-sm">Balance: {{ customReport.balance }}</div>
          </q-card>

          <div class="q-mt-md row justify-end q-gutter-sm">
            <q-btn color="teal" icon="download" label="Export CSV" @click="exportToCSV('custom')" flat />
            <q-btn color="red" icon="picture_as_pdf" label="Export PDF" @click="exportToPDF('custom')" flat />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- 🤖 AI Insights Panel -->
    <q-card flat bordered class="q-mt-md q-pa-md shadow-1 bg-white">
      <div class="text-h6 text-teal-8 text-bold q-mb-sm">AI Insights</div>
      <div class="text-body2 text-grey-8">
        Top Spending Category: <b>{{ aiInsights.topCategory }}</b><br>
        Trend: <b>{{ aiInsights.trend }}</b><br>
        Next Month Projection: <b>{{ aiInsights.nextMonthProjection }}</b>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import apexchart from 'vue3-apexcharts'

const tab = ref('daily')
const today = new Date().toDateString()
const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
const customDate = ref(null)

// Table Columns
const columns = ref([
  { name: 'description', label: 'Description', field: 'description', align: 'left', sortable: true },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'center' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' }
])

// Daily Data
const dailyData = ref({
  income: 3200,
  expense: 1800,
  balance: 1400,
  transactions: [
    { description: 'Salary Credit', category: 'Job', type: 'income', amount: 3000 },
    { description: 'Coffee', category: 'Food', type: 'expense', amount: 120 },
    { description: 'Taxi', category: 'Transport', type: 'expense', amount: 80 },
    { description: 'Bonus', category: 'Bonus', type: 'income', amount: 200 }
  ]
})

// Weekly Data
const weeklyData = ref([
  {
    weekLabel: 'Week 1',
    dates: 'Oct 1 - Oct 7',
    income: 9000,
    expense: 6200,
    transactions: [
      { description: 'Freelance Work', amount: 3000, type: 'income' },
      { description: 'Groceries', amount: 1000, type: 'expense' },
      { description: 'Dining Out', amount: 800, type: 'expense' }
    ]
  },
  {
    weekLabel: 'Week 2',
    dates: 'Oct 8 - Oct 14',
    income: 8000,
    expense: 4000,
    transactions: [
      { description: 'Salary', amount: 5000, type: 'income' },
      { description: 'Fuel', amount: 1200, type: 'expense' },
      { description: 'Shopping', amount: 1800, type: 'expense' }
    ]
  }
])

// Monthly Data
const monthlyData = ref({
  categories: [
    { label: 'Food', amount: 12000, icon: 'restaurant', color: 'red-5' },
    { label: 'Transport', amount: 5500, icon: 'commute', color: 'blue-5' },
    { label: 'Rent', amount: 10000, icon: 'home', color: 'green-6' },
    { label: 'Leisure', amount: 4000, icon: 'sports_soccer', color: 'orange-5' }
  ]
})

// Custom Data
const customReport = ref({ income: 12800, expense: 9200, balance: 3600 })

// AI Insights
const aiInsights = ref({
  topCategory: 'Food',
  trend: 'Spending up 12% from last month',
  nextMonthProjection: 'Expected to save 18% more if trend continues'
})

// ApexCharts Config
const dailyChartOptions = {
  chart: { toolbar: { show: false } },
  xaxis: { categories: ['Morning', 'Afternoon', 'Evening'] },
  colors: ['#4CAF50', '#F44336']
}
const dailyChartSeries = [
  { name: 'Income', data: [1800, 1000, 400] },
  { name: 'Expense', data: [800, 700, 300] }
]

const weeklyChartOptions = {
  chart: { toolbar: { show: false } },
  xaxis: { categories: weeklyData.value.map(w => w.weekLabel) },
  colors: ['#26A69A', '#E53935']
}
const weeklyChartSeries = [
  { name: 'Income', data: weeklyData.value.map(w => w.income) },
  { name: 'Expense', data: weeklyData.value.map(w => w.expense) }
]

const monthlyChartOptions = {
  chart: { toolbar: { show: false } },
  xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
  colors: ['#66BB6A', '#EF5350']
}
const monthlyChartSeries = [
  { name: 'Income', data: [12000, 14000, 15000, 11000] },
  { name: 'Expense', data: [9500, 8700, 9800, 8500] }
]

// ✅ Export Handlers
const exportToCSV = (section) => {
  let data = []
  if (section === 'daily') data = dailyData.value.transactions
  if (section === 'weekly') data = weeklyData.value.flatMap(w => w.transactions)
  if (section === 'monthly') data = monthlyData.value.categories
  if (section === 'custom') data = [customReport.value]

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(r => Object.values(r).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${section}_report.csv`
  link.click()
}

const exportToPDF = (section) => {
  const doc = new jsPDF()
  doc.text(`${section.toUpperCase()} REPORT`, 14, 10)
  let data = []
  if (section === 'daily') data = dailyData.value.transactions
  if (section === 'weekly') data = weeklyData.value.flatMap(w => w.transactions)
  if (section === 'monthly') data = monthlyData.value.categories
  if (section === 'custom') data = [customReport.value]
  doc.autoTable({ body: data.map(obj => Object.values(obj)), head: [Object.keys(data[0])] })
  doc.save(`${section}_report.pdf`)
}
</script>

<style scoped>
.rounded-borders { border-radius: 12px; }
.bg-grey-1 { background-color: #f5f5f5; }
</style>
