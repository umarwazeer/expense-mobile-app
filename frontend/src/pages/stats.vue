<template>
  <q-page padding class="bg-grey-1">
    <div class="container">
      <!-- <div class="row items-center justify-between q-mb-md">
        <div>
          <div class="text-h6">Reports — Analytics</div>
          <div class="text-caption text-grey">Charts, trend lines, projections & AI Insights</div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-input dense outlined v-model="quickSearch" placeholder="Quick search..." @input="applyQuickSearch" />
          <q-btn dense color="primary" icon="refresh" @click="loadAll" />
        </div>
      </div> -->

      <q-card flat bordered class="rounded-borders q-pa-sm">
        <q-tabs v-model="tab" dense align="justify" active-color="teal" indicator-color="teal" narrow-indicator>
          <q-tab name="daily" label="Daily" />
          <q-tab name="weekly" label="Weekly" />
          <q-tab name="monthly" label="Monthly" />
          <q-tab name="custom" label="Custom Range" />
        </q-tabs>

        <q-separator />

        <div class="row q-mt-sm q-gutter-sm items-center">
          <div class="col">
            <q-btn dense flat color="primary" icon="download" label="Export CSV" @click="exportVisibleCSV" />
            <q-btn dense flat color="primary" icon="picture_as_pdf" label="Export PDF" @click="exportVisiblePDF" />
          </div>

          <div class="col-auto">
            <q-toggle dense v-model="compactCharts" label="Compact" />
          </div>
        </div>

        <q-tab-panels v-model="tab" animated class="q-mt-sm">
          <!-- DAILY analytics -->
          <q-tab-panel name="daily">
            <div class="row q-col-gutter-md">
              <div class="col-12 md:col-8">
                <q-card flat class="q-pa-sm bg-white">
                  <div class="text-subtitle2 text-weight-bold q-mb-xs">Hourly Trend</div>
                  <apexchart v-if="dailyChart.series?.length" :options="dailyChart.options" :series="dailyChart.series" type="area" :height="compactCharts ? 200 : 320" />
                </q-card>
              </div>

              <div class="col-12 md:col-4">
                <q-card flat class="q-pa-sm bg-white">
                  <div class="text-subtitle2 text-weight-bold q-mb-xs">Category Breakdown</div>
                  <apexchart v-if="dailyDonut.series?.length" :options="dailyDonut.options" :series="dailyDonut.series" type="donut" :height="compactCharts ? 180 : 260" />
                </q-card>
                <q-card flat class="q-pa-sm bg-white q-mt-sm">
                  <div class="text-subtitle2 text-weight-bold">Top items</div>
                  <q-list dense>
                    <q-item v-for="t in dailyTop" :key="t.id">
                      <q-item-section>{{ t.description }}</q-item-section>
                      <q-item-section side>{{ formatCurrency(t.amount) }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- WEEKLY analytics -->
          <q-tab-panel name="weekly">
            <q-card flat class="q-pa-sm bg-white">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Weekly Daily Totals</div>
              <apexchart v-if="weeklyChart.series?.length" :options="weeklyChart.options" :series="weeklyChart.series" type="bar" :height="compactCharts ? 220 : 360" />
            </q-card>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 md:col-6">
                <q-card flat class="q-pa-sm bg-white">
                  <div class="text-subtitle2 text-weight-bold q-mb-xs">Category Share</div>
                  <apexchart v-if="weeklyDonut.series?.length" :options="weeklyDonut.options" :series="weeklyDonut.series" type="donut" :height="220" />
                </q-card>
              </div>
              <div class="col-12 md:col-6">
                <q-card flat class="q-pa-sm bg-white">
                  <div class="text-subtitle2 text-weight-bold q-mb-xs">Top Transactions</div>
                  <q-list dense bordered>
                    <q-item v-for="tx in weeklyTop" :key="tx.id">
                      <q-item-section>
                        <q-item-label>{{ tx.description }}</q-item-label>
                        <q-item-label caption>{{ tx.category }} • {{ tx.date }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <div :class="tx.type === 'income'? 'text-positive' : 'text-negative'">{{ formatCurrency(tx.amount) }}</div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- MONTHLY analytics -->
          <q-tab-panel name="monthly">
            <q-card flat class="q-pa-sm bg-white">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Monthly Trend</div>
              <apexchart v-if="monthlyChart.series?.length" :options="monthlyChart.options" :series="monthlyChart.series" type="line" :height="compactCharts ? 220 : 380" />
            </q-card>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 md:col-6">
                <q-card flat class="q-pa-sm bg-white">
                  <div class="text-subtitle2 text-weight-bold q-mb-xs">Category Performance</div>
                  <apexchart v-if="monthlyCategory.series && monthlyCategory.series.length" :options="monthlyCategory.options" :series="monthlyCategory.series" type="bar" :height="260" />
                </q-card>
              </div>

              <div class="col-12 md:col-6">
                <q-card flat class="q-pa-sm bg-white">
                  <div class="text-subtitle2 text-weight-bold q-mb-xs">AI Insights</div>
                  <div class="text-h6">{{ insights.topCategory.name }} <span class="text-caption text-grey">({{ insights.topCategory.percent }}%)</span></div>
                  <div class="q-mt-sm">
                    <div>Trend: <strong :class="insights.trend.direction === 'up' ? 'text-positive' : 'text-negative'">{{ insights.trend.percent }}% {{ insights.trend.direction }}</strong></div>
                    <div class="q-mt-xs">Projection (next month): <strong>{{ formatCurrency(insights.projection) }}</strong></div>
                  </div>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- CUSTOM -->
          <q-tab-panel name="custom">
            <div class="row q-col-gutter-sm items-end q-mb-sm">
              <div class="col">
                <q-input dense filled type="date" v-model="customRange.start" label="Start" />
              </div>
              <div class="col">
                <q-input dense filled type="date" v-model="customRange.end" label="End" />
              </div>
              <div class="col-auto">
                <q-btn color="teal" label="Load" @click="loadCustomReport" />
              </div>
            </div>

            <div v-if="customReport">
              <q-card flat class="q-pa-sm bg-white">
                <div class="text-subtitle2 text-weight-bold">Custom Range Trend</div>
                <apexchart v-if="customChart.series?.length" :options="customChart.options" :series="customChart.series" type="area" :height="260" />
              </q-card>

              <div class="q-mt-sm">
                <div class="text-subtitle2 text-weight-bold">Category Totals</div>
                <q-list bordered>
                  <q-item v-for="c in customReport.categories" :key="c.name">
                    <q-item-section>{{ c.name }}</q-item-section>
                    <q-item-section side>{{ formatCurrency(c.amount) }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            <div v-else class="text-caption text-grey">Pick range and load report.</div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <!-- transactions table (quick view) -->
      <div class="q-mt-md">
        <q-card flat class="bg-white q-pa-sm rounded-borders">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle1">Transactions (quick)</div>
            <div class="row items-center q-gutter-sm">
              <q-select dense v-model="quickFilterType" :options="[{label:'All',value:'all'},{label:'Income',value:'income'},{label:'Expense',value:'expense'}]" />
              <q-btn dense flat icon="download" @click="exportVisibleCSV" />
            </div>
          </div>

          <q-table flat dense :rows="tableRows" :columns="tableCols" row-key="id" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import axios from 'axios'
import Papa from 'papaparse'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const inst = getCurrentInstance()
if (inst && inst.appContext && inst.appContext.components) inst.appContext.components['apexchart'] = ApexCharts

// state
const tab = ref('daily')
const compactCharts = ref(false)
const quickSearch = ref('')
const quickFilterType = ref('all')

const rawData = ref([])
const categories = ref([])

// chart states (safe guards for empty series)
const dailyChart = reactive({ series: [], options: {} })
const dailyDonut = reactive({ series: [], options: {} })
const dailyTop = ref([])

const weeklyChart = reactive({ series: [], options: {} })
const weeklyDonut = reactive({ series: [], options: {} })
const weeklyTop = ref([])

const monthlyChart = reactive({ series: [], options: {} })
const monthlyCategory = reactive({ series: [], options: {} })

const insights = reactive({ topCategory:{name:'-',percent:0}, trend:{percent:0,direction:'up'}, projection:0, notes:[] })

const customRange = reactive({ start:'', end:'' })
const customReport = ref(null)
const customChart = reactive({ series:[], options:{} })

// table
const tableCols = [
  { name:'date', label:'Date', field:'date' },
  { name:'desc', label:'Description', field:'description' },
  { name:'category', label:'Category', field:'category' },
  { name:'type', label:'Type', field:'type' },
  { name:'amount', label:'Amount', field:'amount', align:'right' }
]
const tableRows = computed(() => rawData.value.filter(r => {
  if (!quickSearch.value) return quickFilterType.value === 'all' ? true : r.type === quickFilterType.value
  const q = quickSearch.value.toLowerCase()
  return ((r.description||'') + ' ' + (r.category||'') + ' ' + (r.date||'')).toLowerCase().includes(q) && (quickFilterType.value === 'all' ? true : r.type === quickFilterType.value)
}))

// small helpers
function formatCurrency(n){ if (n==null) return '-'; return 'Rs ' + Number(n).toLocaleString() }
function mkRandom(min,max){ return Math.floor(Math.random()*(max-min+1))+min }

// load sample mocks and build charts
function seedMock(){
  rawData.value = [
    { id:'1', date:'2025-11-21', description:'Salary', category:'Job', type:'income', amount:3000 },
    { id:'2', date:'2025-11-21', description:'Lunch', category:'Food', type:'expense', amount:150 },
    { id:'3', date:'2025-11-20', description:'Taxi', category:'Transport', type:'expense', amount:80 },
    { id:'4', date:'2025-11-19', description:'Groceries', category:'Food', type:'expense', amount:620 },
    { id:'5', date:'2025-11-18', description:'Freelance', category:'Freelance', type:'income', amount:500 },
    { id:'6', date:'2025-10-12', description:'Rent', category:'Rent', type:'expense', amount:1000 }
  ]
  categories.value = Array.from(new Set(rawData.value.map(r=>r.category)))
  buildDaily()
  buildWeekly()
  buildMonthly()
  computeInsightsLocal()
}

function buildDaily(){
  dailyChart.series = [
    { name:'Income', data: [mkRandom(200, 900), mkRandom(0, 600), mkRandom(0,400), mkRandom(0,500), mkRandom(0,600), mkRandom(0,200), mkRandom(0,300)]},
    { name:'Expense', data: [mkRandom(20,200), mkRandom(30,300), mkRandom(10,120), mkRandom(50,400), mkRandom(100,500), mkRandom(20,80), mkRandom(10,220)]}
  ]
  dailyChart.options = { chart:{toolbar:{show:false}}, xaxis:{categories:['1am','5am','9am','1pm','5pm','9pm','11pm']}, colors:['#10b981','#ef4444'], stroke:{curve:'smooth'}, legend:{position:'bottom'} }
  dailyDonut.series = [45,25,15,10,5]
  dailyDonut.options = { labels:['Food','Transport','Rent','Shopping','Other'], legend:{position:'bottom'} }
  dailyTop.value = rawData.value.filter(r=>r.type==='expense').sort((a,b)=>b.amount-a.amount).slice(0,5)
}

function buildWeekly(){
  weeklyChart.series = [
    { name:'Income', data: [1200,1500,900,1700,1300,1100,1400] },
    { name:'Expense', data: [800,900,700,1100,950,700,1200] }
  ]
  weeklyChart.options = { chart:{toolbar:{show:false}}, xaxis:{categories:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}, colors:['#10b981','#ef4444'] }
  weeklyDonut.series = [40,25,15,12,8]
  weeklyDonut.options = { labels:['Food','Transport','Rent','Bills','Other'], legend:{position:'bottom'} }
  weeklyTop.value = rawData.value.sort((a,b)=>b.amount-a.amount).slice(0,5)
}

function buildMonthly(){
  monthlyChart.series = [
    { name:'Income', data: [12000,14000,15000,13000,16000,17000] },
    { name:'Expense', data: [8000,9000,8500,9500,10000,11000] }
  ]
  monthlyChart.options = { chart:{toolbar:{show:false}}, xaxis:{categories:['May','Jun','Jul','Aug','Sep','Oct']}, colors:['#10b981','#ef4444'], stroke:{curve:'smooth'} }
  monthlyCategory.series = [
    { name:'Food', data:[1200,1100,1400,1200,1500,1250] },
    { name:'Transport', data:[400,500,450,600,500,450] }
  ]
  monthlyCategory.options = { chart:{stacked:false}, xaxis:{categories:['May','Jun','Jul','Aug','Sep','Oct']} }
}

function computeInsightsLocal(){
  // compute top category percent and projection (moving avg)
  const expenseTotals = {}
  rawData.value.filter(r=>r.type==='expense').forEach(r=> { expenseTotals[r.category] = (expenseTotals[r.category]||0) + r.amount })
  const entries = Object.entries(expenseTotals)
  const top = entries.sort((a,b)=>b[1]-a[1])[0] || ['-',0]
  const totalExp = entries.reduce((s,[k,v])=>s+v,0) || 1
  insights.topCategory = { name: top[0], percent: Math.round((top[1]/totalExp)*100) }
  // fake trend and projection:
  insights.trend = { percent: mkRandom(0,15), direction: (Math.random()>0.5?'up':'down') }
  insights.projection = mkRandom(-2000,5000)
  insights.notes = []
  if (insights.topCategory.percent > 30) insights.notes.push(`High spend: ${insights.topCategory.name}`)
}

async function loadCustomReport(){
  if (!customRange.start || !customRange.end){ $q.notify({ type:'warning', message:'Pick dates' }); return }
  // Replace with API: const res = await axios.get(`/api/expenses?start_date=${customRange.start}&end_date=${customRange.end}`)
  // build mock:
  const entries = rawData.value.filter(r => r.date >= customRange.start && r.date <= customRange.end)
  customReport.value = {
    income: entries.filter(e=>e.type==='income').reduce((s,e)=>s+e.amount,0),
    expense: entries.filter(e=>e.type==='expense').reduce((s,e)=>s+e.amount,0),
    categories: (function(){ const map={}; entries.forEach(e=> { map[e.category] = (map[e.category]||0) + e.amount }); return Object.keys(map).map(k=>({name:k, amount:map[k]})) })(),
    daily: entries.slice(0,30).map((e,i)=>({ label: e.date, income: e.type==='income'?e.amount:0, expense: e.type==='expense'?e.amount:0 }))
  }
  customChart.series = [
    { name:'Income', data: customReport.value.daily.map(d=>d.income) },
    { name:'Expense', data: customReport.value.daily.map(d=>d.expense) }
  ]
  customChart.options = { chart:{toolbar:{show:false}}, xaxis:{categories: customReport.value.daily.map(d=>d.label)} }
  logAction(`Loaded custom ${customRange.start}→${customRange.end}`)
}

// exports - reuse functions from list file or duplicate small wrappers
function downloadBlob(content, filename, mime='text/csv;charset=utf-8;'){ const blob = new Blob([content],{type:mime}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url) }
function exportCSVRows(rows, filename){ const csv = Papa.unparse(rows); downloadBlob(csv, filename) }
function exportJSONRows(rows, filename){ downloadBlob(JSON.stringify(rows,null,2), filename, 'application/json') }
async function exportPDFFromElementAndTable(selector, head, body, title){
  const doc = new jsPDF('p','pt','a4'); doc.setFontSize(14); doc.text(title,40,40)
  await nextTick()
  const el = document.querySelector(selector)
  if (el){
    const canvas = await html2canvas(el, { scale:2 }); const img = canvas.toDataURL('image/png')
    const pdfW = doc.internal.pageSize.getWidth() - 80; const imgProps = doc.getImageProperties(img)
    const imgH = pdfW * (imgProps.height / imgProps.width); doc.addImage(img, 'PNG', 40, 70, pdfW, imgH)
    const startY = 70 + imgH + 10; if (body && body.length) autoTable(doc, { startY, head, body, styles:{fontSize:9} })
  } else { if (body && body.length) autoTable(doc, { startY: 80, head, body, styles:{fontSize:9} }) }
  doc.save(`${title.replace(/\s+/g,'_')}_${(new Date()).toISOString().slice(0,10)}.pdf`)
}

function exportVisibleCSV(){
  if (tab.value === 'daily') exportCSVRows(dailyTop.value,'daily_analytics.csv')
  else if (tab.value === 'weekly') exportCSVRows(weeklyTop.value,'weekly_analytics.csv')
  else if (tab.value === 'monthly') exportCSVRows(rawData.value,'monthly_analytics.csv')
  else if (tab.value === 'custom' && customReport.value) exportCSVRows(customReport.value.categories, `custom_${customRange.start}_${customRange.end}.csv`)
  logAction('Exported CSV')
}

async function exportVisiblePDF(){
  if (tab.value === 'daily') await exportPDFFromElementAndTable('.apexcharts', [['Desc','Amount']], dailyTop.value.map(t=>[t.description,t.amount]), 'Daily Analytics')
  else if (tab.value === 'weekly') await exportPDFFromElementAndTable('.apexcharts', [['Desc','Amount']], weeklyTop.value.map(t=>[t.description,t.amount]), 'Weekly Analytics')
  else if (tab.value === 'monthly') await exportPDFFromElementAndTable('.apexcharts', [['Date','Desc','Amount']], rawData.value.map(r=>[r.date,r.description,r.amount]), 'Monthly Analytics')
  else if (tab.value === 'custom' && customReport.value) await exportPDFFromElementAndTable('.apexcharts', [['Category','Amount']], customReport.value.categories.map(c=>[c.name,c.amount]), `Custom ${customRange.start}_${customRange.end}`)
  logAction('Exported PDF')
}

function logAction(msg){
  // simple global console + in-app notification
  console.info(msg)
  $q.notify({ type:'positive', message: msg })
}

// quick helpers
function applyQuickSearch(){ /* reactive */ }

// load / init
function loadAll(){
  seedMock()
  $q.notify({ type:'info', message:'Loaded sample data' })
}
onMounted(()=> loadAll())
</script>

<style scoped>
.container { max-width:1100px; margin:0 auto; }
.rounded-borders { border-radius: 10px; }
.bg-grey-1 { background-color: #f6f7f9; }
.apexcharts { max-width:100% }
</style>
