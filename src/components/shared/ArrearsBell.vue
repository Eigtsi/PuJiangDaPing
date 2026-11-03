<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-end"
    :width="290"
    trigger="click"
    :show-arrow="false"
    popper-class="arrears-popper"
  >
    <template #reference>
      <button
        type="button"
        class="relative w-6 h-6 flex items-center justify-center rounded text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 transition cursor-pointer shrink-0"
        title="欠费提醒"
      >
        <Bell class="w-4 h-4" />
        <span
          v-if="unreadCount > 0"
          class="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-rose-500 text-white text-[10px] leading-none flex items-center justify-center font-mono"
        >{{ unreadCount }}</span>
      </button>
    </template>

    <!-- 欠费列表 -->
    <div class="arrears-body">
      <div class="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20">
        <span class="text-xs font-bold text-slate-200">欠费提醒<span class="text-slate-400 font-normal ml-1">{{ feeType }}</span></span>
        <div class="flex items-center gap-2">
          <button type="button" @click="markAllRead" class="text-[11px] text-cyan-300 hover:text-cyan-200 transition cursor-pointer">全部已读</button>
          <button type="button" @click="visible = false" class="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-slate-200 hover:bg-cyan-500/10 transition cursor-pointer shrink-0" title="关闭">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div class="max-h-[300px] overflow-y-auto arrears-list">
        <div v-if="!list.length" class="text-xs text-slate-500 text-center py-6">暂无欠费记录</div>
        <div
          v-for="r in list"
          :key="r.id"
          @click="markRead(r.id)"
          :class="['flex items-start justify-between gap-2 px-3 py-2 border-b border-cyan-500/5 last:border-0 cursor-pointer transition', readIds.has(r.id) ? 'opacity-55' : 'hover:bg-cyan-500/5']"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span v-if="!readIds.has(r.id)" class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span class="text-slate-200 text-xs font-bold truncate">{{ r.enterpriseName }}</span>
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5 truncate">{{ r.property }} · {{ r.feeType }} · {{ r.month }}</div>
          </div>
          <div class="text-right shrink-0">
            <span class="font-mono text-amber-300 text-xs font-bold">{{ r.amount.toLocaleString('zh-CN') }}<span class="text-slate-400 ml-0.5 font-normal">元</span></span>
            <span :class="['block text-[10px] mt-0.5', readIds.has(r.id) ? 'text-slate-500' : 'text-rose-400']">{{ readIds.has(r.id) ? '已读' : '未读' }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Bell, X } from 'lucide-vue-next'
import { arrearsRecords, type ArrearsFeeType } from '../../data/arrears'

const props = defineProps<{
  feeType: ArrearsFeeType
}>()

// 控制下拉显隐（用于右上角叉叉关闭）
const visible = ref(false)

// 已读 id 集合（初始填充数据中 read=true 的记录）
const readIds = reactive(new Set<string>())
for (const r of arrearsRecords) {
  if (r.read) readIds.add(r.id)
}

const list = computed(() => arrearsRecords.filter((r) => r.feeType === props.feeType))
const unreadCount = computed(() => list.value.filter((r) => !readIds.has(r.id)).length)

function markRead(id: string) {
  readIds.add(id)
}

function markAllRead() {
  for (const r of list.value) readIds.add(r.id)
}
</script>

<style scoped>
.arrears-list::-webkit-scrollbar {
  width: 6px;
}
.arrears-list::-webkit-scrollbar-track {
  background: rgba(5, 19, 48, 0.4);
  border-radius: 3px;
}
.arrears-list::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.4);
  border-radius: 3px;
}
.arrears-list::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.7);
}
</style>

<style>
/* 欠费下拉面板深色主题（teleport 到 body，带透明度 + 毛玻璃，与其他悬浮面板一致） */
.arrears-popper.el-popper {
  background-color: rgba(9, 34, 79, 0.72) !important;
  border: 1px solid rgba(6, 182, 212, 0.45) !important;
  border-radius: 6px;
  padding: 0 !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
