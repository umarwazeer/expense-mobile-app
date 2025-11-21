<!-- src/pages/CategoryPage.vue -->
<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-none">Category Management</h4>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Add Category"
          @click="openCategoryDialog()"
        />
      </div>
    </div>

    <!-- Search Bar -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchTerm"
          outlined
          dense
          placeholder="Search categories..."
          @update:model-value="filterCategories"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append v-if="searchTerm">
            <q-icon
              name="close"
              class="cursor-pointer"
              @click="searchTerm = ''; filterCategories()"
            />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-6 text-right">
        <q-btn-group outline>
          <q-btn
            :color="viewMode === 'grid' ? 'primary' : 'grey'"
            icon="grid_view"
            @click="viewMode = 'grid'"
          />
          <q-btn
            :color="viewMode === 'list' ? 'primary' : 'grey'"
            icon="list"
            @click="viewMode = 'list'"
          />
        </q-btn-group>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Categories Grid View -->
    <div v-else-if="viewMode === 'grid'" class="row q-col-gutter-md">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="category-card">
          <q-img
            v-if="category.image_url"
            :src="category.image_url"
            :alt="category.name"
            height="150px"
            class="bg-grey-1"
          >
            <div class="absolute-bottom text-subtitle2 text-center">
              {{ category.name }}
            </div>
          </q-img>
          <div v-else class="category-placeholder">
            <q-icon name="category" size="60px" color="grey-5" />
          </div>

          <q-card-section>
            <div class="text-h6">{{ category.name }}</div>
            <div class="text-caption text-grey-7">
              {{ category.description || 'No description' }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-chip
              :color="category.status === 'active' ? 'green' : 'red'"
              text-color="white"
              size="sm"
            >
              {{ category.status }}
            </q-chip>
            <div class="text-caption text-grey-6 q-mt-sm">
              Created: {{ formatDate(category.created_at) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              flat
              dense
              color="primary"
              icon="edit"
              @click="openCategoryDialog(category)"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              :color="category.status === 'active' ? 'warning' : 'positive'"
              :icon="category.status === 'active' ? 'visibility_off' : 'visibility'"
              @click="toggleStatus(category)"
            >
              <q-tooltip>Toggle Status</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              color="negative"
              icon="delete"
              @click="deleteCategory(category)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Categories List View -->
    <q-table
      v-else
      :rows="filteredCategories"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      class="category-table"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-avatar square size="50px">
            <img v-if="props.row.image_url" :src="props.row.image_url" />
            <q-icon v-else name="category" color="grey-5" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.status === 'active' ? 'green' : 'red'"
            text-color="white"
            size="sm"
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            color="primary"
            icon="edit"
            size="sm"
            @click="openCategoryDialog(props.row)"
          />
          <q-btn
            flat
            dense
            round
            :color="props.row.status === 'active' ? 'warning' : 'positive'"
            :icon="props.row.status === 'active' ? 'visibility_off' : 'visibility'"
            size="sm"
            @click="toggleStatus(props.row)"
          />
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="deleteCategory(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Category Dialog -->
    <q-dialog v-model="categoryDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editMode ? 'Edit Category' : 'Add New Category' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveCategory" class="q-gutter-md">
            <q-input
              v-model="categoryForm.name"
              label="Category Name *"
              outlined
              :rules="[val => !!val || 'Name is required']"
            />

            <q-input
              v-model="categoryForm.description"
              label="Description"
              outlined
              type="textarea"
              rows="3"
            />

            <q-select
              v-model="categoryForm.parent"
              :options="parentCategoryOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              outlined
              label="Parent Category"
              clearable
            />

            <q-select
              v-model="categoryForm.status"
              :options="statusOptions"
              outlined
              label="Status"
            />

            <q-file
              v-model="categoryForm.image"
              label="Category Image"
              outlined
              accept="image/*"
              max-file-size="5242880"
              @rejected="onRejectedFile"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancel"
                color="grey"
                flat
                v-close-popup
                @click="resetForm"
              />
              <q-btn
                label="Save"
                type="submit"
                color="primary"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

const $q = useQuasar()

// State
const categories = ref([])
const filteredCategories = ref([])
const loading = ref(false)
const saving = ref(false)
const searchTerm = ref('')
const viewMode = ref('grid')
const categoryDialog = ref(false)
const editMode = ref(false)
const currentCategory = ref(null)

// Form
const categoryForm = ref({
  name: '',
  description: '',
  parent: null,
  status: 'active',
  image: null
})

// Table columns
const columns = [
  {
    name: 'image',
    label: 'Image',
    align: 'center',
    field: 'image'
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: 'description'
  },
  {
    name: 'status',
    label: 'Status',
    align: 'center',
    field: 'status'
  },
  {
    name: 'created_at',
    label: 'Created',
    align: 'center',
    field: row => formatDate(row.created_at),
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center'
  }
]

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

const statusOptions = ['active', 'inactive']

const parentCategoryOptions = computed(() => {
  if (editMode.value && currentCategory.value) {
    // Exclude current category and its children from parent options
    return categories.value.filter(cat => 
      cat.id !== currentCategory.value.id
    )
  }
  return categories.value
})

// Methods
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/categories/')
    categories.value = response.data
    filteredCategories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch categories',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const filterCategories = () => {
  if (!searchTerm.value) {
    filteredCategories.value = categories.value
    return
  }
  
  const search = searchTerm.value.toLowerCase()
  filteredCategories.value = categories.value.filter(category =>
    category.name.toLowerCase().includes(search) ||
    (category.description && category.description.toLowerCase().includes(search))
  )
}

const openCategoryDialog = (category = null) => {
  if (category) {
    editMode.value = true
    currentCategory.value = category
    categoryForm.value = {
      name: category.name,
      description: category.description,
      parent: category.parent,
      status: category.status,
      image: null
    }
  } else {
    editMode.value = false
    currentCategory.value = null
    resetForm()
  }
  categoryDialog.value = true
}

const resetForm = () => {
  categoryForm.value = {
    name: '',
    description: '',
    parent: null,
    status: 'active',
    image: null
  }
  editMode.value = false
  currentCategory.value = null
}

const saveCategory = async () => {
  saving.value = true
  
  try {
    const formData = new FormData()
    formData.append('name', categoryForm.value.name)
    formData.append('description', categoryForm.value.description || '')
    formData.append('status', categoryForm.value.status)
    
    if (categoryForm.value.parent) {
      formData.append('parent', categoryForm.value.parent)
    }
    
    if (categoryForm.value.image) {
      formData.append('image', categoryForm.value.image)
    }
    
    let response
    if (editMode.value) {
      response = await api.patch(`/api/categories/${currentCategory.value.slug}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      $q.notify({
        type: 'positive',
        message: 'Category updated successfully',
        position: 'top'
      })
    } else {
      response = await api.post('/api/categories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      $q.notify({
        type: 'positive',
        message: 'Category created successfully',
        position: 'top'
      })
    }
    
    categoryDialog.value = false
    resetForm()
    fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.name?.[0] || 'Failed to save category',
      position: 'top'
    })
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (category) => {
  try {
    await api.post(`/api/categories/${category.slug}/toggle_status/`)
    
    // Update local state
    category.status = category.status === 'active' ? 'inactive' : 'active'
    
    $q.notify({
      type: 'positive',
      message: `Category status changed to ${category.status}`,
      position: 'top'
    })
  } catch (error) {
    console.error('Error toggling status:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to update status',
      position: 'top'
    })
  }
}

const deleteCategory = async (category) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${category.name}"?`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(async () => {
    try {
      await api.delete(`/api/categories/${category.slug}/`)
      
      $q.notify({
        type: 'positive',
        message: 'Category deleted successfully',
        position: 'top'
      })
      
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      $q.notify({
        type: 'negative',
        message: 'Failed to delete category',
        position: 'top'
      })
    }
  })
}

const formatDate = (dateString) => {
  return date.formatDate(dateString, 'MMM DD, YYYY')
}

const onRejectedFile = () => {
  $q.notify({
    type: 'negative',
    message: 'File size must be less than 5MB',
    position: 'top'
  })
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
.category-card {
  transition: transform 0.3s;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .category-placeholder {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }
}

.category-table {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
</style>