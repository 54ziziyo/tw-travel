<template>
  <div>
    <Header region-title selector/>
    <div class="px-5 sm:px-20 pt-14 sm:pt-20">
      <div v-if="noDataMessage" class="mt-4 text-center text-red-500 text-lg">
        {{ noDataMessage }}
      </div>
      <ItemGrid v-else-if="store.filteredItems.length > 0" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useDataStore } from '../stores/dataStore'
import Header from '../components/Header.vue'
import ItemGrid from '../components/ItemGrid.vue'

const store = useDataStore()
const noDataMessage = ref('')

onMounted(async () => {
  await Promise.all([store.fetchCityData(), store.fetchData()])
  document.addEventListener('click', handleOutsideClick)
  noDataMessage.value = store.noDataMessage
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

const handleOutsideClick = (event) => {
  store.closeDropdowns()
}
</script>