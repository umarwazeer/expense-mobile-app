Here is the **Clean, Professional, and Compact** version.

### Changes made based on your request:
1.  **Removed Animation:** The logo is now static (no floating/bouncing).
2.  **Compact Sidebar Header:** Removed the large colorful box. Now it is a simple, professional row with **Logo + Title**.
3.  **Space Saving:** It takes up much less space, leaving more room for your menu items.

```template
<template>
  <q-layout view="lHh Lpr lFf" class="bg-gray-50 font-sans">

    <!-- ===========================
         🔹 HEADER (Top Bar)
    ============================ -->
    <q-header elevated class="backdrop-blur-md" 
              style="background: linear-gradient(135deg, #0891b2 0%, #0ea5e9 50%, #d946ef 100%);">
      <q-toolbar class="q-py-xs">
        
        <!-- Left: Menu Button + Logo -->
        <div class="flex items-center q-gutter-sm">
          <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" 
                 class="hover:bg-white/20 rounded-xl transition-all duration-200" />
          
          <!-- Header Title (Only visible on Desktop) -->
          <div class="hidden sm:flex items-center gap-2 ml-2">
             <img :src="appLogo" class="w-6 h-6 brightness-200 filter" style="filter: brightness(0) invert(1);" />
             <span class="text-lg font-bold tracking-wide">FineTracker</span>
          </div>
        </div>

        <q-space />

        <!-- Right: User Actions -->
        <div class="flex items-center gap-2">
          <!-- Notifications -->
          <q-btn flat round dense icon="notifications" class="hover:bg-white/20 rounded-xl">
             <q-badge color="red-500" floating rounded mini />
          </q-btn>
          
          <!-- Profile Dropdown -->
          <q-btn flat no-caps class="hover:bg-white/20 rounded-xl pl-1 pr-2">
            <div class="flex items-center gap-2">
              <q-avatar size="30px" class="border border-white/50">
                <img src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" />
              </q-avatar>
              <span class="hidden xs text-sm font-semibold">Umar</span>
            </div>
            
            <q-menu auto-close class="rounded-xl shadow-xl mt-2 border border-gray-100">
              <q-list style="min-width: 150px">
                <q-item clickable class="hover:bg-cyan-50">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable class="text-red-600 hover:bg-red-50" @click="showLogoutDialog = true">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- ===========================
         🔹 SIDEBAR (DRAWER)
    ============================ -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      class="bg-white"
    >
      <q-scroll-area class="fit">
        
        <!-- 🔸 SIMPLE SIDEBAR HEADER -->
        <div class="flex items-center gap-3 q-px-lg q-py-md border-b border-gray-100">
           <div class="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center border border-cyan-100">
             <img :src="appLogo" class="w-6 h-6" alt="Logo" />
           </div>
           <div class="flex flex-col">
             <span class="text-lg font-bold text-gray-800 leading-none">FineTracker</span>
             <span class="text-[11px] text-gray-400 font-medium mt-1">Expense Manager</span>
           </div>
        </div>

        <!-- 🔸 Menu Items -->
        <q-list padding class="q-mt-sm text-gray-600">
          
          <q-item-label header class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2 q-mb-xs">
            Main Menu
          </q-item-label>

          <q-item 
            v-for="link in menuLinks" 
            :key="link.title"
            clickable 
            v-ripple 
            :to="link.to"
            active-class="text-cyan-700 bg-cyan-50 border-r-4 border-cyan-500 font-semibold"
            class="mx-3 rounded-lg mb-1 hover:bg-gray-50 transition-colors"
          >
            <q-item-section avatar class="min-w-[40px]">
              <q-icon :name="link.icon" size="20px" />
            </q-item-section>
            <q-item-section class="text-[14px]">
              {{ link.title }}
            </q-item-section>
          </q-item>

          <q-separator class="my-4 mx-6 bg-gray-100" />

          <q-item-label header class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2 q-mb-xs">
            System
          </q-item-label>

          <q-item clickable v-ripple to="/SettingsPage" active-class="text-cyan-700 bg-cyan-50" class="mx-3 rounded-lg mb-1">
            <q-item-section avatar class="min-w-[40px]"><q-icon name="settings" size="20px"/>
            </q-item-section>
            <q-item-section class="text-[14px]">Settings</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="showLogoutDialog = true" class="mx-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
            <q-item-section avatar class="min-w-[40px]"><q-icon name="logout" size="20px"/></q-item-section>
            <q-item-section class="text-[14px]">Logout</q-item-section>
          </q-item>
        </q-list>

      </q-scroll-area>
    </q-drawer>

    <!-- ===========================
         🔹 PAGE CONTENT
    ============================ -->
    <q-page-container class="bg-gray-50">
      <router-view />
    </q-page-container>

    <!-- ===========================
         🔹 LOGOUT MODAL (Unchanged)
    ============================ -->
    <q-dialog v-model="showLogoutDialog" backdrop-filter="blur(4px)">
      <q-card class="rounded-2xl shadow-2xl p-4" style="width: 350px">
        <q-card-section class="text-center">
          <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
            <q-icon name="logout" size="28px" />
          </div>
          <div class="text-h6 font-bold text-gray-800">Log Out?</div>
          <div class="text-sm text-gray-500 mt-1">Are you sure you want to sign out?</div>
        </q-card-section>

        <q-card-actions align="center" class="gap-3">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup class="bg-gray-100 flex-1 rounded-lg" no-caps />
          <q-btn flat label="Logout" color="white" class="bg-red-600 flex-1 rounded-lg" @click="handleLogout" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const $q = useQuasar()
    const auth = useAuthStore()
    const router = useRouter()
    
    const leftDrawerOpen = ref(false)
    const showLogoutDialog = ref(false)

    // 🔹 Using a clean SVG Logo (Chart/Finance)
    const appLogo = 'https://www.svgrepo.com/show/428656/business-chart-finance.svg'

    const menuLinks = [
      { title: 'Dashboard', icon: 'grid_view', to: '/' },
      { title: 'Transactions', icon: 'receipt_long', to: '/transactions' },
      { title: 'Reports', icon: 'bar_chart', to: '/report' },
      { title: 'Analytics', icon: 'donut_small', to: '/analytics' },
      { title: 'My Budget', icon: 'account_balance_wallet', to: '/budget' }
    ]

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const handleLogout = async () => {
      showLogoutDialog.value = false
      await auth.logout()
      $q.notify({ type: 'positive', message: 'Logged out successfully' })
      router.push('/auth/login')
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      showLogoutDialog,
      handleLogout,
      menuLinks,
      appLogo
    }
  }
})
</script>

<style scoped>
/* No animations, just clean styles */
</style>
```