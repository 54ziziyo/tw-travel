<template>
  <div>
    <!-- <div class="mt-[25px]">
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/detail">詳細</RouterLink>
    </div> -->
  <RouterView />
  </div>

</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useDataStore } from './stores/dataStore'
import { onMounted } from 'vue'

const store = useDataStore()

onMounted(() => {
  store.loadTreasures()
  console.log('Loaded treasures:', store.treasures) // 添加这行来检查加载的数据
})
</script>