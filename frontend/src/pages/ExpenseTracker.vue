<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
    <div class="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
      <div class="text-center mb-8">
        <div class="text-6xl mb-2">💰</div>
        <h1 class="text-3xl font-bold text-gray-800">Expense Tracker</h1>
        <p class="text-gray-500 mt-2">Track your expenses with ease and categorize them properly</p>
      </div>

      <form @submit.prevent="addExpense" class="space-y-6">
        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
          <input
            v-model="form.description"
            type="text"
            placeholder="e.g., Grocery shopping at Walmart"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Amount ($) *</label>
          <div class="relative">
            <span class="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              v-model="form.amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              class="w-full pl-7 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
          <input
            v-model="form.date"
            type="date"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
          <select
            v-model="form.category"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option disabled value="">Select a category</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
          </select>
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
          <select
            v-model="form.paymentMethod"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option disabled value="">Select payment method</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Add any additional notes..."
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <!-- Button -->
        <div class="text-center pt-2">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  description: '',
  amount: '',
  date: '',
  category: '',
  paymentMethod: '',
  notes: '',
})

const addExpense = () => {
  alert('Expense added successfully!')
  console.log(form.value)
  form.value = { description: '', amount: '', date: '', category: '', paymentMethod: '', notes: '' }
}
</script>
