<template>
  <div>
    <Header region-title selector/>
    <div v-if="store.filteredItems.length > 0" class="px-5 sm:px-20 pt-14 sm:pt-20"><ItemGrid/></div>
      <div v-else class="flex justify-center items-center sm:pt-[12rem] pt-[8rem]">
        <n-empty description="目前尚未完整，敬請期待！" size="huge"></n-empty>
      </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useDataStore } from '../stores/dataStore'
import Header from '../components/Header.vue'
import ItemGrid from '../components/ItemGrid.vue'
import { NEmpty } from 'naive-ui'

const store = useDataStore()

onMounted(async () => {
  await Promise.all([store.fetchCityData(), store.fetchData()])
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

const handleOutsideClick = (event) => {
  store.closeDropdowns()
}
</script>