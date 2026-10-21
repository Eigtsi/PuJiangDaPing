<template>
  <div :class="['font-sans', isLargeScreen ? 'space-y-2' : 'space-y-3.5']">
    <div class="flex justify-between items-center">
      <span class="text-xs text-slate-200 font-bold">固废及危废中转概况</span>
      <el-select
        v-model="selectedYear"
        size="small"
        class="w-24 custom-el-select"
        @change="onYearChange"
        popper-class="custom-el-select-popper"
      >
        <el-option label="2025年" value="2025" />
        <el-option label="2026年" value="2026" />
      </el-select>
    </div>

    <!-- Industrial solid waste -->
    <div :class="['bg-gradient-to-r from-[#0d2a63]/25 to-[#0b2152]/10 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="flex justify-between text-xs text-cyan-300 font-bold mb-1">
        <span>📦 工业固废（水晶副产料）</span>
        <span class="text-[11px] text-emerald-400">闭环回收</span>
      </div>
      <div class="grid grid-cols-3 text-center text-xs text-slate-300 font-mono gap-1">
        <div class="bg-[#051330]/80 p-1 rounded border border-cyan-500/5">
          <span class="text-xs text-slate-400 block font-sans">总产量</span>
          <span :class="[isLargeScreen ? 'text-base' : 'text-lg', 'font-black text-cyan-400']">{{ wastes.solidTotal }}</span>
        </div>
        <div class="bg-[#051330]/80 p-1 rounded border border-cyan-500/5">
          <span class="text-xs text-slate-400 block font-sans">收运中转</span>
          <span :class="[isLargeScreen ? 'text-base' : 'text-lg', 'font-black text-sky-300']">{{ wastes.solidTransferred }}</span>
        </div>
        <div class="bg-[#051330]/80 p-1 rounded border border-cyan-500/5">
          <span class="text-xs text-slate-400 block font-sans">库存</span>
          <span :class="[isLargeScreen ? 'text-base' : 'text-lg', 'font-black text-amber-500']">{{ wastes.solidStored }}</span>
        </div>
      </div>
    </div>

    <!-- Hazardous waste -->
    <div :class="['bg-gradient-to-r from-[#0d2a63]/25 to-[#0b2152]/10 rounded border border-rose-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="flex justify-between text-xs text-rose-300 font-bold mb-1">
        <span>☣️ 危险废物（废酸泥泥）</span>
        <span class="text-[11px] text-rose-400">特种监管</span>
      </div>
      <div class="grid grid-cols-3 text-center text-xs text-slate-300 font-mono gap-1">
        <div class="bg-[#051330]/80 p-1 rounded border border-rose-500/5">
          <span class="text-xs text-slate-400 block font-sans">总产生</span>
          <span :class="[isLargeScreen ? 'text-base' : 'text-lg', 'font-black text-rose-300']">{{ wastes.hazardTotal }}</span>
        </div>
        <div class="bg-[#051330]/80 p-1 rounded border border-rose-500/5">
          <span class="text-xs text-slate-400 block font-sans">转运点</span>
          <span :class="[isLargeScreen ? 'text-base' : 'text-lg', 'font-black text-sky-300']">{{ wastes.hazardTransferred }}</span>
        </div>
        <div class="bg-[#051330]/80 p-1 rounded border border-rose-500/5">
          <span class="text-xs text-slate-400 block font-sans">待消库</span>
          <span :class="[isLargeScreen ? 'text-base' : 'text-lg', 'font-black text-emerald-400']">{{ wastes.hazardStored }}</span>
        </div>
      </div>
    </div>

    <!-- Storage capacity progress -->
    <div :class="['bg-[#0d2a63]/30 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-xs text-cyan-300 font-bold mb-1.5">📊 库容使用率</div>
      <div class="space-y-1.5">
        <div>
          <div class="flex justify-between text-xs text-slate-300 mb-0.5">
            <span>一号固废暂存站</span>
            <span class="text-cyan-400 font-mono font-bold">72%</span>
          </div>
          <div class="w-full h-1.5 bg-[#051330] rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style="width: 72%" />
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-300 mb-0.5">
            <span>二号危废暂存站</span>
            <span class="text-amber-400 font-mono font-bold">85%</span>
          </div>
          <div class="w-full h-1.5 bg-[#051330] rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style="width: 85%" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent transfer records -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-xs text-cyan-300 font-bold mb-1">🚛 近期转运记录</div>
      <div class="space-y-0.5 text-xs font-mono">
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">华兴水晶 → 副产料外运</span>
          <span class="text-emerald-400">已完成</span>
        </div>
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">恒泰水晶 → 废酸转运</span>
          <span class="text-sky-400">转运中</span>
        </div>
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">利达水晶 → 危废委外</span>
          <span class="text-amber-400">待审批</span>
        </div>
      </div>
    </div>

    <!-- Alert items -->
    <div :class="['bg-amber-950/15 rounded border border-amber-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-xs text-amber-300 font-bold mb-1">⚠ 待处理事项</div>
      <div class="space-y-0.5 text-xs">
        <div class="flex justify-between text-amber-200 font-sans">
          <span>二号危废站库容预警</span>
          <span class="text-slate-400">今日</span>
        </div>
        <div class="flex justify-between text-amber-200 font-sans">
          <span>利达水晶危废联单待签</span>
          <span class="text-slate-400">昨日</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

const selectedYear = ref('2025')

const solidWasteData: Record<string, {
  solidTotal: string
  solidTransferred: string
  solidStored: string
  hazardTotal: string
  hazardTransferred: string
  hazardStored: string
}> = {
  '2025': {
    solidTotal: '3,000 吨',
    solidTransferred: '1,500 吨',
    solidStored: '1,500 吨',
    hazardTotal: '800 吨',
    hazardTransferred: '700 吨',
    hazardStored: '100 吨'
  },
  '2026': {
    solidTotal: '3,450 吨',
    solidTransferred: '1,900 吨',
    solidStored: '1,550 吨',
    hazardTotal: '920 吨',
    hazardTransferred: '840 吨',
    hazardStored: '80 吨'
  }
}

const wastes = computed(() => {
  return solidWasteData[selectedYear.value] || solidWasteData['2025']
})

const onYearChange = (year: string) => {
  emit('toast', `已为您载入：${year}年份企业产废流向流速`)
}
</script>

<style scoped>
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
</style>
