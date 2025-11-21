<template>
  <div class="row items-center q-gutter-sm">
    <q-icon name="light_mode" />
    <q-toggle
      v-model="isDarkMode"
      @update:model-value="setTheme"
      checked-icon="dark_mode"
      unchecked-icon="light_mode"
      color="primary"
    />
    <q-icon name="dark_mode" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const isDarkMode = ref($q.dark.isActive);

onMounted(() => {
  // Sync toggle with current theme
  isDarkMode.value = $q.dark.isActive;
});

const setTheme = (value) => {
  $q.dark.set(value);
  // Optional: Save preference to localStorage or backend
  localStorage.setItem('theme', value ? 'dark' : 'light');
};
</script>