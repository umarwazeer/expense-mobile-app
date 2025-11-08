<template>
  <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4 mt-8">
    <h2 class="text-2xl font-semibold text-center text-gray-800">
      💰 Add New Entry
    </h2>

    <!-- Type Selector -->
    <q-segmented v-model="form.type" dense>
      <q-segment label="Income" value="income" />
      <q-segment label="Expense" value="expense" />
    </q-segmented>

    <!-- Date Picker -->
    <q-input filled dense v-model="form.date" label="Date" :rules="[v => !!v || 'Required']">
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="form.date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" flat color="primary" />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Amount Input -->
    <q-input
      type="number"
      filled
      dense
      v-model.number="form.amount"
      label="Amount"
      prefix="₹"
      :rules="[v => v > 0 || 'Enter valid amount']"
    />

    <!-- Category Select -->
    <q-select
      filled
      v-model="form.category"
      :options="categories"
      :label="`Select ${form.type.charAt(0).toUpperCase() + form.type.slice(1)} Category`"
      :rules="[v => !!v || 'Select a category']"
    />

    <!-- Comment -->
    <q-input filled dense type="textarea" v-model="form.comment" label="Notes (optional)">
      <template #prepend>
        <q-icon name="comment" />
      </template>
    </q-input>

    <!-- Submit -->
    <q-btn
      color="cyan-8"
      label="Add Entry"
      class="w-full text-white font-semibold py-2 rounded-md"
      @click="submitForm"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = ref({
  type: 'income',
  date: new Date().toISOString().slice(0, 10),
  amount: null,
  category: '',
  comment: '',
})

const incomeCategories = ['Salary', 'Bonus', 'Freelance', 'Investments', 'Gifts', 'Other']
const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other']

const categories = ref([...incomeCategories])

watch(() => form.value.type, (newType) => {
  categories.value = newType === 'income' ? incomeCategories : expenseCategories
  form.value.category = ''
})

const submitForm = () => {
  if (!form.value.amount || !form.value.category || !form.value.date) {
    $q.notify({
      type: 'negative',
      message: 'Please fill all required fields',
    })
    return
  }

  const existing = JSON.parse(localStorage.getItem('entries') || '[]')
  existing.push({ ...form.value, id: Date.now() })
  localStorage.setItem('entries', JSON.stringify(existing))

  $q.notify({
    type: 'positive',
    message: 'Entry added successfully!',
  })

  form.value = {
    type: 'income',
    date: new Date().toISOString().slice(0, 10),
    amount: null,
    category: '',
    comment: '',
  }
}
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
