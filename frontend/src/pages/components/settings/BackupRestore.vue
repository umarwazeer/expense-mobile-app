<template>
  <div class="q-gutter-md">
    <q-btn
      @click="downloadBackup"
      color="secondary"
      icon="cloud_download"
      label="Download Backup"
    />

    <q-btn
      @click="triggerFileUpload"
      color="accent"
      icon="cloud_upload"
      label="Restore Backup"
    />

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
// import { ref } from 'vue';
// import { useExpenseStore } from 'stores/store';
// import { useQuasar } from 'quasar';

// const expenseStore = useExpenseStore();
// const $q = useQuasar();
// const fileInput = ref(null);

// const downloadBackup = () => {
//   const dataToSave = expenseStore.exportData();
//   const dataStr = JSON.stringify(dataToSave, null, 2); // Pretty print JSON
//   const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(dataBlob);
//   const date = new Date().toISOString().slice(0, 10);
//   link.download = `expense-backup-${date}.json`;
//   link.click();
  
//   URL.revokeObjectURL(link.href); // Clean up
// };

// const triggerFileUpload = () => {
//   fileInput.value.click();
// };

// const onFileChange = (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     try {
//       const importedData = JSON.parse(e.target.result);
//       const success = expenseStore.importData(importedData);
//       if (success) {
//         // Optional: Redirect or refresh data views
//         console.log('Data restored successfully.');
//       }
//     } catch (error) {
//       console.error('Failed to parse JSON file:', error);
//       $q.notify({
//         type: 'negative',
//         message: 'Failed to parse the backup file.',
//       });
//     }
//   };
//   reader.readAsText(file);

//   // Reset the file input so the user can select the same file again
//   event.target.value = '';
// };
// </script>