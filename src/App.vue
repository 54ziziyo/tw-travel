<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useDataStore } from './stores/dataStore'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const store = useDataStore()
const route = useRoute()

onMounted(() => {
  store.loadTreasures()
})

watch(() => route.fullPath, () => {
  window.scrollTo(0, 0);
});
</script>