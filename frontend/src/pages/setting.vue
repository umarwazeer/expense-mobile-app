<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="q-mx-auto" >
      <!-- Header -->
      <div class="text-left q-ml-md q-mb-md">
        <!-- <q-icon name="settings" size="64px" color="primary" /> -->
        <h4 class="q-mt-sm text-primary q-mb-sm">Settings</h4>
        <p class="text-grey-7 text-body1">Manage your profile, preferences and security</p>
      </div>

      <q-card flat bordered class="q-pa-lg">
        <!-- PROFILE SECTION -->
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 text-primary">Profile Information</div>
            <q-btn 
              flat 
              color="primary" 
              icon="edit" 
              label="Edit" 
              @click="editMode = !editMode"
            />
          </div>

          <!-- Avatar Section -->
          <div class="row q-col-gutter-lg items-center q-mb-md">
            <div class="col-auto">
              <q-avatar size="80px" class="bg-grey-3">
                <img v-if="profile.avatar" :src="profile.avatar" />
                <q-icon v-else name="person" size="40px" />
              </q-avatar>
            </div>
            <div class="col">
              <q-btn 
                color="primary" 
                icon="add_a_photo" 
                label="Change Avatar" 
                @click="changeAvatar"
                :disable="!editMode"
              />
              <div class="text-caption text-grey-6 q-mt-sm">JPG, GIF or PNG. 1MB max.</div>
            </div>
          </div>

          <div class="q-gutter-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  outlined 
                  dense
                  label="First Name *"
                  v-model="profile.firstName"
                  :disable="!editMode || isSaving"
                  :rules="[val => !!val || 'First name is required']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  outlined 
                  dense
                  label="Last Name *"
                  v-model="profile.lastName"
                  :disable="!editMode || isSaving"
                  :rules="[val => !!val || 'Last name is required']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  outlined 
                  dense
                  label="Email *"
                  v-model="profile.email"
                  type="email"
                  :disable="!editMode || isSaving"
                  :rules="[val => isValidEmail(val) || 'Invalid email format']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  outlined 
                  dense
                  label="Phone Number"
                  v-model="profile.phone"
                  :disable="!editMode || isSaving"
                  mask="(###) ###-####"
                  fill-mask
                />
              </div>
            </div>

            <q-input
              outlined 
              dense
              label="Bio"
              v-model="profile.bio"
              type="textarea"
              rows="3"
              :disable="!editMode || isSaving"
              placeholder="Tell us about yourself..."
            />

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  outlined 
                  dense
                  label="Location"
                  v-model="profile.location"
                  :disable="!editMode || isSaving"
                  placeholder="City, Country"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  outlined 
                  dense
                  label="Date of Birth"
                  v-model="profile.dob"
                  :disable="!editMode || isSaving"
                  mask="##/##/####"
                  placeholder="MM/DD/YYYY"
                />
              </div>
            </div>
          </div>

          <div class="q-mt-md" v-if="editMode">
            <q-btn
              color="primary"
              label="Save Profile"
              :loading="isSaving"
              unelevated
              @click="saveProfile"
              class="q-mr-sm"
            />
            <q-btn
              flat
              color="grey-7"
              label="Cancel"
              @click="cancelEdit"
              :disable="isSaving"
            />
          </div>
        </q-card-section>

        <q-separator spaced />

        <!-- SECURITY SECTION -->
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Security</div>
          
          <!-- Change Password -->
          <div class="q-mb-lg">
            <div class="text-subtitle1 q-mb-sm">Change Password</div>
            <div class="q-gutter-sm">
              <q-input
                outlined 
                dense
                :type="showCurrent ? 'text' : 'password'"
                label="Current Password"
                v-model="passwords.current"
                :disable="isSaving"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showCurrent ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showCurrent = !showCurrent"
                  />
                </template>
              </q-input>

              <q-input
                outlined 
                dense
                :type="showNew ? 'text' : 'password'"
                label="New Password"
                v-model="passwords.newPass"
                :disable="isSaving"
                :rules="[val => val.length >= 8 || 'Password must be at least 8 characters']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showNew ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showNew = !showNew"
                  />
                </template>
              </q-input>

              <q-input
                outlined 
                dense
                :type="showConfirm ? 'text' : 'password'"
                label="Confirm Password"
                v-model="passwords.confirm"
                :disable="isSaving"
                :rules="[val => val === passwords.newPass || 'Passwords do not match']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showConfirm ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirm = !showConfirm"
                  />
                </template>
              </q-input>
            </div>

            <div class="q-mt-md">
              <q-btn
                color="primary"
                label="Update Password"
                :loading="isSaving"
                unelevated
                @click="changePassword"
              />
            </div>
          </div>

          <!-- Two-Factor Authentication -->
          <q-separator spaced class="q-my-lg" />
          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle1">Two-Factor Authentication</div>
              <div class="text-caption text-grey-6">Add an extra layer of security to your account</div>
            </div>
            <q-toggle 
              color="primary" 
              v-model="security.twoFactor" 
              @update:model-value="toggleTwoFactor" 
            />
          </div>

          <!-- Active Sessions -->
          <div class="row items-center justify-between q-mt-md">
            <div>
              <div class="text-subtitle1">Active Sessions</div>
              <div class="text-caption text-grey-6">Manage your active login sessions</div>
            </div>
            <q-btn 
              flat 
              color="primary" 
              label="View All" 
              @click="showSessions = true"
            />
          </div>
        </q-card-section>

        <q-separator spaced />

        <!-- PREFERENCES SECTION -->
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Preferences</div>

          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1">Dark Mode</div>
              <div class="text-caption text-grey-6">Toggle between light and dark theme</div>
            </div>
            <q-toggle 
              color="primary" 
              v-model="prefs.darkMode" 
              @update:model-value="toggleDarkMode" 
            />
          </div>

          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1">Push Notifications</div>
              <div class="text-caption text-grey-6">Receive push notifications in browser</div>
            </div>
            <q-toggle 
              color="primary" 
              v-model="prefs.pushNotifications" 
              @update:model-value="togglePushNotifications" 
            />
          </div>

          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1">Email Notifications</div>
              <div class="text-caption text-grey-6">Receive notifications via email</div>
            </div>
            <q-toggle 
              color="primary" 
              v-model="prefs.emailNotifications" 
              @update:model-value="toggleEmailNotifications" 
            />
          </div>

          <q-separator spaced class="q-my-lg" />

          <!-- Language & Region -->
          <div class="text-subtitle1 q-mb-md">Language & Region</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                outlined 
                dense
                label="Language"
                v-model="prefs.language"
                :options="languageOptions"
                emit-value
                map-options
                @update:model-value="updateLanguage"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                outlined 
                dense
                label="Timezone"
                v-model="prefs.timezone"
                :options="timezoneOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </q-card-section>

        <q-separator spaced />

        <!-- DATA & PRIVACY SECTION -->
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Data & Privacy</div>

          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1">Download Your Data</div>
              <div class="text-caption text-grey-6">Export all your data in JSON format</div>
            </div>
            <q-btn 
              flat 
              color="primary" 
              label="Download" 
              @click="exportData"
              :loading="isExporting"
            />
          </div>

          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1">Clear Cache</div>
              <div class="text-caption text-grey-6">Clear app cache and temporary files</div>
            </div>
            <q-btn 
              flat 
              color="primary" 
              label="Clear" 
              @click="clearCache"
              :loading="isClearing"
            />
          </div>

          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle1 text-negative">Delete Account</div>
              <div class="text-caption text-grey-6">Permanently delete your account and data</div>
            </div>
            <q-btn 
              flat 
              color="negative" 
              label="Delete" 
              @click="confirmDelete = true"
            />
          </div>
        </q-card-section>

        <q-separator spaced />

        <!-- ADVANCED SECTION -->
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Advanced</div>

          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1">Reset to Defaults</div>
              <div class="text-caption text-grey-6">Restore all settings to default values</div>
            </div>
            <q-btn 
              flat 
              color="warning" 
              label="Reset" 
              @click="confirmReset = true"
            />
          </div>

          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle1">Export Settings</div>
              <div class="text-caption text-grey-6">Export your settings to file</div>
            </div>
            <q-btn 
              flat 
              color="primary" 
              label="Export" 
              @click="exportSettings"
            />
          </div>
        </q-card-section>

        <q-separator spaced />

        <!-- LOGOUT SECTION -->
        <q-card-section>
          <q-btn
            color="negative"
            label="Logout"
            unelevated
            icon="logout"
            @click="confirmLogout = true"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- LOGOUT DIALOG -->
    <q-dialog v-model="confirmLogout" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Confirm Logout</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to logout from your account?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn 
            flat 
            label="Logout" 
            color="negative" 
            @click="logout" 
            :loading="isLoggingOut" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DELETE ACCOUNT DIALOG -->
    <q-dialog v-model="confirmDelete" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-negative">Delete Account</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-negative q-mb-md">
            <q-icon name="warning" size="sm" class="q-mr-sm" />
            This action cannot be undone!
          </div>
          <p>This will permanently delete your account and all associated data. Type "DELETE" to confirm:</p>
          <q-input
            v-model="deleteConfirm"
            outlined
            dense
            placeholder="Type DELETE"
            :rules="[val => val === 'DELETE' || 'Must type DELETE']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn 
            flat 
            label="Delete Account" 
            color="negative" 
            @click="deleteAccount" 
            :disable="deleteConfirm !== 'DELETE'"
            :loading="isDeleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- RESET DIALOG -->
    <q-dialog v-model="confirmReset" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-warning">Reset Settings</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to reset all settings to their default values? This cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn 
            flat 
            label="Reset" 
            color="warning" 
            @click="resetSettings"
            :loading="isResetting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ACTIVE SESSIONS DIALOG -->
    <q-dialog v-model="showSessions">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Active Sessions</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list separator>
            <q-item v-for="(session, index) in sessions" :key="index">
              <q-item-section avatar>
                <q-icon :name="session.device === 'mobile' ? 'phone_android' : 'computer'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ session.device }} - {{ session.browser }}</q-item-label>
                <q-item-label caption>{{ session.location }} • {{ session.lastActive }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn 
                  v-if="!session.current"
                  flat 
                  color="negative" 
                  label="Revoke" 
                  size="sm"
                  @click="revokeSession(index)"
                />
                <q-chip v-else color="primary" text-color="white" size="sm">Current</q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
          <q-btn 
            flat 
            label="Logout All" 
            color="negative" 
            @click="revokeAllSessions"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// State management
const isSaving = ref(false)
const isLoggingOut = ref(false)
const isExporting = ref(false)
const isClearing = ref(false)
const isDeleting = ref(false)
const isResetting = ref(false)

const editMode = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const confirmLogout = ref(false)
const confirmDelete = ref(false)
const confirmReset = ref(false)
const showSessions = ref(false)
const deleteConfirm = ref('')

// Profile data
const profile = reactive({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '',
  bio: '',
  location: '',
  dob: '',
  avatar: ''
})

// Password data
const passwords = reactive({
  current: '',
  newPass: '',
  confirm: ''
})

// Security settings
const security = reactive({
  twoFactor: false
})

// Preferences
const prefs = reactive({
  darkMode: false,
  pushNotifications: true,
  emailNotifications: true,
  language: 'en',
  timezone: 'UTC'
})

// Active sessions
const sessions = ref([
  {
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'New York, US',
    lastActive: 'Now',
    current: true
  },
  {
    device: 'Mobile',
    browser: 'Safari iOS',
    location: 'San Francisco, US',
    lastActive: '2 hours ago',
    current: false
  },
  {
    device: 'Desktop',
    browser: 'Firefox 121',
    location: 'London, UK',
    lastActive: '1 day ago',
    current: false
  }
])

// Options
const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Japanese', value: 'ja' }
]

const timezoneOptions = [
  { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
  { label: 'EST (Eastern Standard Time)', value: 'America/New_York' },
  { label: 'PST (Pacific Standard Time)', value: 'America/Los_Angeles' },
  { label: 'GMT (Greenwich Mean Time)', value: 'Europe/London' },
  { label: 'JST (Japan Standard Time)', value: 'Asia/Tokyo' }
]

onMounted(() => {
  loadSettings()
})

function loadSettings() {
  // Load from localStorage or API
  const savedPrefs = localStorage.getItem('preferences')
  if (savedPrefs) {
    Object.assign(prefs, JSON.parse(savedPrefs))
  }
  
  const savedSecurity = localStorage.getItem('security')
  if (savedSecurity) {
    Object.assign(security, JSON.parse(savedSecurity))
  }

  applyTheme(prefs.darkMode)
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('preferences', JSON.stringify(prefs))
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function saveProfile() {
  if (!profile.firstName || !profile.email) {
    $q.notify({ 
      type: 'negative', 
      message: 'Please fill all required fields.' 
    })
    return
  }

  isSaving.value = true
  setTimeout(() => {
    localStorage.setItem('profile', JSON.stringify(profile))
    $q.notify({ 
      type: 'positive', 
      message: 'Profile updated successfully!' 
    })
    isSaving.value = false
    editMode.value = false
  }, 1000)
}

function cancelEdit() {
  // Reload profile data from localStorage or API
  const savedProfile = localStorage.getItem('profile')
  if (savedProfile) {
    Object.assign(profile, JSON.parse(savedProfile))
  }
  editMode.value = false
}

function changeAvatar() {
  // Simulate file upload
  $q.notify({
    type: 'info',
    message: 'Avatar upload functionality would be implemented here'
  })
}

function changePassword() {
  if (!passwords.current || !passwords.newPass || !passwords.confirm) {
    $q.notify({ 
      type: 'negative', 
      message: 'Please fill in all password fields.' 
    })
    return
  }

  if (passwords.newPass !== passwords.confirm) {
    $q.notify({ 
      type: 'negative', 
      message: 'Passwords do not match!' 
    })
    return
  }

  if (passwords.newPass.length < 8) {
    $q.notify({ 
      type: 'negative', 
      message: 'Password must be at least 8 characters long!' 
    })
    return
  }

  isSaving.value = true
  setTimeout(() => {
    passwords.current = ''
    passwords.newPass = ''
    passwords.confirm = ''
    $q.notify({ 
      type: 'positive', 
      message: 'Password changed successfully!' 
    })
    isSaving.value = false
  }, 1000)
}

function toggleDarkMode(val) {
  applyTheme(val)
  $q.notify({ 
    type: 'info', 
    message: val ? 'Dark mode enabled' : 'Light mode enabled' 
  })
}

function togglePushNotifications(val) {
  if (val && 'Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        prefs.pushNotifications = false
        $q.notify({
          type: 'warning',
          message: 'Notification permission denied'
        })
      }
    })
  }
  localStorage.setItem('preferences', JSON.stringify(prefs))
  $q.notify({ 
    type: 'info', 
    message: val ? 'Push notifications enabled' : 'Push notifications disabled' 
  })
}

function toggleEmailNotifications(val) {
  localStorage.setItem('preferences', JSON.stringify(prefs))
  $q.notify({ 
    type: 'info', 
    message: val ? 'Email notifications enabled' : 'Email notifications disabled' 
  })
}

function toggleTwoFactor(val) {
  localStorage.setItem('security', JSON.stringify(security))
  $q.notify({ 
    type: 'info', 
    message: val ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled' 
  })
}

function updateLanguage() {
  localStorage.setItem('preferences', JSON.stringify(prefs))
  $q.notify({
    type: 'info',
    message: `Language changed to ${languageOptions.find(l => l.value === prefs.language)?.label}`
  })
}

function exportData() {
  isExporting.value = true
  setTimeout(() => {
    const data = {
      profile,
      preferences: prefs,
      security,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-data-${Date.now()}.json`
    a.click()
    
    isExporting.value = false
    $q.notify({
      type: 'positive',
      message: 'Data exported successfully'
    })
  }, 1500)
}

function clearCache() {
  isClearing.value = true
  setTimeout(() => {
    localStorage.removeItem('cache')
    // Clear browser cache if possible
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    isClearing.value = false
    $q.notify({
      type: 'positive',
      message: 'Cache cleared successfully'
    })
  }, 1000)
}

function deleteAccount() {
  if (deleteConfirm.value !== 'DELETE') {
    $q.notify({
      type: 'negative',
      message: 'Please type DELETE to confirm'
    })
    return
  }

  isDeleting.value = true
  setTimeout(() => {
    localStorage.clear()
    $q.notify({
      type: 'info',
      message: 'Account deleted successfully'
    })
    router.push('/login')
    isDeleting.value = false
  }, 2000)
}

function resetSettings() {
  isResetting.value = true
  setTimeout(() => {
    // Reset to defaults
    Object.assign(prefs, {
      darkMode: false,
      pushNotifications: true,
      emailNotifications: true,
      language: 'en',
      timezone: 'UTC'
    })
    
    Object.assign(security, {
      twoFactor: false
    })

    localStorage.setItem('preferences', JSON.stringify(prefs))
    localStorage.setItem('security', JSON.stringify(security))
    applyTheme(false)

    isResetting.value = false
    confirmReset.value = false

    $q.notify({
      type: 'positive',
      message: 'Settings reset to defaults'
    })
  }, 1000)
}

function revokeSession(index) {
  sessions.value.splice(index, 1)
  $q.notify({
    type: 'info',
    message: 'Session revoked'
  })
}

function revokeAllSessions() {
  sessions.value = sessions.value.filter(s => s.current)
  $q.notify({
    type: 'info',
    message: 'All other sessions revoked'
  })
}

function exportSettings() {
  const settings = {
    preferences: prefs,
    security,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `settings-${Date.now()}.json`
  a.click()
  
  $q.notify({
    type: 'positive',
    message: 'Settings exported successfully'
  })
}

async function logout() {
  isLoggingOut.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Clear all stored data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('profile')
    
    $q.notify({
      type: 'info',
      message: 'Logged out successfully'
    })
    
    // Navigate to login
    router.push('/login')
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error logging out. Please try again.'
    })
  } finally {
    isLoggingOut.value = false
    confirmLogout.value = false
  }
}
</script>

<style scoped>
.bg-grey-1 {
  min-height: 100vh;
}

h4 {
  font-weight: 700;
}

.q-card {
  border-radius: 12px;
}

.text-primary {
  color: var(--q-primary) !important;
}
</style>
