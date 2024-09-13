<template>
  <div class="relative">
    <div class="absolute left-0 top-0">
      
    </div>
    <div ref="mapContainer">
      <div id="map"></div>
    </div>
    <div class="absolute top-0 left-0 sm:w-[12rem] w-[8rem] cursor-pointer" style="z-index: 1000">
      <router-link to="/">
        <img
        alt="Vue logo"
        class="pointer-events-none"
        src="@/assets/images/go.svg"
        loading="lazy"
        />
      </router-link>
    </div>
    <div class="absolute sm:bottom-[5%] bottom-[2%] left-[50%] translate-x-[-50%] w-[82%] overflow-x-auto hover-scrollbar" ref="scrollContainer" style="z-index: 1000">
      <div class="flex space-x-4 pb-2 inline-flex">
        <div v-for="item in mapPageArr" :key="item.Name" class="flex-shrink-0 rounded-lg shadow-lg p-4 bg-white w-[10rem] h-[10rem] bg-cover bg-center bg-no-repeat" 
        :style="{ backgroundImage: `url(${item.picture})` }">
          <div class="font-bold mb-2 text-white">{{ item.name }}</div>
          <div class="text-sm text-gray-600">{{ item.region }} {{ item.town }}</div>
          <div class="text-sm mt-2">{{ item.add }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { useDataStore } from '@/stores/dataStore'
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useDataStore()
const paginatedItems = computed(() => store.paginatedItems)
const currentItem = ref(null)

// 直接從 localStorage 讀取 localMapPageArr
const mapPageArr = ref(JSON.parse(localStorage.getItem('localMapPageArr') || '[]'))
const loadedFromLocalStorage = ref(mapPageArr.value.length > 0)

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const scrollContainer = ref(null)

const loadItemData = () => {
  const storedItem = localStorage.getItem('localMapPageArr')
  if (storedItem === '[]') {
    router.push('/')
  }
}

onMounted(async () => {
  loadItemData()
  await nextTick()
  if (mapPageArr.value.length > 0) {
    initMap()
    addMarkers()
  }
  
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('wheel', handleHorizontalScroll, { passive: false })
  }
})

function initMap() {
  if (mapPageArr.value.length === 0) return

  const validCoords = mapPageArr.value.filter((item) => !isNaN(item.py) && !isNaN(item.px))
  if (validCoords.length === 0) return

  const avgLat = validCoords.reduce((sum, item) => sum + item.py, 0) / validCoords.length
  const avgLng = validCoords.reduce((sum, item) => sum + item.px, 0) / validCoords.length

  map.value = L.map('map', {
    zoomControl: false // 禁用默認的縮放控件
  }).setView([avgLat, avgLng], 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)
}

function addMarkers() {
  if (!map.value || mapPageArr.value.length === 0) return

  const bounds = L.latLngBounds()

  mapPageArr.value.forEach((item) => {
    if (item.px && item.py && !isNaN(item.px) && !isNaN(item.py)) {
      const marker = L.marker([item.py, item.px])
        .addTo(map.value)
        .bindTooltip(item.name, { permanent: true, direction: 'top' })
      markers.value.push(marker)
      bounds.extend([item.py, item.px])
    }
  })

  if (bounds.isValid()) {
    map.value.fitBounds(bounds, { padding: [50, 50] })
  }
}

// 監聽 mapPageArr 的變化，更新地圖和 localStorage
watch(
  mapPageArr,
  (newValue) => {
    // 更新 localStorage
    localStorage.setItem('localMapPageArr', JSON.stringify(newValue))

    // 更新地圖
    if (map.value) {
      markers.value.forEach((marker) => map.value.removeLayer(marker))
      markers.value = []
      addMarkers()
    }
  },
  { deep: true }
)

// 監聽 paginatedItems，更新 mapPageArr
watch(
  paginatedItems,
  (newItems) => {
    if (!loadedFromLocalStorage.value || newItems.length > 0) {
      mapPageArr.value = newItems.map((item) => ({
        name: item.Name,
        px: item.Px,
        py: item.Py,
        picture: item.Picture1,
        region: item.Region,
        town: item.Town,
        add: item.Add,
      }))
      loadedFromLocalStorage.value = false // 重置標誌
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
  
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('wheel', handleHorizontalScroll)
  }
})

function handleHorizontalScroll(e) {
  if (e.deltaY !== 0) {
    e.preventDefault()
    scrollContainer.value.scrollLeft += e.deltaY * 2 // 增加滾動速度
  }
}
</script>
<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>
