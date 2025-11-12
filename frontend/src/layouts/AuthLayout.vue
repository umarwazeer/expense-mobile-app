<template>
  <q-layout view="lHh Lpr lFf" class="bg-gradient-to-br from-blue-50 to-indigo-100">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #ebf4ff, #c7d2fe);
}
</style>
