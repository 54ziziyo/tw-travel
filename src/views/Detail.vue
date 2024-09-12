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
              <div class="mb-1">營業時間</div>
              <div class="whitespace-break-spaces">{{ currentItem?.Opentime }}</div>
              </div>
            </div>
          </div>
           <div class="bg-white rounded-lg p-4 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.15)]">
            <div class="flex items-start space-x-2">
              <div class="flex items-center justify-center w-4 h-4 pt-1">
                <n-icon size="16"><InformationCircle /></n-icon>
              </div>
              <div>
              <div class="mb-1">旅遊資訊</div>
              <div class="whitespace-break-spaces">{{ currentItem?.Travellinginfo }}</div>
              </div>
            </div>
          </div>
           <div class="bg-white rounded-lg p-4 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.15)]">
            <div class="flex items-start space-x-2">
              <div class="flex items-center justify-center w-4 h-4 pt-1">
                <n-icon size="16"><Car /></n-icon>
              </div>
              <div>
              <div class="mb-1">停車資訊</div>
              <div class="whitespace-break-spaces">{{ currentItem?.Parkinginfo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/dataStore';
import Header from '../components/Header.vue'
import { NGrid, NGridItem, NPagination, NIcon } from 'naive-ui'
import { LocationSharp, Call, StorefrontSharp, Car, InformationCircle } from '@vicons/ionicons5'

const route = useRoute();
const store = useDataStore();

const currentItem = ref(null);

const loadCurrentItem = () => {
  const savedItem = localStorage.getItem('currentItem');
  if (savedItem) {
    currentItem.value = JSON.parse(savedItem);
  }
};

onMounted(() => {
  loadCurrentItem();
});

watch(() => route.path, () => {
  loadCurrentItem();
});

const formatToldescribe = (text) => {
  if (!text) return '';
  let result = '';
  let currentLength = 0;
  
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    currentLength++;
    
    if (currentLength > 80 && text[i] === '。') {
      result += '<br><br>';  // 使用两个 <br> 标签
      currentLength = 0;
    }
  }
  
  return result;
};

</script>
