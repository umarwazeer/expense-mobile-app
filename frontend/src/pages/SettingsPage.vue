<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-lg">Settings</div>

    <!-- Profile Section -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="account_circle" class="q-mr-sm" />
          Profile Information
        </div>
        <UserProfileForm />
      </q-card-section>
    </q-card>

    <!-- Appearance Section -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="palette" class="q-mr-sm" />
          Appearance
        </div>
        <div class="row q-gutter-lg">
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2 q-mb-sm">Theme Mode</div>
            <ThemeSwitcher />
          </div>
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2 q-mb-sm">Language</div>
            <LanguageSelector />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Data Management Section -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="storage" class="q-mr-sm" />
          Data Management
        </div>
        <div class="text-body2 q-mb-md text-grey-7">
          Download a copy of your data or restore from a previous backup.
        </div>
        <BackupRestore />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import UserProfileForm from '../pages/components/settings/UserProfileForm.vue';
import ThemeSwitcher from '../pages/components/settings/ThemeSwitcher.vue';
import LanguageSelector from '../pages/components/settings/LanguageSelector.vue';
import BackupRestore from '../pages/components/settings/BackupRestore.vue';

// You could fetch initial data here if needed, though the components handle their own state.
</script>

<style scoped>
/* Optional: Add any custom styling if needed */
</style>