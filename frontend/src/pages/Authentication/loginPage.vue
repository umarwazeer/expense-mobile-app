<template>
  <q-page class="flex flex-center bg-gradient-to-br from-blue-50 to-indigo-100 q-pa-md">
    <q-card class="q-pa-lg q-px-xl q-py-xl shadow-4 rounded-borders bg-white" style="max-width: 420px; width: 100%;">
      <!-- Header -->
      <div class="text-center q-mb-md">
        <div
          class="bg-indigo-600 q-mx-auto flex flex-center q-pa-md rounded-borders shadow-2"
          style="width: 64px; height: 64px;"
        >
          <q-icon name="attach_money" color="white" size="32px" />
        </div>
        <h1 class="text-h5 text-primary q-mt-md text-bold">FineTracker</h1>
        <p class="text-grey-7 q-py-md">
          {{ isRegister ? 'Create your account' : 'Welcome back' }}
        </p>
      </div>

      <!-- Auth Form -->
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <!-- Name Fields (Register Only) -->
        <div v-if="isRegister" class="row q-col-gutter-md">
          <div class="col">
            <q-input
              v-model="formData.first_name"
              outlined
              dense
              label="First Name"
              required
              :disable="isLoading"
            />
          </div>
          <div class="col">
            <q-input
              v-model="formData.last_name"
              outlined
              dense
              label="Last Name"
              required
              :disable="isLoading"
            />
          </div>
        </div>

        <!-- Username -->
        <q-input
          v-model="formData.username"
          outlined
          dense
          label="Username"
          required
          :disable="isLoading"
        />

        <!-- Email (Register Only) -->
        <q-input
          v-if="isRegister"
          v-model="formData.email"
          outlined
          dense
          label="Email"
          type="email"
          required
          :disable="isLoading"
        />

        <!-- Password -->
        <q-input
          v-model="formData.password"
          outlined
          dense
          label="Password"
          type="password"
          required
          :disable="isLoading"
        />

        <!-- Submit Button -->
        <q-btn
          type="submit"
          :loading="isLoading"
          :label="isRegister ? 'Sign Up' : 'Sign In'"
          color="indigo"
          unelevated
          class="full-width q-py-sm text-white text-bold"
        />

        <!-- Toggle Button -->
        <div class="text-center q-mt-md">
          <q-btn
            flat
            color="primary"
            size="sm"
            @click="toggleMode"
            :label="isRegister ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const isRegister = ref(false)
const isLoading = ref(false)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: ''
})

const handleSubmit = async () => {
  isLoading.value = true

  const result = isRegister.value
    ? await authStore.register(formData)
    : await authStore.login({
        username: formData.username,
        password: formData.password
      })

  if (result.success) {
    $q.notify({
      color: 'positive',
      message: isRegister.value ? 'Account created successfully!' : 'Welcome back!',
      caption: isRegister.value
        ? 'You can now sign in with your new credentials.'
        : 'Redirecting to home...',
      icon: 'check_circle',
      position: 'top'
    })

    if (!isRegister.value) {
      setTimeout(() => router.push('/home'), 1000)
    } else {
      isRegister.value = false
    }
  } else {
    $q.notify({
      color: 'negative',
      message: 'Authentication failed',
      caption: result.error || 'Something went wrong.',
      icon: 'error',
      position: 'top'
    })
  }

  isLoading.value = false
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
}
</script>

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #ebf4ff, #c7d2fe);
}
.rounded-borders {
  border-radius: 1rem;
}
.full-width {
  width: 100%;
}
</style>
