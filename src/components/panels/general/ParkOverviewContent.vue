<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col min-h-0' : 'space-y-2.5']">
    <!-- 园区介绍（随所属园区切换） -->
    <div :class="['text-slate-100 leading-relaxed pr-1 bg-[#071638]/40', isLargeScreen ? 'text-sm p-2.5 border border-[#06b6d4]/10 rounded' : 'text-base p-3 rounded border border-[#06b6d4]/10']">
      {{ overview.intro }}
    </div>

    <!-- Spacer: push stats cards down -->
    <div :class="[isLargeScreen ? 'flex-1 min-h-2' : 'h-2']"></div>

    <!-- Stats grid - 2+3 compact layout -->
    <div class="space-y-2">
      <!-- Row 1: 2 primary cards -->
      <div class="grid grid-cols-2 gap-2 text-center">
        <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2.5 px-2' : 'p-3']">
          <span :class="['block font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">规划总面积</span>
          <span :class="['block font-black text-cyan-300 font-mono', isLargeScreen ? 'text-lg mt-1' : 'text-2xl mt-1']">{{ overview.area }}</span>
        </div>
        <div
          @click="$emit('toast', `正在查看${shortName}企业清单...`)"
          :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded cursor-pointer hover:border-cyan-400 transition', isLargeScreen ? 'py-2.5 px-2' : 'p-3']"
        >
          <span :class="['block font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">企业总数</span>
          <span :class="['block font-black text-emerald-400 font-mono', isLargeScreen ? 'text-lg mt-1' : 'text-2xl mt-1']">{{ overview.enterpriseCount }} 家</span>
        </div>
      </div>
      <!-- Row 2: 3 secondary cards -->
      <div class="grid grid-cols-3 gap-2 text-center">
        <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10', isLargeScreen ? 'py-2 px-1' : 'p-2.5']">
          <span :class="['block font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">楼栋总数</span>
          <span :class="['block font-mono text-cyan-300 font-black', isLargeScreen ? 'text-base mt-1' : 'text-lg']">{{ overview.buildingCount }} 栋</span>
        </div>
        <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10', isLargeScreen ? 'py-2 px-1' : 'p-2.5']">
          <span :class="['block font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">总建筑面积</span>
          <span :class="['block font-mono text-sky-400 font-black', isLargeScreen ? 'text-base mt-1' : 'text-lg']">{{ overview.totalArea }} 万m²</span>
        </div>
        <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10', isLargeScreen ? 'py-2 px-1' : 'p-2.5']">
          <span :class="['block font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">综合出租率</span>
          <span :class="['block font-mono font-black', overview.rentalRate >= 80 ? 'text-emerald-400' : 'text-amber-400', isLargeScreen ? 'text-base mt-1' : 'text-lg']">{{ overview.rentalRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { parkProfiles, type ParkKey } from '../../../data/parkMonitor'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

defineEmits<{
  (e: 'toast', msg: string): void
}>()

const store = useStore()
const activePark = computed(() => store.state.activePark as ParkKey)
const profile = computed(() => parkProfiles[activePark.value])
const overview = computed(() => profile.value.overview)
const shortName = computed(() => profile.value.shortName)
</script>
