<template>
  <div class="q-pa-md max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 space-y-4">
    <div class="text-xl font-semibold text-center text-gray-700 mb-4">
      💰 Add New Income
    </div>

    <!-- Date Picker -->
    <q-input
      filled
      dense
      v-model="form.date"
      label="Date"
      mask="date"
      :rules="[val => !!val || 'Select a date']"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="form.date" @update:model-value="hideDatePopup">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Income Amount (Number Input only) -->
    <q-input
      type="number"
      filled
      dense
      v-model.number="form.amount"
      label="Income Amount"
      prefix="₹"
      :rules="[val => val > 0 || 'Enter a valid amount']"
    />

    <!-- Category -->
    <q-select
      filled
      v-model="form.category"
      use-input
      input-debounce="0"
      label="Choose Income Category"
      :options="filteredOptions"
      @filter="filterFn"
      behavior="menu"
      :rules="[val => !!val || 'Choose a category']"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results found</q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Comment -->
    <q-input
      filled
      dense
      type="textarea"
      v-model="form.comment"
      label="Comment (optional)"
    >
      <template v-slot:prepend>
        <q-icon name="comment" />
      </template>
    </q-input>

    <!-- Add Income Button -->
    <q-btn
      color="cyan-8"
      label="Add Income"
      class="full-width text-white font-semibold text-lg"
      @click="submitForm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// reactive form state
const form = ref({
  date: new Date().toISOString().slice(0, 10),
  amount: null,
  category: '',
  comment: '',
})

// predefined categories
const categories = ['Salary', 'Bonus', 'Freelance', 'Investments', 'Gifts', 'Other']
const filteredOptions = ref(categories)

// filter function for select
const filterFn = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    filteredOptions.value = categories.filter(c => c.toLowerCase().includes(needle))
  })
}

// handle calendar popup
const hideDatePopup = () => {
  const proxy = document.querySelector('[ref="qDateProxy"]')
  if (proxy) proxy.hide()
}

// form submit logic
const submitForm = () => {
  if (!form.value.amount || !form.value.category || !form.value.date) {
    $q.notify({
      type: 'negative',
      message: 'Please fill all required fields',
    })
    return
  }

  // Save locally (later can be replaced with API call)
  const existing = JSON.parse(localStorage.getItem('incomes') || '[]')
  existing.push({ ...form.value, id: Date.now() })
  localStorage.setItem('incomes', JSON.stringify(existing))

  $q.notify({
    type: 'positive',
    message: 'Income added successfully!',
  })

  // reset form
  form.value = {
    date: new Date().toISOString().slice(0, 10),
    amount: null,
    category: '',
    comment: '',
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
