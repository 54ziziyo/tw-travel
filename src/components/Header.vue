<template>
    <header>
      <div
        class="flex justify-center items-center relative w-full sm:h-[25rem] h-[20rem] select-none"
      >
        <div class="absolute inset-0 w-full h-full bg-gray-200 animate-pulse"></div>
        <img :src="backgroundImage" alt="背景圖片" class="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" @load="backgroundImageLoaded = true" :class="{ 'opacity-0': !backgroundImageLoaded }"/>
        <router-link to="/">
          <div class="cursor-pointer absolute left-0 top-0">
            <img alt="Vue logo" class="sm:w-[12rem] w-[8rem] pointer-events-none" src="@/assets/images/go.svg" loading="lazy"/>
          </div>
        </router-link>
        <div v-if="regionTitle" class="text-white font-serif flex items-center sm:space-x-8 space-x-4 relative z-10">
          <div class="sm:text-[5rem] text-[3rem] font-semibold drop-shadow-lg">台</div>
          <div class="text-[1.5rem] pt-4 sm:tracking-[.625rem] tracking-[.2rem]">TAIWAN</div>
          <div class="sm:text-[5rem] text-[3rem] font-semibold drop-shadow-lg">灣</div>
        </div>
        <div class="absolute sm:right-24 sm:top-8 right-4 top-4 cursor-pointer z-10" @click="activate('right')">
          <div v-if="store.treasures.length > 0" class="absolute -right-2 top-0 bg-[#da0000] px-2 text-right text-white rounded-full">
            {{ store.treasures.length > 99 ? '99+' : store.treasures.length }}
          </div>
          <div class="bg-[#FF6F6E] rounded-full flex p-4">
            <n-icon size="30" class="text-white cursor-pointer"><HeartSharp /></n-icon>
          </div>
        </div>
        <div class="w-full absolute bottom-0 mb-[-25px] z-10">
          <SearchBar v-if="selector"/>
        </div>
      </div>
    </header>
    <TreasureList v-model:active="store.activeTreasure" />
</template>

<script setup>
import TreasureList from './TreasureList.vue'
import SearchBar from './SearchBar.vue'
import { NIcon } from 'naive-ui'
import { useDataStore } from '../stores/dataStore'
import { HeartSharp } from '@vicons/ionicons5'
import { computed, ref } from 'vue'

const store = useDataStore()
const activate = () => {
  store.activeTreasure = true
}

const props = defineProps({
  imgUrl: {
    type: String,
    default: ''
  },
  regionTitle: {
    type: Boolean,
    default: false,
  },
  selector: {
    type: Boolean,
    default: false,
  }
})

const backgroundImage = computed(() => {
  return props.imgUrl || 'src/assets/images/homeNavBg.png'
})
const backgroundImageLoaded = ref(false)

</script>