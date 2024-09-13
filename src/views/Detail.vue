<template>
  <div class="text-[#00204A]">
    <Header :imgUrl="currentItem?.Picture1"/>
    <div class="px-5 sm:px-[4rem] md:px-[10rem] py-14 sm:pt-20 space-y-8">
      <div class="text-[40px] font-bold">{{ currentItem?.Name }}</div>
      <div class="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-8">
        <div class="sm:col-span-2">
          <div class="text-[18px]">{{ currentItem?.Description }} <br><br>
            <span v-html="formatToldescribe(currentItem?.Toldescribe)"></span></div>
        </div>
        <div class="space-y-4">
          <div class="bg-white rounded-lg p-4 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.15)] space-y-2">
            <div class="flex items-start space-x-2">
              <div class="flex items-center justify-center w-4 h-4 pt-1">
                <n-icon size="16"><LocationSharp /></n-icon>
              </div>
              <div>{{ currentItem?.Add }}</div>
            </div>
            <div class="flex items-start space-x-2">
              <div class="flex items-center justify-center w-4 h-4 pt-1">
                <n-icon size="16"><Call /></n-icon>
              </div>
              <a :href="`tel:${currentItem?.Tel}`" class="text-blue-500">{{ currentItem?.Tel }}</a>
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.15)]">
            <div class="flex items-start space-x-2">
              <div class="flex items-center justify-center w-4 h-4 pt-1">
                <n-icon size="16"><StorefrontSharp /></n-icon>
              </div>
              <div>
              <div>營業時間</div>
              <div class="whitespace-break-spaces mt-1">{{ currentItem?.Opentime }}</div>
              </div>
            </div>
          </div>
           <div class="bg-white rounded-lg p-4 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.15)]">
            <div class="flex space-x-2">
              <div class="flex items-center justify-center w-4 h-4 pt-1">
                <n-icon size="16"><InformationCircle /></n-icon>
              </div>
              <div>
              <div>旅遊資訊</div>
              <div class="whitespace-break-spaces mt-1">{{ currentItem?.Travellinginfo }}</div>
              <div class="whitespace-break-spaces mt-1 text-sm"><i>※ {{ currentItem?.Remarks }}</i></div>
              </div>
            </div>
          </div>
           <div class="bg-white rounded-lg p-4 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.15)]">
            <div class="flex items-start space-x-2">
              <div class="flex items-center justify-center w-4 h-4 pt-1">
                <n-icon size="16"><Car /></n-icon>
              </div>
              <div>
              <div>停車資訊</div>
              <div class="whitespace-break-spaces mt-1">{{ currentItem?.Parkinginfo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="mapContainer"><div id="map"></div></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore';
import Header from '../components/Header.vue'
import { NGrid, NGridItem, NPagination, NIcon } from 'naive-ui'
import { LocationSharp, Call, StorefrontSharp, Car, InformationCircle } from '@vicons/ionicons5'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const currentItem = ref(null);
const map = ref(null);
const mapContainer = ref(null);
const isComponentMounted = ref(false);

const loadItemData = () => {
  const storedItem = localStorage.getItem('currentItem');
  if (storedItem) {
    currentItem.value = JSON.parse(storedItem);
  } else {
    // 如果 localStorage 中沒有數據，重定向到首頁
    router.push('/');
  }
};

onMounted(() => {
  loadItemData();
});

const formatToldescribe = (text) => {
  if (!text) return '';
  let result = '';
  let currentLength = 0;
  
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    currentLength++;
    
    if (currentLength > 80 && text[i] === '。') {
      result += '<br><br>';
      currentLength = 0;
    }
  }
  
  return result;
};

const initMap = () => {
  if (currentItem.value && currentItem.value.Py && currentItem.value.Px && isComponentMounted.value) {
    nextTick(() => {
      if (map.value) {
        map.value.remove();
        map.value = null;
      }
      
      if (mapContainer.value) {
        mapContainer.value.innerHTML = '<div id="map" style="width: 100%; height: 400px;" class="rounded-lg"></div>';
        const mapElement = document.getElementById('map');
        if (mapElement) {
          map.value = L.map('map').setView([currentItem.value.Py, currentItem.value.Px], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map.value);

          L.marker([currentItem.value.Py, currentItem.value.Px])
            .addTo(map.value)
            .bindPopup(currentItem.value.Name)
            .openPopup();
        }
      }
    });
  }
};

console.log(currentItem.value)
watch(currentItem, () => {
  if (currentItem.value) {
    initMap();
  }
}, { immediate: true });

onMounted(() => {
  isComponentMounted.value = true;
  initMap();
});

onUnmounted(() => {
  isComponentMounted.value = false;
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});
</script>

<style>
@import 'leaflet/dist/leaflet.css';
</style>
