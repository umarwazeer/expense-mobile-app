<template>
  <q-page class="bg-grey-2 q-pa-sm">

    <!-- 🔹 Balance Summary -->
    <q-card class="q-pa-md q-mt-sm shadow-2 bg-white rounded-borders">
      <div class="text-center">
        <div class="text-h5 text-bold text-primary">{{ balance.toLocaleString() }}</div>
        <div class="text-caption text-grey">Current Balance</div>
      </div>

      <div class="row justify-around q-mt-md text-center">
        <div>
          <div class="text-subtitle1 text-green-8 text-bold">{{ income.toLocaleString() }}</div>
          <div class="text-caption text-grey">
            <q-icon name="arrow_upward" color="green" size="16px" /> Income
          </div>
        </div>
        <div>
          <div class="text-subtitle1 text-red-8 text-bold">{{ expense.toLocaleString() }}</div>
          <div class="text-caption text-grey">
            <q-icon name="arrow_downward" color="red" size="16px" /> Expense
          </div>
        </div>
      </div>
    </q-card>

    <!-- 🔹 Recent Transactions -->
    <div class="q-mt-md">
      <div class="text-subtitle1 text-weight-bold q-ml-sm q-mb-xs">Recent Transactions</div>

      <q-card
        v-for="(tx, index) in transactions"
        :key="index"
        class="q-mb-sm shadow-1 bg-white rounded-borders q-pa-sm"
      >
        <div class="row items-center justify-between">
          <div class="row items-center">
            <q-avatar size="40px" class="q-mr-sm">
              <img :src="tx.avatar" />
            </q-avatar>
            <div>
              <div class="text-body1 text-weight-medium">{{ tx.date }}</div>
              <div class="text-caption text-grey">{{ tx.day }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-green-8 text-weight-bold">
              +{{ tx.income.toLocaleString() }}
            </div>
            <div class="text-red-8 text-weight-bold">
              -{{ tx.expense.toLocaleString() }}
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- 🔹 Bottom Floating Add Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        color="primary"
        icon="add"
        @click="showAdvanceForm = true"
      />
    </q-page-sticky>

    <!-- 🔹 Add Entry Dialog -->
    <q-dialog v-model="showAdvanceForm" persistent maximized>
      <advanceForm @close="showAdvanceForm = false" />
    </q-dialog>

    <!-- 🔹 Bottom Navigation -->
    <q-footer elevated class="bg-white text-dark q-pa-xs">
      <div class="row justify-around text-center">
        <q-btn flat round icon="home" label="Home" @click="$router.push({ name: 'home' })" />
        <q-btn flat round icon="bar_chart" label="Stats" @click="$router.push({ name: 'stats' })" />
        <q-btn flat round icon="receipt_long" label="Report" @click="$router.push({ name: 'report' })" />
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import advanceForm from '../pages/components/advanceForm.vue'

export default {
  components: { advanceForm },
  data() {
    return {
      showAdvanceForm: false,
      balance: 10500,
      income: 200342,
      expense: 30342,
      transactions: [
        {
          date: 'Oct 17, 2025',
          day: 'Friday',
          avatar: 'https://cdn.quasar.dev/img/avatar.png',
          income: 3200,
          expense: 210,
        },
        {
          date: 'Oct 18, 2025',
          day: 'Saturday',
          avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
          income: 500,
          expense: 150,
        }
      ]
    }
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 14px;
}
.q-footer {
  border-top: 1px solid #e0e0e0;
}
</style>
  