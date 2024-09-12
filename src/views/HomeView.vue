<template>
  <div>
    <Header />
    <div class="px-5 sm:px-20 pt-14 sm:pt-20">
      <!-- 使用本地的 ref 變量 -->
      <div v-if="noDataMessage" class="mt-4 text-center text-red-500 text-lg">
        {{ noDataMessage }}
      </div>

      <!-- 顯示過濾後的結果 -->
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

// 使用 ref 來確保響應性
const noDataMessage = ref('')

onMounted(async () => {
  await Promise.all([store.fetchCityData(), store.fetchData()])
  document.addEventListener('click', handleOutsideClick)
  // 在數據加載後更新 noDataMessage
  noDataMessage.value = store.noDataMessage
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

const handleOutsideClick = (event) => {
  store.closeDropdowns()
}
</script>