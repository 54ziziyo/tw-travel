<template>
    <n-drawer v-model:show="isActive" :width="drawerWidth" class="!rounded-tl-xl !rounded-bl-xl overflow-y-auto select-none">
      <div class="text-[1rem] font-medium tracking-wider mb-4 bg-[#FF6F6E] text-white px-4 sm:py-3 py-2 text-center flex items-center justify-center">收藏景點</div>
        <div v-if="store.treasures.length === 0" class="text-center py-4 text-gray-500">去添加你的收藏吧！</div>
        <div v-else v-for="(item, index) in store.treasures" :key="index" class="mb-4 flex pb-4 px-4" 
        :class="{ 'border-b border-gray-300': index !== store.treasures.length - 1 }">
        <div class="w-[180px] h-[70px]">
          <img class="rounded-lg w-full h-full object-cover pointer-events-none" :src="item.Picture1" :alt="item.Name" loading="lazy">
        </div>
          <div class="pl-2 w-full">
            <div class="flex justify-between items-center">
              <div class="text-[0.8rem] line-clamp-1 text-left font-medium">{{item.Name}}</div>
              <n-icon size="20" class="text-[#FF6F6E] cursor-pointer" @click="removeTreasure(item)"><CloseCircleOutline /></n-icon>
            </div>
            <div class="text-[0.7rem] line-clamp-1 text-left text-gray-500">{{item.Region}}・{{item.Town}}</div>
            <div @click="goToDetail(item)" class="text-[0.7rem] text-blue-500 cursor-pointer underline pt-1">詳細資訊</div>
          </div>
        </div>
    </n-drawer>
</template>

<script setup>
import { NDrawer, NIcon } from 'naive-ui'
import { ref, computed } from 'vue'
import { useDataStore } from '../stores/dataStore'
import { CloseCircleOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const props = defineProps({
  active: Boolean
})

const emit = defineEmits(['update:active'])
const router = useRouter()
const store = useDataStore()

const isActive = computed({
  get: () => props.active,
  set: (value) => emit('update:active', value)
})

const removeTreasure = (item) => {
  store.removeTreasure(item)
}

const drawerWidth = computed(() => {
  return window.innerWidth < 768 ? Math.max(200, window.innerWidth * 0.8) : 350
})

const goToDetail = (item) => {
console.log(item)
  localStorage.setItem('currentItem', JSON.stringify(item));
  router.push(`/${item.Name}`);
}
</script>