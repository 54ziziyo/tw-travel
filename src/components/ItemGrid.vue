<template>
  <div>
    <n-grid cols="2 s:3 m:4" x-gap="20" y-gap="20" responsive="screen">
      <n-grid-item
        v-for="(item, index) in paginatedItems"
        :key="`${item.Id}-${index}`"
        @click="goToDetail(item)"
        class="sm:h-[16rem] h-[12rem] rounded-2xl p-4 relative cursor-pointer overflow-hidden drop-shadow-lg select-none"
      >
        <div 
          v-if="!item.imageLoaded" 
          class="absolute inset-0 bg-gray-200 animate-pulse"
        ></div>
        <img
          :src="store.cleanImageUrl(item.Picture1)"
          @load="item.imageLoaded = true"
          @error="handleImageError(item)"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none select-none"
          :class="{ 'opacity-0': !item.imageLoaded, 'opacity-100': item.imageLoaded }"
          loading="lazy"
        />
        <div @click.stop="toggleTreasure(item)"
          class="absolute right-0 bg-white top-0 w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] flex justify-center items-center rounded-tr-lg rounded-bl-lg shadow-lg cursor-pointer text-[#FF6F6E]"
        >
          <n-icon v-if="isItemTreasure(item)" size="25"><HeartSharp /></n-icon>
          <n-icon v-else size="25"><HeartOutline /></n-icon>
        </div>
        <div class="absolute bottom-5 left-5 space-y-[2px]">
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
      </n-grid-item>
    </n-grid>
    <div class="py-14 sm:py-16 flex justify-center">
      <n-pagination
        v-if="totalPages > 1"
        v-model:page="store.currentPage"
        :page-count="totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { NGrid, NGridItem, NPagination, NIcon } from 'naive-ui'
import { HeartSharp, HeartOutline, LocationSharp } from '@vicons/ionicons5'
import { useDataStore } from '@/stores/dataStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useDataStore()

const paginatedItems = computed(() => store.paginatedItems)
const totalPages = computed(() => store.totalPages)

const handlePageChange = (page) => {
  store.setPage(page)
}

function handleImageError(item) {
  item.imageLoaded = true
  item.Picture1 = '默認URL'
}

// 添加切換收藏的方法
const toggleTreasure = (item) => {
  store.toggleTreasure(item)
}
function selectTreasure(item) {
  console.log(item)
}

const isItemTreasure = (item) => {
  const result = store.isTreasure(item)
  return result
}

watch(paginatedItems, (newItems) => {
  console.log('PaginatedItems updated:', newItems)
  // 强制重新评估每个项目的收藏状态
  newItems.forEach(item => isItemTreasure(item))
}, { immediate: true })

const goToDetail = (item) => {
  localStorage.setItem('currentItem', JSON.stringify(item));
  router.push(`/${item.Name}`);
}
</script>
<style scoped>
:deep(
    .n-pagination .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active
  ) {
  border-color: transparent;
  border-radius: 999px;
  background-color: #00bbf0;
  color: white;
}
:deep(.n-pagination .n-pagination-item:not(.n-pagination-item--disabled):hover) {
  color: #00bbf0;
}
:deep(
    .n-pagination
      .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active:hover
  ) {
  color: white;
}
:deep(.n-pagination .n-pagination-item:not(.n-pagination-item--disabled)) {
  color: black;
}
:deep(
    .n-pagination .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active
  ) {
  color: white;
}
:deep(
    .n-pagination
      .n-pagination-item:not(.n-pagination-item--disabled):hover.n-pagination-item--button
  ) {
  border-color: transparent;
}
:deep(.n-pagination .n-pagination-item.n-pagination-item--button) {
  border-color: transparent;
  background-color: transparent;
}
</style>
