  <template>
    <div class="q-pa-md statistics-page">
      <div class="text-h5 text-bold text-indigo-8 q-mb-lg">Statistics Overview</div>

      <!-- Summary Cards -->
      <div class="row q-col-gutter-md">
        
        <!-- Total Income Card -->
        <div class="col-12 col-md-4">
          <q-card class="shadow-4">
            <q-card-section>
              <div class="text-subtitle2 text-grey-7 q-mb-xs">Total Income</div>
              <div class="text-h5 text-weight-bolder text-green-8">
                {{ totalIncome.toLocaleString() }} PKR
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Total Expenses Card -->
        <div class="col-12 col-md-4">
          <q-card class="shadow-4">
            <q-card-section>
              <div class="text-subtitle2 text-grey-7 q-mb-xs">Total Expenses</div>
              <div class="text-h5 text-weight-bolder text-red-8">
                {{ totalExpense.toLocaleString() }} PKR
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Balance Card -->
        <div class="col-12 col-md-4">
          <q-card :class="['shadow-4', totalBalance >= 0 ? 'bg-blue-1' : 'bg-red-1']">
            <q-card-section>
              <div class="text-subtitle2 text-grey-7 q-mb-xs">Balance</div>
              <div :class="['text-h5 text-weight-bolder', totalBalance >= 0 ? 'text-blue-8' : 'text-red-8']">
                {{ totalBalance.toLocaleString() }} PKR
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="q-mt-xl">
        <q-card class="shadow-4">
          <q-card-section>
            <!-- ReportChart assumes it is properly implemented in the specified path -->
            <ReportChart title="Monthly Overview (Last 6 Months)" :data="monthlyStats" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Optional: Detailed Analysis Section (Placeholder) -->
      <div class="q-mt-xl">
          <div class="text-h6 text-indigo-7 q-mb-md">Recent Trend Analysis</div>
          <q-list bordered separator>
              <q-item>
                  <q-item-section avatar>
                      <q-icon name="trending_up" color="green-6" />
                  </q-item-section>
                  <q-item-section>Income increased by 15% this month.</q-item-section>
              </q-item>
              <q-item>
                  <q-item-section avatar>
                      <q-icon name="receipt" color="red-6" />
                  </q-item-section>
                  <q-item-section>Highest expense category: Supplies (40% of total expenses).</q-item-section>
              </q-item>
          </q-list>
      </div>

    </div>
  </template>

  <script setup>
  import { ref, computed } from 'vue'
  // Ensure this path is correct relative to where this component is located
  import ReportChart from 'pages/components/ReportChart.vue' 

  // 1. Reactive State Definition
  const totalIncome = ref(320000) // Updated dummy data for realism
  const totalExpense = ref(210000)

  // 2. Computed Property for Dynamic Balance
  // Use computed to ensure totalBalance updates automatically if income or expenses change
  const totalBalance = computed(() => totalIncome.value - totalExpense.value)

  // 3. Data for the Chart Component (e.g., Income/Revenue over 6 months)
  // This array should ideally be structured data required by ReportChart (e.g., labels, datasets)
  // Assuming ReportChart expects an array of values for a simple bar/line chart:
  const monthlyStats = [
      100000, // Month 1
      200000, // Month 2
      150000, // Month 3
      250000, // Month 4
      180000, // Month 5
      300000  // Current Month (Month 6)
  ]

  // Note on ReportChart: 
  // The ReportChart component must be created separately and handle the display 
  // of the monthlyStats data (e.g., using Chart.js or Echarts within the component).

  </script>

  <style scoped>
  .statistics-page {
    max-width: 1200px;
    margin: 0 auto;
  }
  .shadow-4 {
      transition: transform 0.2s ease-in-out;
  }
  .shadow-4:hover {
      transform: translateY(-2px);
  }
  </style>