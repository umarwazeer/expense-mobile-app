<template>
  <q-select
    v-model="currentLocale"
    :options="localeOptions"
    label="Language"
    outlined
    emit-value
    map-options
    options-dense
    style="min-width: 150px"
  >
    <template v-if="currentLocale" v-slot:prepend>
      <q-icon :name="`img:flags/${currentLocale}.png`" />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon :name="`img:flags/${scope.opt.value}.png`" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'; // Make sure to import this

const { locale } = useI18n({ useScope: 'global' });

const currentLocale = ref(locale.value);

// You need flag icons in 'public/flags/' (e.g., en-US.png, bn-BD.png)
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'bn-BD', label: 'বাংলা' },
];

watch(currentLocale, (newLocale) => {
  // Update the global locale
  locale.value = newLocale;
  // Optional: Save preference to localStorage
  import(/* webpackChunkName: "quasar-i18n-[request]" */ `quasar/lang/${newLocale}`).then(lang => {
    // Quasar's own language strings
    $q.lang.set(lang.default);
  });
  localStorage.setItem('locale', newLocale);
});

onMounted(() => {
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale) {
    currentLocale.value = savedLocale;
  }
});
</script>