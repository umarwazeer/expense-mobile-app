<template>
  <q-layout view="lHh Lpr lFf" class="text-white">

    <!-- 🔹 Header -->
    <q-header elevated class=" text-white">
      <q-toolbar class="flex items-center justify-between">

        <!-- 🔸 Left Section (Logo + App Name on Mobile) -->
        <div class="flex items-center q-gutter-sm">
          <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" aria-label="Menu" />
          <div class="flex items-center q-gutter-sm sm:hidden">
            <q-avatar size="28px">
              <img src="https://www.svgrepo.com/show/175767/finance.svg" alt="FineTracker Logo" />
            </q-avatar>
            <span class="text-white text-subtitle1 text-weight-bold">FineTracker</span>
          </div>
        </div>

        <!-- 🔸 Centered App Name (Visible on Desktop) -->
        <q-toolbar-title class="hidden sm:flex items-center justify-center q-gutter-sm text-h6 text-weight-bold">
          <q-avatar size="32px">
            <img src="https://www.svgrepo.com/show/175767/finance.svg" alt="FineTracker Logo" />
          </q-avatar>
          <span class="text-white">FineTracker</span>
        </q-toolbar-title>

        <!-- 🔸 Right Icons (Notification + Logout) -->
        <div class="q-gutter-sm row items-center">
          <q-btn flat round dense icon="notifications" color="white" @click="showNotifications" />
          <q-btn flat round dense icon="power_settings_new" color="white" @click="confirmLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- 🔹 Sidebar Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="220"
      class="bg-grey-1 text-grey-9"
    >
      <!-- User Info -->
      <div class="text-center q-mt-lg q-mb-md">
        <q-avatar size="64px">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
        </q-avatar>
        <div class="text-h6 text-primary q-mt-sm">Umar Khan</div>
        <div class="text-caption text-grey">a4umakhan@gmail.com</div>
      </div>

      <q-separator spaced />

      <!-- Menu Links -->
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-separator spaced />

      <!-- Footer -->
      <div class="text-center text-grey text-caption q-py-md">
        © 2025 FineTracker
      </div>
    </q-drawer>

    <!-- 🔹 Main Page -->
    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- ===== Custom Logout Dialog ===== -->
    <div v-if="showLogoutDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showLogoutDialog = false"></div>

      <!-- Dialog Box -->
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <q-icon name="logout" size="md" color="red-600" />
        </div>

        <h3 class="text-xl font-semibold text-center text-gray-900 mb-2">
          Confirm Logout
        </h3>
        <p class="text-center text-gray-500 mb-8">
          Are you sure you want to log out of your account? You will need to sign in again to access your data...
        </p>

        <div class="flex gap-3">
          <button
            @click="showLogoutDialog = false"
            class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="logout"
            class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
      </div>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
const showLogoutDialog = ref(false)

const linksList = [
  { title: 'Home', caption: 'Homepage', icon: 'home', to: '/' },
  { title: 'Add Users', caption: 'Add your new User', icon: 'person_add_alt', to: 'table' },
  { title: 'User Account', caption: 'Your account details', icon: 'account_box', to: 'account' },
  { title: 'Reports', caption: 'Your reports', icon: 'insights', to: 'Report' },
  { title: 'Budget', caption: 'Plan your spending', icon: 'savings', to: 'budget' },
  { title: 'Analytics', caption: 'View financial stats', icon: 'stacked_line_chart', to: 'analytics' },
  { title: 'Setting', caption: 'Manage settings', icon: 'settings_suggest', to: 'setting' },
  { title: 'Logout', caption: 'Logout now', icon: 'logout', to: 'loginPage' }
]



export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },

  setup(_, { emit }) {
    
    const $q = useQuasar()
    const leftDrawerOpen = ref(false)

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const showNotifications = () => {
      $q.notify({
        message: 'No new notifications 📭',
        color: 'info',
        position: 'top-right',
        timeout: 1500
      })
    }

    const confirmLogout = () => {
      $q.dialog({
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // Redirect to login page
        window.location.href = '/#/loginPage'
      })
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer,
      showNotifications,
      confirmLogout
    }
  }
})

</script>

<style scoped>
.q-layout__section--marginal {
      background-color: #0891b2;
}
.q-toolbar-title span {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.q-drawer {
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}

.q-avatar img {
  object-fit: cover;
}

.q-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 600px) {
  .q-toolbar-title {
    display: none !important;
  }
}
@media (max-width: 600px) {
  .absolute-center {
    left: 50%;
    transform: translateX(-50%);
  }
}

</style>
