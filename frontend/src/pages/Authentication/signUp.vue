<template>
  <q-page class="flex flex-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <q-card class="q-pa-lg shadow-3 rounded-borders" style="width: 400px; max-width: 90vw;">
      <div class="text-center q-mb-md">
        <q-icon name="account_circle" color="indigo" size="56px" />
        <div class="text-h5 text-weight-bold q-mt-sm">FineTracker</div>
        <div class="text-grey-7 text-subtitle2">
          {{ isRegister ? 'Create your account' : 'Sign in to continue' }}
        </div>
      </div>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div v-if="isRegister" class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input v-model="formData.firstName" label="First Name" outlined dense />
          </div>
          <div class="col-6">
            <q-input v-model="formData.lastName" label="Last Name" outlined dense />
          </div>
        </div>

        <q-input v-model="formData.username" label="Username" outlined dense />
        <q-input v-if="isRegister" v-model="formData.email" label="Email" type="email" outlined dense />
        <q-input v-model="formData.password" label="Password" type="password" outlined dense />

        <q-btn
          type="submit"
          color="indigo"
          label="Submit"
          :loading="isLoading"
          class="full-width q-mt-md"
          rounded
        />

        <div class="text-center q-mt-md">
          <q-btn
            flat
            color="indigo"
            size="sm"
            @click="toggleMode"
            :label="isRegister ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const isRegister = ref(false)
const isLoading = ref(false)

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: ''
})

function toggleMode() {
  isRegister.value = !isRegister.value
  formData.value = { firstName: '', lastName: '', username: '', email: '', password: '' }
}

function handleSubmit() {
  isLoading.value = true
  setTimeout(() => {
    if (isRegister.value) {
      if (
        !formData.value.firstName ||
        !formData.value.lastName ||
        !formData.value.username ||
        !formData.value.email ||
        !formData.value.password
      ) {
        $q.notify({ type: 'negative', message: 'Please fill all fields' })
      } else if (formData.value.password.length < 8) {
        $q.notify({ type: 'warning', message: 'Password must be at least 8 characters' })
      } else {
        // Save new user data in localStorage
        localStorage.setItem('user', JSON.stringify(formData.value))
        $q.notify({ type: 'positive', message: 'Account created! Please sign in.' })
        isRegister.value = false
      }
    } else {
      const savedUser = JSON.parse(localStorage.getItem('user'))
      if (
        savedUser &&
        savedUser.username === formData.value.username &&
        savedUser.password === formData.value.password
      ) {
        $q.notify({ type: 'positive', message: 'Welcome back!' })
        localStorage.setItem('loggedIn', 'true')
        router.push('/')
      } else {
        $q.notify({ type: 'negative', message: 'Invalid username or password' })
      }
    }
    isLoading.value = false
  }, 1000)
}
</script>
