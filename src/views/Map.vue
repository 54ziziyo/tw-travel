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
    <div class="absolute sm:right-24 sm:top-8 right-4 top-4 cursor-pointer" @click="activate('right')" style="z-index: 1000">
        <div v-if="store.treasures.length > 0" class="absolute -right-2 top-0 bg-[#da0000] px-2 text-right text-white rounded-full">
        {{ store.treasures.length > 99 ? '99+' : store.treasures.length }}
        </div>
        <div class="bg-[#FF6F6E] rounded-full flex p-4">
        <n-icon size="30" class="text-white cursor-pointer"><HeartSharp /></n-icon>
        </div>
    </div>
    <div class="absolute sm:bottom-[2%] bottom-[5%] left-[50%] px-8 translate-x-[-50%] w-[100%] overflow-x-auto hover-scrollbar" ref="scrollContainer" style="z-index: 1000">
      <div class="flex space-x-6 pb-2 inline-flex text-white">
        <div v-for="item in mapPageArr" :key="item.Name" class="drop-shadow-lg relative flex-shrink-0 rounded-lg shadow-lg p-4 cursor-pointer bg-white sm:w-[15rem] sm:h-[15rem] w-[10rem] h-[10rem] bg-cover bg-center bg-no-repeat" 
        :style="{ backgroundImage: `url(${item.Picture1})` }" @click="goToDetail(item)">
        <div class="absolute bottom-4">
         <div class="py-1 px-2 bg-[#FF6F6E] text-[12px] sm:text-[16px] w-fit text-white rounded-md drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
            {{ item.Region }}・{{ item.Town }}
          </div>
          <div class="line-clamp-1 text-[0.865rem] sm:text-[1.25rem] font-semibold drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] tracking-widest text-white text-ellipsis overflow-hidden">
            {{ item.Name }}
          </div>
          <div class="drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] flex items-center text-white text-[11px] sm:text-[12px]">
            <div class="flex items-center space-x-[1px] pr-4">
              <n-icon size="16"><LocationSharp /></n-icon>
              <p class="line-clamp-1">{{item.Add}}</p>
            </div>
          </div>
        </div>
        <div @click.stop="toggleTreasure(item)" class="absolute top-0 right-0 w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] flex justify-center items-center rounded-tr-lg rounded-bl-lg shadow-lg cursor-pointer text-[#FF6F6E] bg-white">
          <n-icon v-if="isItemTreasure(item)" size="25"><HeartSharp /></n-icon>
          <n-icon v-else size="25"><HeartOutline /></n-icon>
        </div>
        </div>
      </div>
    </div>
    <TreasureList v-model:active="store.activeTreasure" />
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { useDataStore } from '@/stores/dataStore'
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import { HeartSharp, HeartOutline, LocationSharp } from '@vicons/ionicons5'
import TreasureList from '../components/TreasureList.vue'

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

  const validCoords = mapPageArr.value.filter((item) => !isNaN(item.Py) && !isNaN(item.Px))
  if (validCoords.length === 0) return

  const avgLat = validCoords.reduce((sum, item) => sum + item.Py, 0) / validCoords.length
  const avgLng = validCoords.reduce((sum, item) => sum + item.Px, 0) / validCoords.length

  map.value = L.map('map', {
    zoomControl: false // 禁用默認的縮放控件
  }).setView([avgLat, avgLng], 1)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)
}

function addMarkers() {
  if (!map.value || mapPageArr.value.length === 0) return

  const bounds = L.latLngBounds()

  mapPageArr.value.forEach((item) => {
    if (item.Px && item.Py && !isNaN(item.Px) && !isNaN(item.Py)) {
      const marker = L.marker([item.Py, item.Px])
        .addTo(map.value)
        .bindTooltip(item.Name, { permanent: true, direction: 'top' })
      markers.value.push(marker)
      bounds.extend([item.Py, item.Px])
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
        mapPageArr.value = newItems
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

// 添加切換收藏的方法
const toggleTreasure = (item) => {
  store.toggleTreasure(item)
}

const isItemTreasure = (item) => {
  const treasures = JSON.parse(localStorage.getItem('treasures') || '[]');
  return treasures.some(treasure => 
    treasure.Name === item.Name && 
    treasure.Px === item.Px && 
    treasure.Py === item.Py
  );
}

const goToDetail = (item) => {
  localStorage.setItem('currentItem', JSON.stringify(item));
  router.push(`/${item.Name}`);
}
const activate = () => {
  store.activeTreasure = true
}
</script>
<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>
