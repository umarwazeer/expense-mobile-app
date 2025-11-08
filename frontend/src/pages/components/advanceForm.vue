<template>
  <q-dialog v-model="isDialogOpen" persistent transition-show="scale" transition-hide="scale">
    <q-card class="form-card bg-white q-pa-md shadow-3">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-h6 text-primary">Add Expense / Income</div>
        <q-btn flat round dense icon="close" @click="handleClose" />
      </div>

      <!-- Camera + Upload -->
      <!-- <div class="scanner-block q-mb-md">
        <div class="row items-center justify-between">
          <div class="text-subtitle2 text-grey-9">Bill Scanner (AI)</div>
          <div>
            <q-btn
              outline
              dense
              color="dark"
              icon="photo_camera"
              label="Camera"
              class="scan-btn"
              @click="openCamera"
            />
            <q-btn
              outline
              dense
              color="dark"
              icon="upload_file"
              label="Upload"
              class="scan-btn q-ml-sm"
              @click="triggerFileInput"
            />
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileUpload"
            />
          </div>
        </div> -->

        <!-- Live Camera -->
        <!-- <div v-if="showCamera" class="camera-box q-mt-sm">
          <video ref="videoRef" autoplay playsinline class="camera-preview" />
          <div class="row justify-center q-mt-xs">
            <q-btn color="primary" label="Capture" @click="capturePhoto" />
            <q-btn flat color="negative" label="Cancel" class="q-ml-sm" @click="stopCamera" />
          </div>
        </div> -->

        <!-- Preview -->
        <div v-if="capturedImage" class="q-mt-md">
          <q-img :src="capturedImage" ratio="16/9" class="rounded-borders" />
          <div class="row justify-between q-mt-xs">
            <q-btn flat dense color="negative" icon="close" label="Remove" @click="clearCaptured" />
            <q-btn
              flat
              dense
              color="purple"
              icon="qr_code_scanner"
              label="Scan Bill"
              @click="scanBill"
              :loading="scanning"
            />
          <!-- </div> -->
        </div>
      </div>

      <!-- Form -->
        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-6">
            <q-btn
              :color="form.type === 'income' ? 'positive' : 'grey-4'"
              label="Income"
              unelevated
              class="full-width"
              @click="form.type = 'income'"
            />
          </div>
          <div class="col-6">
            <q-btn
              :color="form.type === 'expense' ? 'negative' : 'grey-4'"
              label="Expense"
              unelevated
              class="full-width"
              @click="form.type = 'expense'"
            />
          </div>
        </div>

          <q-form @submit.prevent="submitForm">
        <q-input
          filled
          dense
          v-model="form.date"
          type="date"
          label="Date"
          class="q-mb-sm tall-input"
        >
          <template #prepend><q-icon name="event" /></template>
        </q-input>

        <q-input
          filled
          dense
          v-model.number="form.amount"
          type="number"
          label="Amount"
          prefix="$"
          class="q-mb-sm tall-input"
        >
          <template #prepend><q-icon name="attach_money" /></template>
        </q-input>

        <q-select
          filled
          dense
          v-model="form.category"
          :options="categories"
          label="Category"
          class="q-mb-sm tall-input"
        >
          <template #prepend><q-icon name="category" /></template>
        </q-select>

        <q-input
          filled
          v-model="form.comment"
          label="Notes"
          autogrow
          class="tall-input q-mb-md"
        >
          <template #prepend><q-icon name="description" /></template>
        </q-input>

        <q-btn
          unelevated
          color="primary"
          class="full-width save-btn"
          label="Save Entry"
          type="submit"
          icon="check"
        />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import Tesseract from 'tesseract.js'

const emit = defineEmits(['saved', 'close'])
const $q = useQuasar()

const isDialogOpen = ref(true)
const fileInput = ref(null)
const videoRef = ref(null)
let stream = null

const showCamera = ref(false)
const capturedImage = ref(null)
const scanning = ref(false)

const form = reactive({
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: '',
  comment: ''
})

const incomeCategories = ['Salary', 'Bonus', 'Business', 'Investments', 'Other']
const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Rent', 'Other']
const categories = computed(() => (form.type === 'income' ? incomeCategories : expenseCategories))

// CAMERA --------------------------------------------------------------------
async function openCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    await nextTick()
    videoRef.value.srcObject = stream
    await videoRef.value.play()
    showCamera.value = true
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Camera not accessible' })
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
  showCamera.value = false
}

function capturePhoto() {
  const v = videoRef.value
  const canvas = document.createElement('canvas')
  canvas.width = v.videoWidth
  canvas.height = v.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.9)
  stopCamera()
  $q.notify({ type: 'positive', message: 'Captured successfully' })
}

// UPLOAD --------------------------------------------------------------------
function triggerFileInput() {
  fileInput.value && fileInput.value.click()
}

function onFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => (capturedImage.value = ev.target.result)
  reader.readAsDataURL(file)
  e.target.value = ''
}

// SCAN (OCR via Tesseract) --------------------------------------------------
async function scanBill() {
  if (!capturedImage.value) {
    $q.notify({ type: 'warning', message: 'No image to scan' })
    return
  }
  scanning.value = true
  $q.notify({ type: 'info', message: 'Scanning bill, please wait...' })
  try {
    const { data } = await Tesseract.recognize(capturedImage.value, 'eng', {
      logger: (m) => console.log(m)
    })

    const text = data.text
    console.log('OCR result:', text)

    // Extract numbers & keywords
    const amounts = text.match(/\d+(\.\d{1,2})?/g)?.map(Number) || []
    const total = Math.max(...amounts, 0)

    form.amount = total || form.amount

    if (/food|restaurant|meal|coffee/i.test(text)) form.category = 'Food'
    else if (/rent/i.test(text)) form.category = 'Rent'
    else if (/transport|bus|taxi|fuel/i.test(text)) form.category = 'Transport'
    else if (/bill|utility|electric|water/i.test(text)) form.category = 'Bills'
    else if (/shopping|store|amazon|mall/i.test(text)) form.category = 'Shopping'
    else form.category = 'Other'

    form.comment = 'Scanned: ' + text.slice(0, 60) + '...'
    $q.notify({ type: 'positive', message: 'Bill scanned successfully!' })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Scan failed' })
  } finally {
    scanning.value = false
  }
}

function clearCaptured() {
  capturedImage.value = null
}

// SAVE ----------------------------------------------------------------------
function submitForm() {
  if (!form.amount || !form.category) {
    $q.notify({ type: 'negative', message: 'Fill amount & category' })
    return
  }
  const entry = { ...form, id: Date.now(), receipt: capturedImage.value }
  emit('saved', entry)
  $q.notify({ type: 'positive', message: 'Saved successfully!' })
  handleClose()
}

function handleClose() {
  stopCamera()
  isDialogOpen.value = false
  emit('close')
}

onBeforeUnmount(() => stopCamera())
</script>

<style scoped>
.form-card {
  max-width: 520px;
  width: 100%;
  border-radius: 12px;
}
.scanner-block {
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background: #f9f9ff;
  padding: 10px;
}
.scan-btn {
  border-radius: 8px;
  min-height: 42px;
  font-weight: 600;
}
.camera-box {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
.camera-preview {
  width: 100%;
  border-radius: 8px;
}
.tall-input .q-field__control {
  min-height: 52px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.large-btn {
  min-height: 48px;
  border-radius: 8px;
}
.save-btn {
  min-height: 52px;
  font-weight: 600;
  border-radius: 8px;
}
.hidden {
  display: none;
}
</style>
