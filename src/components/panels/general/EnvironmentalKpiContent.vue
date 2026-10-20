<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- AQI 仪表盘 + 达标率 -->
    <div class="flex items-center gap-2">
      <div class="flex-1 bg-[#06183d]/45 border border-cyan-500/10 rounded p-1">
        <TechGaugeChart :value="kpi.airQualityIndex" label="AQI" :color="aqiColor" :height="110" />
      </div>
      <div class="flex-1 space-y-2">
        <StatCard label="氟化物达标率" :value="`${kpi.fluorideComplianceRate}%`" statusDot="green" />
        <StatCard label="废水达标率" :value="`${kpi.wastewaterComplianceRate}%`" statusDot="green" />
      </div>
    </div>

    <!-- 等级 + 预警 -->
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="空气质量等级" :value="kpi.airQualityLevel" statusDot="green" />
      <StatCard label="未处置预警" :value="`${kpi.unresolvedAlerts} 条`" statusDot="red" />
    </div>

    <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1.5 px-2 flex justify-between items-center text-xs">
      <span class="text-slate-400">当日安全预警吞吐</span>
      <span class="text-[#cbd5e1] font-mono font-bold">{{ kpi.dailyAlertTotal }} 条异常</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '../../shared/StatCard.vue'
import TechGaugeChart from '../../charts/TechGaugeChart.vue'
import { environmentalKPI } from '../../../data/environmental'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const kpi = computed(() => environmentalKPI)

const aqiColor = computed(() => {
  if (environmentalKPI.airQualityIndex < 50) return '#10b981'
  if (environmentalKPI.airQualityIndex < 100) return '#06b6d4'
  return '#f59e0b'
})
</script>