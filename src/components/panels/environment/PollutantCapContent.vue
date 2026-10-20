<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- 总量头部 -->
    <div class="bg-[#0d2a63]/30 rounded p-1.5 px-2 flex justify-between items-center">
      <span class="text-xs text-slate-350 font-bold">污染物总量指标使用率</span>
      <span class="text-[10px] text-amber-300 font-mono">预警阈值 80%</span>
    </div>

    <!-- 四类污染物总量 -->
    <div v-for="cap in caps" :key="cap.name" class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10">
      <div class="flex justify-between text-xs mb-1">
        <span class="text-slate-300 font-bold">{{ cap.name }}</span>
        <span :class="['font-mono font-bold', cap.isWarning ? 'text-rose-400' : 'text-cyan-300']">{{ cap.usageRate }}%</span>
      </div>
      <ProgressBar :percentage="cap.usageRate" :colorScheme="cap.isWarning ? 'rose' : 'cyan'" />
      <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
        <span>已分配 {{ cap.allocated }} {{ cap.unit }}</span>
        <span>剩余 {{ cap.remaining }} {{ cap.unit }}</span>
      </div>
    </div>

    <div class="text-[10px] text-slate-500 italic text-center">
      * 总量统一管理 · 内部替代平衡 / 总量削减替代 / 总量统一管理
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '../../shared/ProgressBar.vue'
import { pollutantCaps } from '../../../data/environmental'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const caps = pollutantCaps
</script>