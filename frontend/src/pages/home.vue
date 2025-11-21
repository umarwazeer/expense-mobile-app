<template>
  <q-page class="bg-grey-2">
    <!-- Header with Dark Mode Toggle -->
    <header class="gradient-bg text-white p-4 pb-6 header-text">
      <!-- <div class="flex justify-between items-center mb-4">
        <div>
          <h1 class="text-xl font-bold">Expense Tracker</h1>
          <p class="text-sm opacity-90">{{ currentDate }}</p>
        </div>
        <q-btn 
          round 
          dense 
          class="bg-white bg-opacity-20 backdrop-blur" 
          @click="toggleDarkMode"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
        />
      </div>
       -->
      <!-- Balance Card -->
      <q-card class="bg-white bg-opacity-20 backdrop-blur rounded-2xl p-4 card-shadow">
        <div class="text-center">
        <div class="text-sm opacity-90 mb-1 balance-title">Current Balance</div>
        <div class="text-3xl font-bold balance-amount">{{ formatCurrency(balance) }}</div>
          <div class="flex justify-around mt-4">
            <div class="text-center">
             <div class="income-text">+{{ formatCurrency(income) }}</div>
             <div class="income-label text-xs opacity-75">Income</div>
            </div>
            <div class="text-center">
              <div class="expense-text">-{{ formatCurrency(expense) }}</div>
              <div class="expense-label text-xs opacity-75">Expenses</div>
            </div>
          </div>
        </div>
      </q-card>
    </header>

    <!-- Main Content -->
    <main class="p-4 mt-1">
      
      <!-- Feature Buttons -->
      <div class="grid grid-cols-4 gap-3 mb-6">
        <q-btn 
          v-for="feature in features" 
          :key="feature.name"
          class="feature-btn bg-white rounded-xl p-3 card-shadow text-center"
          @click="showNotification(`${feature.name} coming soon!`, 'info')"
          flat
        >
          <div class="column items-center">
            <q-icon :name="feature.icon" :color="feature.color" size="2rem" class="mb-1" />
            <div class="text-xs font-medium text-dark">{{ feature.name }}</div>
          </div>
        </q-btn>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <q-card 
          v-for="stat in quickStats" 
          :key="stat.label"
          class="p-3 card-shadow"
        >
          <div class="text-2xl font-bold" :class="`text-${stat.color}-600`">{{ stat.value }}</div>
          <div class="text-xs text-grey-500">{{ stat.label }}</div>
        </q-card>
      </div>

      <!-- Transaction Filters -->
      <q-card class="bg-white rounded-xl p-1 mb-4 card-shadow">
        <div class="row">
          <q-btn
            v-for="filter in filters"
            :key="filter.value"
            :label="filter.label"
            class="col filter-btn text-sm font-medium rounded-lg"
            :class="activeFilter === filter.value ? 'bg-indigo-600 text-white' : 'text-grey-600'"
            @click="setFilter(filter.value)"
            flat
            dense
          />
        </div>
      </q-card>

      <!-- Grouped Transactions -->
      <div class="mb-20" id="transactionsContainer">
        <q-card
          v-for="group in filteredTransactionGroups" 
          :key="group.date"
          class="date-group bg-white rounded-xl mb-3 card-shadow overflow-hidden"
        >
          <!-- Date Header -->
          <div 
            class="flex items-center justify-between p-4 cursor-pointer"
            @click="toggleGroup(group.date)"
          >
            <div class="flex items-center">
              <q-avatar 
                :color="group.isToday ? 'indigo-6' : 'grey-4'" 
                text-color="white" 
                size="48px"
                class="mr-3"
              >
                <span class="text-sm font-bold">{{ group.dateNumber }}</span>
              </q-avatar>
              <div>
                <div class="font-semibold">{{ group.displayDate }}</div>
                <div class="text-xs text-grey-500">{{ group.dayName }}</div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="text-right mr-3">
                <div class="text-green-600 font-semibold text-sm">+{{ formatCurrency(group.dailyIncome) }}</div>
                <div class="text-red-600 font-semibold text-sm">-{{ formatCurrency(group.dailyExpense) }}</div>
              </div>
              <q-icon 
                name="expand_more" 
                class="expand-icon text-grey-400 transition-transform"
                :class="{ 'rotate-180': expandedGroups.includes(group.date) }"
              />
            </div>
          </div>
          
          <!-- Transaction Details -->
          <q-slide-transition>
            <div v-show="expandedGroups.includes(group.date)">
              <q-separator />
              <div class="border-t border-grey-100">
                <div
                  v-for="(transaction, index) in group.transactions"
                  :key="index"
                  class="transaction-item bg-white p-4 row items-center justify-between"
                  v-ripple
                >
                  <div class="row items-center">
                    <q-avatar 
                      :color="`${getCategoryColor(transaction.category)}-1`" 
                      text-color="white" 
                      size="40px"
                      class="mr-3"
                    >
                      <q-icon :name="getCategoryIcon(transaction.category)" :color="getCategoryColor(transaction.category)" />
                    </q-avatar>
                    <div>
                      <div class="font-medium text-sm">{{ transaction.description }}</div>
                      <div class="text-xs text-grey-500">{{ transaction.paymentMethod }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div 
                      class="font-bold"
                      :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </main>

    <!-- Floating Add Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 80]">
      <q-btn 
        fab 
        color="indigo" 
        icon="add" 
        class="floating-btn"
        @click="showAddModal = true"
      />
    </q-page-sticky>

    <!-- Add Transaction Dialog -->
    <q-dialog v-model="showAddModal" position="bottom" maximized>
      <q-card class="bg-white rounded-t-3xl" style="max-height: 90vh">
        <div class="w-12 h-1 bg-grey-300 rounded-full mx-auto mt-3 mb-6" />
        
        <q-card-section>
          <h3 class="text-xl font-bold mb-6">Add Transaction</h3>
          
          <q-form @submit="addTransaction" class="q-gutter-md">
            <!-- Transaction Type -->
            <div>
              <label class="block text-sm font-medium mb-2">Type</label>
              <div class="row q-gutter-sm">
                <q-btn
                  label="Expense"
                  class="col"
                  :color="transactionType === 'expense' ? 'red' : 'grey-4'"
                  :text-color="transactionType === 'expense' ? 'white' : 'dark'"
                  @click="transactionType = 'expense'"
                />
                <q-btn
                  label="Income"
                  class="col"
                  :color="transactionType === 'income' ? 'green' : 'grey-4'"
                  :text-color="transactionType === 'income' ? 'white' : 'dark'"
                  @click="transactionType = 'income'"
                />
              </div>
            </div>
            
            <!-- Amount -->
            <q-input
              v-model.number="newTransaction.amount"
              type="number"
              label="Amount"
              placeholder="0.00"
              :rules="[val => !!val || 'Amount is required']"
              prefix="$"
              step="0.01"
              filled
            />
            
            <!-- Category -->
            <q-select
              v-model="newTransaction.category"
              :options="categoryOptions"
              label="Category"
              :rules="[val => !!val || 'Category is required']"
              filled
            />
            
            <!-- Description -->
            <q-input
              v-model="newTransaction.description"
              label="Description"
              placeholder="Enter description"
              filled
            />
            
            <!-- Buttons -->
            <div class="row q-gutter-sm q-mt-lg">
              <q-btn
                label="Cancel"
                class="col"
                color="grey-4"
                text-color="dark"
                @click="showAddModal = false"
              />
              <q-btn
                label="Add Transaction"
                type="submit"
                class="col"
                color="indigo"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Bottom Navigation -->
    <q-footer elevated class="bg-white text-dark q-pa-xs">
      <div class="row justify-around text-center">
        <q-btn 
          flat 
          round 
          icon="home" 
          label="Home" 
          color="indigo"
          @click="$router.push({ name: 'home' })"
        />
        <q-btn 
          flat 
          round 
          icon="bar_chart" 
          label="Stats" 
          color="grey-6"
          @click="$router.push({ name: 'stats' })"
        />
        <q-btn 
          flat 
          round 
          icon="receipt_long" 
          label="Report" 
          color="grey-6"
          @click="$router.push({ name: 'report' })"
        />
        <q-btn 
          flat 
          round 
          icon="person" 
          label="Profile" 
          color="grey-6"
          @click="$router.push({ name: 'profile' })"
        />
      </div>
    </q-footer>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State
const currentDate = ref('')
const balance = ref(10500)
const income = ref(200342)
const expense = ref(30342)
const showAddModal = ref(false)
const activeFilter = ref('all')
const transactionType = ref('expense')
const expandedGroups = ref(['today'])

// New transaction form
const newTransaction = ref({
  amount: null,
  category: '',
  description: '',
  paymentMethod: 'Bank'
})

// Features
const features = [
  { name: 'Stats', icon: 'pie_chart', color: 'purple' },
  { name: 'Budget', icon: 'target', color: 'blue' },
  { name: 'Goals', icon: 'savings', color: 'green' },
  { name: 'CategoryPage', icon: 'category', color: 'orange' }
]

// Quick Stats
const quickStats = [
  { value: '68%', label: 'Savings Rate', color: 'blue' },
  { value: '$245', label: 'Daily Avg', color: 'purple' },
  { value: '24', label: 'Transactions', color: 'orange' }
]

// Filters
const filters = [
  { label: 'Show All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' }
]

// Categories
const categoryOptions = [
  { label: 'Food & Dining', value: 'food' },
  { label: 'Transport', value: 'transport' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Bills & Utilities', value: 'bills' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Salary', value: 'salary' },
  { label: 'Other', value: 'other' }
]

// Transaction Groups
const transactionGroups = ref([
  {
    date: 'today',
    dateNumber: new Date().getDate(),
    displayDate: 'Today',
    dayName: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    dailyIncome: 3200,
    dailyExpense: 127.49,
    isToday: true,
    transactions: [
      { amount: 3200, category: 'salary', description: 'Salary Deposit', paymentMethod: 'Bank Transfer', type: 'income' },
      { amount: 12.50, category: 'food', description: 'Starbucks Coffee', paymentMethod: 'Credit Card', type: 'expense' },
      { amount: 89.99, category: 'shopping', description: 'Amazon Purchase', paymentMethod: 'Debit Card', type: 'expense' },
      { amount: 25.00, category: 'transport', description: 'Uber Ride', paymentMethod: 'PayPal', type: 'expense' }
    ]
  },
  {
    date: 'yesterday',
    dateNumber: new Date().getDate() - 1,
    displayDate: 'Yesterday',
    dayName: 'Yesterday',
    dailyIncome: 500,
    dailyExpense: 156.75,
    isToday: false,
    transactions: [
      { amount: 500, category: 'salary', description: 'Freelance Payment', paymentMethod: 'PayPal', type: 'income' },
      { amount: 85.00, category: 'bills', description: 'Electricity Bill', paymentMethod: 'Auto Pay', type: 'expense' },
      { amount: 21.75, category: 'food', description: 'McDonald\'s', paymentMethod: 'Cash', type: 'expense' },
      { amount: 50.00, category: 'transport', description: 'Gas Station', paymentMethod: 'Credit Card', type: 'expense' }
    ]
  },
  {
    date: 'older',
    dateNumber: new Date().getDate() - 2,
    displayDate: new Date(Date.now() - 2 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    dayName: new Date(Date.now() - 2 * 86400000).toLocaleDateString('en-US', { weekday: 'long' }),
    dailyIncome: 0,
    dailyExpense: 234.50,
    isToday: false,
    transactions: [
      { amount: 89.50, category: 'shopping', description: 'Clothing Store', paymentMethod: 'Debit Card', type: 'expense' },
      { amount: 45.00, category: 'bills', description: 'Gym Membership', paymentMethod: 'Auto Pay', type: 'expense' },
      { amount: 100.00, category: 'bills', description: 'Internet Bill', paymentMethod: 'Online Payment', type: 'expense' }
    ]
  }
])

// Computed
const filteredTransactionGroups = computed(() => {
  if (activeFilter.value === 'all') {
    return transactionGroups.value
  } else if (activeFilter.value === 'today') {
    return transactionGroups.value.filter(g => g.date === 'today')
  } else if (activeFilter.value === 'yesterday') {
    return transactionGroups.value.filter(g => g.date === 'yesterday')
  }
  return transactionGroups.value
})

// Methods
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function toggleDarkMode() {
  $q.dark.toggle()
}

function setFilter(filter) {
  activeFilter.value = filter
}

function toggleGroup(date) {
  const index = expandedGroups.value.indexOf(date)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(date)
  }
}

function getCategoryIcon(category) {
  const icons = {
    food: 'restaurant',
    transport: 'directions_bus',
    shopping: 'shopping_bag',
    bills: 'receipt',
    entertainment: 'movie',
    salary: 'payments',
    other: 'label'
  }
  return icons[category] || 'label'
}

function getCategoryColor(category) {
  const colors = {
    food: 'blue',
    transport: 'green',
    shopping: 'purple',
    bills: 'orange',
    entertainment: 'pink',
    salary: 'green',
    other: 'grey'
  }
  return colors[category] || 'grey'
}

function addTransaction() {
  if (!newTransaction.value.amount || !newTransaction.value.category) {
    showNotification('Please fill all required fields', 'negative')
    return
  }

  const todayGroup = transactionGroups.value.find(g => g.date === 'today')
  if (todayGroup) {
    const newTx = {
      amount: newTransaction.value.amount,
      category: newTransaction.value.category.value || newTransaction.value.category,
      description: newTransaction.value.description || newTransaction.value.category.label,
      paymentMethod: newTransaction.value.paymentMethod,
      type: transactionType.value
    }
    
    todayGroup.transactions.unshift(newTx)
    
    if (transactionType.value === 'income') {
      todayGroup.dailyIncome += newTransaction.value.amount
      income.value += newTransaction.value.amount
      balance.value += newTransaction.value.amount
    } else {
      todayGroup.dailyExpense += newTransaction.value.amount
      expense.value += newTransaction.value.amount
      balance.value -= newTransaction.value.amount
    }
  }

  showAddModal.value = false
  newTransaction.value = { amount: null, category: '', description: '', paymentMethod: 'Bank' }
  showNotification('Transaction added successfully!', 'positive')
}

function showNotification(message, type) {
  $q.notify({
    message,
    type,
    position: 'top',
    timeout: 3000
  })
}

// Lifecycle
onMounted(() => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
/* 🔥 GLOBAL TEXT COLOR FIXES FOR DARK HEADER */
.header-text,
.gradient-bg *,
.gradient-bg .q-card,

/* Filter Buttons Text Fix */
.filter-btn {
  font-weight: 600;
  color: #374151 !important;
}
.filter-btn.bg-indigo-600 {
  color: white !important;
}

/* Transaction List Colors */
.transaction-item .font-medium {
  color: #111827 !important;
}
.transaction-item .text-xs {
  color: #6b7280 !important;
}
.transaction-item .font-bold {
  font-weight: 700 !important;
}

/* Date Group Header Text */
.date-group .font-semibold {
  color: #1f2937 !important;
}
.date-group .text-xs {
  color: #6b7280 !important;
}

/* Quick Stats Cards */
.q-card .text-2xl {
  font-weight: 800 !important;
}
.q-card .text-xs {
  color: #6b7280 !important;
}


.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-shadow {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.transaction-item {
  transition: all 0.3s ease;
}

.transaction-item:active {
  transform: scale(0.98);
}

.floating-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.feature-btn:active {
  transform: scale(0.95);
}

.rotate-180 {
  transform: rotate(180deg);
}

:deep(.q-dialog__inner) {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}
</style>