<template>
  <span class="inline-flex items-center">
    <!-- 导出按钮 -->
    <button
      type="button"
      class="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 hover:text-cyan-200 transition cursor-pointer shrink-0"
      @click="open"
    >
      <Download class="w-3 h-3" />
      导出
    </button>

    <!-- 自定义深色导出弹框（沿用 AppDashboard 展开面板的弹框风格） -->
    <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center" @click.self="visible = false">
      <div class="tech-panel w-[460px] max-w-[90vw] flex flex-col overflow-hidden border border-cyan-400 shadow-[0_8px_40px_rgba(6,182,212,0.5)]">
        <span class="hud-corner hud-corner-tr" />
        <span class="hud-corner hud-corner-bl" />
        <div class="flex items-center justify-between px-5 py-3 border-b border-cyan-500/25 shrink-0">
          <span class="text-base font-bold text-white flex items-center gap-2 tracking-wider">
            <Download class="w-4 h-4 text-neon-blue" />
            导出「{{ title }}」
          </span>
          <button @click="visible = false" class="text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded transition cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="px-5 py-4 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-slate-300 text-sm shrink-0 whitespace-nowrap">日期范围</span>
            <el-date-picker
              v-model="range"
              :type="granularity === 'date' ? 'daterange' : 'monthrange'"
              range-separator="至"
              :start-placeholder="granularity === 'date' ? '开始日期' : '开始月份'"
              :end-placeholder="granularity === 'date' ? '结束日期' : '结束月份'"
              :format="granularity === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM'"
              :value-format="granularity === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM'"
              :clearable="false"
              :editable="false"
              popper-class="export-range-popper"
              class="export-range-picker"
            />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">{{ granularity === 'date' ? '将导出所选日期范围内的明细数据（Excel .xlsx 文件）。' : '将导出所选日期范围内的月度汇总数据（Excel .xlsx 文件）。' }}</p>
        </div>
        <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-cyan-500/20 shrink-0">
          <button @click="visible = false" class="px-4 py-1.5 rounded text-xs text-slate-300 border border-slate-500/40 hover:border-slate-300 hover:text-white transition cursor-pointer">取消</button>
          <button @click="confirm" :disabled="!range" class="px-4 py-1.5 rounded text-xs font-medium text-[#04101f] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">导出</button>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { Download, X } from 'lucide-vue-next'

interface Props {
  /** 面板名称，用于弹框标题与文件命名提示 */
  title: string
  /** 默认选中的起止范围，为空则需用户自行选择 */
  defaultRange?: [string, string]
  /** 日期粒度：month 按月（YYYY-MM），date 按日（YYYY-MM-DD） */
  granularity?: 'month' | 'date'
}

const props = withDefaults(defineProps<Props>(), {
  defaultRange: () => ['2025-01', '2026-10'],
  granularity: 'month',
})

const store = useStore()

const emit = defineEmits<{
  (e: 'export', start: string, end: string): void
}>()

const visible = ref(false)
const range = ref<[string, string] | null>(props.defaultRange ? [...props.defaultRange] : null)

function open() {
  // 首次打开时若未选择过范围，回填默认范围
  if (range.value === null && props.defaultRange) range.value = [...props.defaultRange]
  // 打开导出面板时，通知地图关闭其上的悬浮面板（楼栋/标记/详情）
  store.commit('requestCloseMapFloating')
  visible.value = true
}

function confirm() {
  if (!range.value) return
  emit('export', range.value[0], range.value[1])
  visible.value = false
}
</script>

<style scoped>
/* 日期范围输入框深色主题（输入框在本组件树内，可直接 :deep 命中） */
:deep(.export-range-picker) {
  width: 252px;
}
:deep(.export-range-picker .el-input__wrapper) {
  background-color: #0b2152 !important;
  box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.35) inset !important;
  border-radius: 4px;
}
:deep(.export-range-picker .el-range-input) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 12px;
}
:deep(.export-range-picker .el-range-separator) {
  color: #64748b !important;
  font-size: 12px;
}
:deep(.export-range-picker .el-range__icon),
:deep(.export-range-picker .el-range__close-icon) {
  color: #22d3ee !important;
}
</style>

<style>
/* 月范围下拉面板（teleport 到 body，需全局样式，深色主题） */
.export-range-popper.el-picker__popper {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.45) !important;
}
.export-range-popper .el-picker-panel {
  background-color: #0b2152;
  color: #e2e8f0;
}
.export-range-popper .el-date-range-picker__header {
  color: #e2e8f0;
}
.export-range-popper .el-date-range-picker__header div {
  color: #e2e8f0;
}
.export-range-popper .el-date-range-picker__header .el-icon-arrow-left,
.export-range-popper .el-date-range-picker__header .el-icon-arrow-right,
.export-range-popper .el-date-range-picker__header .el-icon-d-arrow-left,
.export-range-popper .el-date-range-picker__header .el-icon-d-arrow-right {
  color: #22d3ee;
}
.export-range-popper .el-month-table td .cell {
  color: #cbd5e1;
}
.export-range-popper .el-month-table td .cell:hover {
  color: #00f2ff;
}
.export-range-popper .el-month-table td.in-range .cell {
  background-color: rgba(0, 242, 255, 0.18);
  color: #00f2ff;
}
.export-range-popper .el-month-table td.start-date .cell,
.export-range-popper .el-month-table td.end-date .cell {
  background-color: #00f2ff;
  color: #04101f;
  font-weight: 700;
}
.export-range-popper .el-month-table td.disabled .cell {
  color: #334155;
}
.export-range-popper .el-picker-panel__footer {
  background-color: #0b2152;
  border-top: 1px solid rgba(6, 182, 212, 0.3);
}
</style>
