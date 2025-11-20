<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="profile.name"
      label="Your Name *"
      hint="Name and surname"
      lazy-rules
      :rules="[val => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      v-model="profile.email"
      label="Your Email *"
      type="email"
      lazy-rules
      :rules="[
        val => (val && val.length > 0) || 'Please type something',
        val => isValidEmail(val) || 'Please enter a valid email address'
      ]"
    />

    <div>
      <q-btn label="Save Changes" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore();

const profile = ref({
  name: '',
  email: '',
});

onMounted(() => {
  // Load profile from the store when the component is created
  profile.value = { ...authStore.profile };
});

const onSubmit = () => {
  authStore.updateProfile(profile.value);
};

const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
</script>