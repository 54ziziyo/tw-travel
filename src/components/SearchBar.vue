<template>
  <div
    class="flex sm:justify-center items-center space-x-2 sm:space-x-5 h-[50px] justify-start ml-5 select-none text-[#00204A]"
  >
    <div class="relative">
      <div
        @click.stop="store.toggleRegionDropdown()"
        class="rounded-full items-center drop-shadow-lg font-medium bg-white px-4 py-2 text-[16px] sm:px-6 sm:py-3 sm:text-[20px] sm:h-[50px] h-[40px] flex space-x-1 cursor-pointer"
      >
        <div>{{ store.selectedRegion }}</div>
        <n-icon><ChevronDownOutline /></n-icon>
      </div>
      <div
        v-if="store.showRegionDropdown"
        class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg w-full z-10 max-h-[240px] overflow-y-auto"
      >
        <div
          v-for="region in regions"
          :key="region"
          @click="selectRegion(region)"
          class="px-4 py-2 text-[16px] sm:px-4 sm:py-3 sm:text-[18px] hover:bg-gray-100 cursor-pointer"
        >
          {{ region }}
        </div>
      </div>
    </div>
    <div class="relative">
      <div
        @click.stop="store.toggleTownDropdown()"
        class="rounded-full items-center drop-shadow-lg font-medium bg-white px-4 py-2 text-[16px] sm:px-6 sm:py-3 sm:text-[20px] sm:h-[50px] h-[40px] flex space-x-1 cursor-pointer"
      >
        <div>{{ store.selectedTown }}</div>
        <n-icon><ChevronDownOutline /></n-icon>
      </div>
      <div
        v-if="store.showTownDropdown"
        class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg w-full z-10 max-h-[240px] overflow-y-auto"
      >
        <div
          v-for="town in towns"
          :key="town"
          @click="selectTown(town)"
          class="px-4 py-2 text-[16px] sm:px-4 sm:py-3 sm:text-[18px] hover:bg-gray-100 cursor-pointer"
        >
          {{ town }}
        </div>
      </div>
    </div>
    <div @click="search"
      class="rounded-full items-center drop-shadow-lg bg-[#00BBF0] sm:px-6 sm:py-3 p-5 flex space-x-1 cursor-pointer text-white sm:h-[50px] h-[40px]"
    >
      <div class="flex">
        <n-icon size="25"><Search /></n-icon>
      </div>
    </div>
    <div class="absolute right-0">
      <div
        class="rounded-full items-center drop-shadow-lg bg-white flex space-x-1 cursor-pointer sm:h-[50px] h-[40px] sm:w-[50px] w-[40px] mr-5 sm:mr-24 justify-center"
      >
        <div class="flex text-[20px]">
          <n-icon><MapOutline /></n-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { NIcon } from 'naive-ui'
import { ChevronDownOutline, Search, MapOutline } from '@vicons/ionicons5'
import { useDataStore } from '../stores/dataStore'

const store = useDataStore()

const regions = computed(() => store.regions)
const towns = computed(() => store.towns)

const selectRegion = (region) => {
  store.setRegion(region)
}

const selectTown = (town) => {
  store.setTown(town)
}

const search = () => {
  store.search()
}
</script>