<template>
  <div :class="['font-sans text-xs', isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10 space-y-1.5">
      <!-- Header -->
      <div class="flex justify-between border-b border-cyan-500/10 pb-1 text-slate-400 font-bold">
        <span v-for="col in columns" :key="col.key" :style="{ width: col.width || 'auto' }" :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''">
          {{ col.label }}
        </span>
      </div>
      <!-- Rows -->
      <div
        v-for="(row, idx) in rows"
        :key="idx"
        class="flex justify-between text-slate-200 cursor-pointer hover:text-white transition"
        @click="$emit('rowClick', row)"
      >
        <template v-for="col in columns" :key="col.key">
          <span
            :style="{ width: col.width || 'auto' }"
            :class="[
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '',
              col.class || ''
            ]"
          >
            <template v-if="col.isBadge">
              <StatusBadge :text="String(row[col.key])" :type="col.badgeType" />
            </template>
            <template v-else-if="col.classMap">
              <span :class="col.classMap[row[col.key]] || 'text-cyan-300'">{{ row[col.key] }}</span>
            </template>
            <template v-else>
              {{ row[col.key] }}
            </template>
          </span>
        </template>
      </div>
      <!-- Footer -->
      <div v-if="footer" class="text-[9px] text-slate-450 flex justify-between pt-1 border-t border-cyan-500/10 font-sans font-bold">
        <span v-for="item in footer" :key="item.label">
          {{ item.label }}: <span :class="item.class || 'text-emerald-400'">{{ item.value }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'

interface Column {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  class?: string
  isBadge?: boolean
  badgeType?: 'success' | 'warning' | 'danger' | 'info' | 'processing'
  classMap?: Record<string, string>
}

interface FooterItem {
  label: string
  value: string | number
  class?: string
}

interface Props {
  columns: Column[]
  rows: Record<string, any>[]
  footer?: FooterItem[]
  isLargeScreen?: boolean
}

interface Emits {
  (e: 'rowClick', row: Record<string, any>): void
}

withDefaults(defineProps<Props>(), {
  isLargeScreen: true,
  footer: undefined,
})

defineEmits<Emits>()
</script>
