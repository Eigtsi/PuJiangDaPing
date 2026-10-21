<template>
  <div class="relative w-full h-full overflow-hidden">

    <!-- Dynamic custom Toast notification -->
    <Transition name="fade">
      <div v-if="customToast" class="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-[#09224f] border border-cyan-400 text-cyan-300 px-6 py-3 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-2 font-medium">
        <Shield class="animate-spin text-cyan-400 w-5 h-5" />
        <span>{{ customToast }}</span>
      </div>
    </Transition>

    <!-- ============ 地图底座（左右各留 120px 留白，上下留标题/导航，铺在面板之后） ============ -->
    <div class="absolute left-[120px] right-[120px] top-[96px] bottom-5 overflow-hidden bg-[#040e29] rounded-lg border border-cyan-400/25 shadow-[0_0_50px_rgba(0,242,255,0.08)]">
      <InteractiveMap
        :bgImage="industrialParkView"
        :activeZone="mapFilterZone"
        @selectEnterprise="handleSelectEnterprise"
        @selectMarker="handleSelectMarker"
      />
    </div>

    <!-- ============ 整屏外框（铺在面板之上、弹框之下，仅装饰不拦截事件；左右对齐 120px 内容边距） ============ -->
    <div class="absolute inset-0 z-30 pointer-events-none">
      <div class="absolute left-[120px] right-[120px] top-3 bottom-3 border border-cyan-400/40 rounded-lg" />
      <span class="absolute top-3 left-[120px] w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
      <span class="absolute top-3 right-[120px] w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
      <span class="absolute bottom-3 left-[120px] w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
      <span class="absolute bottom-3 right-[120px] w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
    </div>

    <!-- ============ 顶部悬浮栏（z-30） ============ -->
    <header :class="['absolute top-0 inset-x-0 z-30 px-[120px] pt-[22px] pointer-events-none', isLargeScreen ? 'grid grid-cols-12 items-center gap-2' : 'flex flex-col md:flex-row items-center justify-between gap-2']">
      <div :class="[isLargeScreen ? 'col-span-3 flex justify-start pointer-events-auto' : 'pointer-events-auto']">
        <div class="flex items-center gap-3 text-cyan-350 bg-[#0c224f]/70 px-4 py-2 border border-[#06b6d4]/20 rounded-md shadow-md backdrop-blur-md">
          <Calendar class="w-4 h-4 text-cyan-400" />
          <span class="font-mono text-sm tracking-widest">{{ currentDate }}</span>
          <span class="font-mono text-sm border-l border-cyan-500/30 pl-3 text-[#10b981]">{{ currentWeek }}</span>
          <span class="font-mono text-base md:text-lg font-bold border-l border-[#06b6d4]/30 pl-3 text-cyan-400 digital-glow">{{ currentTime }}</span>
        </div>
      </div>
      <div :class="[isLargeScreen ? 'col-span-6 flex justify-center pointer-events-auto' : 'pointer-events-auto']">
        <div class="relative flex items-center justify-center px-14 py-[13px] bg-gradient-to-r from-[#0a235c]/90 via-[#0d348a]/90 to-[#0a235c]/90 border border-cyan-400/60 rounded-lg shadow-[0_5px_20px_rgba(6,182,212,0.35)] backdrop-blur-md">
          <!-- 四角 HUD 括号 -->
          <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
          <!-- 左右霓虹竖条 -->
          <span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
          <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-l-full shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
          <h1 class="text-xl md:text-2xl lg:text-3xl font-bold tracking-widest text-[#e2e8f0] flex items-center gap-3">
            <!-- 左侧翅膀 -->
            <span class="flex items-center">
              <span class="h-px w-14 bg-gradient-to-r from-transparent to-cyan-400"></span>
              <span class="w-2 h-2 bg-cyan-400 rotate-45 ml-2 shadow-[0_0_6px_rgba(0,242,255,0.8)]"></span>
            </span>
            <span class="bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">浦江水晶产业园智能画像</span>
            <!-- 右侧翅膀 -->
            <span class="flex items-center">
              <span class="w-2 h-2 bg-cyan-400 rotate-45 mr-2 shadow-[0_0_6px_rgba(0,242,255,0.8)]"></span>
              <span class="h-px w-14 bg-gradient-to-r from-cyan-400 to-transparent"></span>
            </span>
          </h1>
        </div>
      </div>
      <div :class="[isLargeScreen ? 'col-span-3 flex items-center justify-end gap-1.5 text-slate-350 pointer-events-auto' : 'flex items-center gap-4 text-slate-300 pointer-events-auto']">
        <!-- 所属园区切换 -->
        <div class="flex items-center gap-1.5 bg-[#0c224f]/70 px-2 py-1.5 border border-[#06b6d4]/30 rounded-md backdrop-blur-md shrink-0">
          <span class="text-xs text-cyan-300/80 font-medium whitespace-nowrap">所属园区</span>
          <el-select
            :model-value="activePark"
            size="small"
            class="custom-el-select"
            @change="setPark"
          >
            <el-option v-for="p in parkOptions" :key="p.key" :label="p.label" :value="p.key" />
          </el-select>
        </div>

        <!-- 天气 -->
        <div class="flex items-center gap-1.5 bg-[#0c224f]/70 px-2 py-1.5 border border-[#06b6d4]/10 rounded-md backdrop-blur-md shrink-0">
          <span class="text-xs text-slate-450 font-medium whitespace-nowrap">今日天气</span>
          <Sun class="w-5 h-5 text-amber-400 animate-spin" style="animation-duration: 20s" />
          <span class="text-sm font-semibold text-cyan-300 whitespace-nowrap">晴 10℃</span>
        </div>

        <!-- 返回 -->
        <button @click="toastMessage('返回系统主页...')" class="flex items-center gap-1 bg-[#0d2a63]/80 hover:bg-[#123985] text-cyan-300 border border-cyan-500/30 px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition font-medium backdrop-blur-md whitespace-nowrap shrink-0"><ArrowLeftRight class="w-3.5 h-3.5" /><span>返回</span></button>
      </div>
    </header>

    <!-- ============ 左侧悬浮浮层（叠在地图左边缘，重点展示） ============ -->
    <div class="absolute left-[120px] top-[96px] bottom-5 z-20 w-[420px] flex flex-col gap-3 pr-1 min-h-0">
      <TechPanel :title="panelTitles[0]" :isLargeScreen="isLargeScreen" :className="'flex-1 min-h-0'" @expand="expandedIndex = 0">
        <template #icon><component :is="panelIcons[0]" class="w-4 h-4 text-cyan-400" /></template>
        <component :is="panelComponents[0]" :isLargeScreen="isLargeScreen" @toast="toastMessage" />
      </TechPanel>
      <TechPanel :title="panelTitles[1]" :isLargeScreen="isLargeScreen" :className="'flex-1 min-h-0'" @expand="expandedIndex = 1">
        <template #icon><component :is="panelIcons[1]" class="w-4 h-4 text-cyan-400" /></template>
        <component :is="panelComponents[1]" :isLargeScreen="isLargeScreen" @toast="toastMessage" />
      </TechPanel>
      <TechPanel v-if="panelComponents[2]" :title="panelTitles[2]" :isLargeScreen="isLargeScreen" :className="'flex-1 min-h-0'" @expand="expandedIndex = 2">
        <template #icon><component :is="panelIcons[2]" class="w-4 h-4 text-cyan-400" /></template>
        <component :is="panelComponents[2]" :isLargeScreen="isLargeScreen" @toast="toastMessage" />
      </TechPanel>
      <div v-else class="flex-1 min-h-0"></div>
    </div>

    <!-- ============ 右侧悬浮浮层（叠在地图右边缘，重点展示） ============ -->
    <div class="absolute right-[120px] top-[96px] bottom-5 z-20 w-[420px] flex flex-col gap-3 pl-1 min-h-0">
      <TechPanel v-if="panelComponents[3]" :title="panelTitles[3]" :isLargeScreen="isLargeScreen" :className="rightPanelClass" :autoHeight="activeMainTab === 'environment'" @expand="expandedIndex = 3">
        <template #icon><component :is="panelIcons[3]" class="w-4 h-4 text-cyan-400" /></template>
        <component :is="panelComponents[3]" :isLargeScreen="isLargeScreen" @toast="toastMessage" />
      </TechPanel>
      <TechPanel v-if="panelComponents[4]" :title="panelTitles[4]" :isLargeScreen="isLargeScreen" :className="rightPanelClass" @expand="expandedIndex = 4">
        <template #icon><component :is="panelIcons[4]" class="w-4 h-4 text-cyan-400" /></template>
        <component :is="panelComponents[4]" :isLargeScreen="isLargeScreen" @toast="toastMessage" />
      </TechPanel>
      <TechPanel v-if="panelComponents[5]" :title="panelTitles[5]" :isLargeScreen="isLargeScreen" :className="rightPanelClass" @expand="expandedIndex = 5">
        <template #icon><component :is="panelIcons[5]" class="w-4 h-4 text-cyan-400" /></template>
        <component :is="panelComponents[5]" :isLargeScreen="isLargeScreen" @toast="toastMessage" />
      </TechPanel>
      <TechPanel v-if="panelComponents[6]" :title="panelTitles[6]" :isLargeScreen="isLargeScreen" :className="rightPanelClass" @expand="expandedIndex = 6">
        <template #icon><component :is="panelIcons[6]" class="w-4 h-4 text-cyan-400" /></template>
        <component :is="panelComponents[6]" :isLargeScreen="isLargeScreen" @toast="toastMessage" />
      </TechPanel>
    </div>

    <!-- ============ 底部场景 Tab（z-30，参照总览驾驶舱 BottomTabBar） ============ -->
    <nav class="absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
      <div class="flex items-center gap-1.5 bg-black/80 border border-neon-blue/30 p-1.5 rounded-full backdrop-blur-md shadow-[0_8px_32px_rgba(0,242,255,0.18)]">
        <button v-for="tab in mainTabs" :key="tab.key" @click="setMainTab(tab.key)" :class="['px-7 py-2.5 rounded-full font-sans text-sm md:text-base tracking-wider font-bold cursor-pointer transition-all duration-300 flex items-center gap-2', activeMainTab===tab.key?'bg-neon-blue/15 text-neon-blue border border-neon-blue/50 shadow-[0_0_15px_rgba(0,242,255,0.4)]':'text-white/60 hover:text-white/90 border border-transparent']">
          <component :is="tab.icon" class="w-4 h-4" /><span>{{ tab.label }}</span>
        </button>
      </div>
    </nav>

    <!-- ============ 面板「展开」详情弹框（点击面板右上角放大按钮，以弹框形式展示全量内容，参照「一企一档」） ============ -->
    <div
      v-if="expandedIndex !== null"
      class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div class="pointer-events-auto tech-panel w-[475px] max-w-[90vw] max-h-[84vh] flex flex-col overflow-hidden border border-cyan-400 shadow-[0_8px_40px_rgba(6,182,212,0.5)]">
        <span class="hud-corner hud-corner-tr" />
        <span class="hud-corner hud-corner-bl" />
        <div class="flex items-center justify-between px-5 py-3 border-b border-cyan-500/25 shrink-0">
          <span class="text-lg font-bold text-white flex items-center gap-2.5 tracking-wider">
            <component :is="panelIcons[expandedIndex]" class="w-5 h-5 text-neon-blue" />
            {{ panelTitles[expandedIndex] }}
          </span>
          <button @click="expandedIndex = null" class="text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded transition">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5">
          <component :is="panelComponents[expandedIndex]" :isLargeScreen="false" @toast="toastMessage" />
        </div>
      </div>
    </div>

    <!-- Enterprise Slide Panel (一企一档) -->
    <EnterpriseSlidePanel
      :enterpriseId="selectedEnterpriseId"
      :visible="showEnterprisePanel"
      @close="closeEnterprisePanel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import CryptoJS from 'crypto-js'
import {
  Building, Droplets, Wind, Calendar, Sun, ArrowLeftRight,
  Trash2, Sliders, Shield, Briefcase, LayoutDashboard,
  Bell, Coins, Car, LifeBuoy, Users, X,
  Zap, Flame, Waves
} from 'lucide-vue-next'

import TechPanel from './TechPanel.vue'

// ===== Map components =====
import InteractiveMap from './map/InteractiveMap.vue'
import EnterpriseSlidePanel from './map/EnterpriseSlidePanel.vue'

// ===== Panel imports — General =====
import ParkOverviewContent from './panels/general/ParkOverviewContent.vue'
import SolidWasteContent from './panels/general/SolidWasteContent.vue'
import AirMonitorContent from './panels/general/AirMonitorContent.vue'
import WaterEnvContent from './panels/general/WaterEnvContent.vue'
import WaterUsageContent from './panels/general/WaterUsageContent.vue'
import ElectricityUsageContent from './panels/general/ElectricityUsageContent.vue'
import GasUsageContent from './panels/general/GasUsageContent.vue'
// ===== Panel imports — Operation =====
import PropertyAnalysisContent from './panels/operation/PropertyAnalysisContent.vue'
import RentAnalysisContent from './panels/operation/RentAnalysisContent.vue'
import ParkingAnalysisContent from './panels/operation/ParkingAnalysisContent.vue'
// ===== Panel imports — Energy =====
import EmptyContent from './panels/energy/EmptyContent.vue'

// ==================== ASSETS ====================
const industrialParkView = '/src/assets/images/industrial_park_view_1779843805340.png'

// ==================== STORE ====================
const store = useStore()
const activeCategory = computed(() => store.state.activeCategory)
const activeMainTab = computed(() => store.state.activeMainTab)
const activeWaterRiver = computed(() => store.state.activeWaterRiver)
const customToast = computed(() => store.state.customToast)
const activePark = computed(() => store.state.activePark)
const mapFilterZone = computed(() => store.state.mapFilterZone)

const parkOptions = [
  { key: 'center', label: '水晶产业园（中部）' },
  { key: 'east', label: '水晶产业园（东部）' },
  { key: 'west', label: '水晶产业园（西部）' }
]
const selectedEnterpriseId = computed(() => store.state.selectedEnterpriseId)

const showEnterprisePanel = computed(() => store.state.showEnterprisePanel)

// ==================== CLOCK ====================
moment.locale('zh-cn')
const currentDate = ref(moment().format('YYYY年MM月DD日'))
const currentWeek = ref(moment().format('dddd'))
const currentTime = ref(moment().format('HH:mm:ss'))
let clockInterval: any = null
onMounted(() => {
  clockInterval = setInterval(() => {
    currentDate.value = moment().format('YYYY年MM月DD日')
    currentWeek.value = moment().format('dddd')
    currentTime.value = moment().format('HH:mm:ss')
  }, 1000)
})
onUnmounted(() => { if (clockInterval) clearInterval(clockInterval) })

// ==================== TOAST ====================
const toastMessage = (msg: string) => {
  store.commit('setToast', msg)
  setTimeout(() => { if (store.state.customToast === msg) store.commit('setToast', null) }, 2500)
}

// ==================== SCALING ====================
const isLargeScreen = ref(true)
const handleResize = () => { isLargeScreen.value = window.innerWidth >= 1024 }
onMounted(() => { handleResize(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize) })

// ==================== TAB & CATEGORY ====================
type TabKey = 'general' | 'environment' | 'operation' | 'energy'
const mainTabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'general', label: '综合管理', icon: LayoutDashboard },
  { key: 'environment', label: '环保管理', icon: Shield },
  { key: 'operation', label: '智慧运营', icon: Sliders },
  { key: 'energy', label: '企业服务', icon: Briefcase },
]

const setCategory = (cat: 'park' | 'enterprise') => {
  store.commit('setCategory', cat)
  toastMessage(`切换视图：${cat === 'park' ? '园区综合全局控制' : '精细化企业监管'}`)
}
const setMainTab = (tab: TabKey) => {
  store.commit('setMainTab', tab)
}
const setWaterRiver = (river: 'tongcungang' | 'xinjinghe') => {
  store.commit('setWaterRiver', river)
  toastMessage(`正在加载断面监测水质：${river === 'tongcungang' ? '汤村港断面' : '新泾河断面'}`)
}

const setPark = (park: 'center' | 'east' | 'west') => {
  store.commit('setPark', park)
  store.commit('setMapFilterZone', park)
  const parkName = parkOptions.find(p => p.key === park)?.label || park
  toastMessage(`已切换所属园区：${parkName}`)
}

// ==================== PANEL TITLES & ICONS ====================
// panelTitles[0-6] = 7 panels left-to-right, top-to-bottom
const panelTitles = computed(() => {
  const t = activeMainTab.value
  const titles: Record<string, string[]> = {
    general: ['园区概况', '大气环境监测', '水环境监测', '用水分析', '用电分析', '供气分析'],
    environment: ['大气环境监测', '水环境监测', '', '固废处置监管', '', '', ''],
    operation: ['物业分析', '租金分析', '停车分析', '用水分析', '用电分析', '供气分析', ''],
    energy: ['', '', '', '', '', '', ''],
  }
  return titles[t] || titles.general
})

const panelIcons = computed(() => {
  const t = activeMainTab.value
  const icons: Record<string, any[]> = {
    general: [Building, Wind, Droplets, Waves, Zap, Flame],
    environment: [Wind, Droplets, null, Trash2, null, null, null],
    operation: [Building, Coins, Car, Waves, Zap, Flame, null],
    energy: [Briefcase, Bell, Coins, LifeBuoy, Users, Building, Building],
  }
  return icons[t] || icons.general
})

// ==================== 面板内容映射（面板槽位与“展开”弹窗共用） ====================
// panelComponents[0-6] 对应左 3 + 右 4 个面板；energy 页第 7 面板为 null（不渲染）
const panelComponents = computed(() => {
  const t = activeMainTab.value
  const map: Record<string, any[]> = {
    general: [ParkOverviewContent, AirMonitorContent, WaterEnvContent, WaterUsageContent, ElectricityUsageContent, GasUsageContent],
    environment: [AirMonitorContent, WaterEnvContent, null, SolidWasteContent, null, null, null],
    operation: [PropertyAnalysisContent, RentAnalysisContent, ParkingAnalysisContent, WaterUsageContent, ElectricityUsageContent, GasUsageContent, null],
    energy: [EmptyContent, EmptyContent, EmptyContent, EmptyContent, EmptyContent, EmptyContent, null],
  }
  return map[t] || map.general
})

// 右侧面板在「环保管理」页高亮描边；环保页只有固废处置监管一个面板，按内容自适应高度
const rightPanelClass = computed(() =>
  activeMainTab.value === 'environment'
    ? '!border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)] bg-[#0c245c]/70'
    : 'flex-1 min-h-0'
)

// 展开的面板索引（null = 未展开），点击面板右上角放大按钮弹出全量内容
const expandedIndex = ref<number | null>(null)

// ==================== MAP INTERACTION ====================
const handleSelectEnterprise = (id: string) => {
  store.dispatch('selectEnterprise', id)
  toastMessage('正在加载企业一企一档...')
}
const handleSelectMarker = (marker: any) => {
  toastMessage(`已选中：${marker.name}`)
}
const closeEnterprisePanel = () => {
  store.dispatch('closeEnterprisePanel')
}

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translate(-50%, -30px) scale(0.95); }
.slide-enter-active, .slide-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(-40px); }

/* 顶部「所属园区」下拉选择器深色主题 */
:deep(.custom-el-select) {
  width: 140px !important;
}
:deep(.custom-el-select .el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  color: #22d3ee !important;
  border-radius: 4px;
  height: 28px !important;
}
:deep(.custom-el-select .el-select__placeholder) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 11px;
}
:deep(.custom-el-select .el-select__caret) {
  color: #22d3ee !important;
}
:deep(.custom-el-select .el-select__selected-item) {
  color: #22d3ee !important;
  font-size: 11px;
}
</style>