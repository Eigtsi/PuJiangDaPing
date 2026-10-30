<template>
  <div
    :class="[
      'tech-panel bg-[#0a1e4a]/60 border border-cyan-500/35 rounded-lg relative transition-all duration-300 flex flex-col min-h-0',
      isLargeScreen ? 'p-4 font-medium' : 'p-4',
      collapsible && !collapsed ? 'flex-1' : '',
      collapsible && collapsed ? 'overflow-hidden' : '',
      'hover:border-cyan-400/60',
      className
    ]"
  >
    <!-- HUD 四角括号（右上 / 左下，配合 .tech-panel 的 ::before/::after 补齐四角） -->
    <span class="hud-corner hud-corner-tr" />
    <span class="hud-corner hud-corner-bl" />

    <!-- Title bar: clickable when collapsible -->
    <div
      :class="[
        'flex items-center justify-between border-b border-cyan-500/20',
        isLargeScreen ? 'pb-2 mb-2' : 'pb-2 mb-3',
        collapsible ? 'cursor-pointer select-none' : ''
      ]"
      @click="collapsible && $emit('toggle')"
    >
      <div :class="['flex items-center gap-2 text-cyan-400 font-bold tracking-wider drop-shadow-[0_0_6px_rgba(0,242,255,0.35)]', isLargeScreen ? 'text-sm md:text-base' : 'text-base md:text-lg']">
        <slot name="icon"></slot>
        <span>{{ title }}</span>
        <!-- Collapse/expand indicator -->
        <svg v-if="collapsible" :class="['w-3 h-3 text-cyan-500 transition-transform duration-300', collapsed ? '' : 'rotate-180']" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          v-if="expandable"
          type="button"
          class="w-5 h-5 flex items-center justify-center rounded text-white/40 hover:text-neon-blue hover:bg-neon-blue/10 transition"
          :title="`展开「${title}」`"
          @click.stop="$emit('expand')"
        >
          <Maximize2 class="w-3.5 h-3.5" />
        </button>
        <div class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_5px_rgba(0,242,255,0.6)]" />
      </div>
    </div>

    <!-- Content: hidden when collapsed -->
    <div v-show="!collapsed" :class="[collapsible ? 'transition-all duration-300' : '', autoHeight ? 'overflow-y-auto no-scrollbar' : 'flex-1 min-h-0 overflow-y-auto no-scrollbar']">
      <slot></slot>
    </div>

    <!-- Collapsed hint -->
    <div v-if="collapsed" class="text-[11px] text-slate-500 text-center py-1">
      点击展开
    </div>
  </div>
</template>

<script setup lang="ts">
import { Maximize2 } from 'lucide-vue-next'

interface Props {
  title: string;
  className?: string;
  isLargeScreen?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  expandable?: boolean;
  autoHeight?: boolean;
}

withDefaults(defineProps<Props>(), {
  className: '',
  isLargeScreen: true,
  collapsible: false,
  collapsed: false,
  expandable: true,
  autoHeight: false,
});

defineEmits<{
  (e: 'toggle'): void;
  (e: 'expand'): void;
}>();
</script>
