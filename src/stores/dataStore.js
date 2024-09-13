import { defineStore } from 'pinia'
import axios from 'axios'

export const useDataStore = defineStore('data', {
  state: () => ({
    cityData: {},
    gridItems: [],
    filteredItems: [],
    currentPage: 1,
    pageSize: 16,
    noDataMessage: '',
    selectedRegion: '全部',
    selectedTown: '全部',
    showRegionDropdown: false,
    showTownDropdown: false,
    treasures: [],
    activeTreasure: false,
  }),
  getters: {
    regions() {
      return ['全部', ...Object.keys(this.cityData)]
    },
    towns() {
      if (this.selectedRegion === '全部') {
        return ['全部']
      }
      return ['全部', ...(this.cityData[this.selectedRegion] || [])]
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredItems.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.pageSize)
    },
    // 檢查項目是否被收藏
    isTreasure: (state) => (item) => {
      return state.treasures.some(t => t.Id === item.Id)
    },
  },
  actions: {
    async fetchCityData() {
      try {
        const response = await fetch('/cityData.json')
        this.cityData = await response.json()
      } catch (error) {
        console.error('加載城市數據時出錯:', error)
      }
    },
    async fetchData() {
      try {
        const response = await axios.get('/scenic_spot_C_f.json')
        if (response.data && response.data.XML_Head && response.data.XML_Head.Infos && response.data.XML_Head.Infos.Info) {
          this.gridItems = response.data.XML_Head.Infos.Info
            .filter(item => item && item.Picture1 && this.isValidImageUrl(item.Picture1))
            .map(item => ({
              ...item,
              imageLoaded: false
            }))
          this.filteredItems = this.gridItems
        } else {
          console.error('數據結構不符合預期')
          this.gridItems = []
          this.filteredItems = []
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        this.gridItems = []
        this.filteredItems = []
      }
    },
    setRegion(region) {
      this.selectedRegion = region
      this.selectedTown = '全部'
    },
    setTown(town) {
      this.selectedTown = town
    },
    search() {
      if (this.selectedRegion === '全部' && this.selectedTown === '全部') {
        this.filteredItems = this.gridItems
      } else if (this.selectedRegion === '全部') {
        this.filteredItems = this.gridItems.filter(item => item.Town === this.selectedTown)
      } else if (this.selectedTown === '全部') {
        this.filteredItems = this.gridItems.filter(item => item.Region === this.selectedRegion)
      } else {
        this.filteredItems = this.gridItems.filter(item => 
          item.Region === this.selectedRegion && item.Town === this.selectedTown
        )
      }
      
      this.currentPage = 1
      
      if (this.filteredItems.length === 0) {
        this.noDataMessage = '未有資料'
      } else {
        this.noDataMessage = ''
      }
    },
    setPage(page) {
      this.currentPage = page
    },
    isValidImageUrl(url) {
      const cleanedUrl = this.cleanImageUrl(url);
      return cleanedUrl.match(/\.(jpeg|jpg|gif|png)$/i) !== null;
    },
    cleanImageUrl(url) {
      if (typeof url !== 'string') return '';
      return url
        .replace(/&quot;/g, '"')
        .replace(/^url\(['"]?|['"]?\)$/g, '')
        .replace(/^["']|["']$/g, '');
    },
    toggleRegionDropdown() {
      this.showRegionDropdown = !this.showRegionDropdown
      this.showTownDropdown = false
    },
    toggleTownDropdown() {
      this.showTownDropdown = !this.showTownDropdown
      this.showRegionDropdown = false
    },
    closeDropdowns() {
      this.showRegionDropdown = false
      this.showTownDropdown = false
    },
    toggleTreasure(item) {
      const index = this.treasures.findIndex(t => t.Id === item.Id)
      if (index > -1) {
        // 如果項目已存在，則移除它
        this.treasures.splice(index, 1)
      } else {
        // 如果項目不存在，則添加它
        this.treasures.push(item)
      }
      // 保存到 localStorage
      localStorage.setItem('treasures', JSON.stringify(this.treasures))
    },
    loadTreasures() {
      const saved = localStorage.getItem('treasures')
      if (saved) {
        try {
          this.treasures = JSON.parse(saved)
          console.log('Parsed treasures:', this.treasures)
        } catch (error) {
          console.error('Error parsing treasures:', error)
          this.treasures = []
        }
      }
    },
    // 新增一個初始化方法
    initializeStore() {
      this.loadTreasures()
      // 可以在這裡添加其他初始化操作
    },
    addTreasure(item) {
      if (!this.treasures.some(treasure => treasure.Name === item.Name)) {
        this.treasures.push(item)
      }
    },
    removeTreasure(item) {
      const index = this.treasures.findIndex(treasure => treasure.Name === item.Name)
      if (index !== -1) {
        this.treasures.splice(index, 1)
      }
    },
  },
})