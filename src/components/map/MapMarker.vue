<template>
  <g :transform="`translate(${x}, ${y})`" class="cursor-pointer" @click.stop="$emit('click', marker)">
    <!-- 脉冲扩散圈 -->
    <circle v-if="status === 'alert'" r="3" :fill="statusColor" fill-opacity="0.1" stroke="none">
      <animate attributeName="r" from="1.5" to="4.5" dur="2s" repeatCount="indefinite" />
      <animate attributeName="fill-opacity" from="0.25" to="0" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle v-else-if="status === 'warning'" r="2.8" :fill="statusColor" fill-opacity="0.08" stroke="none">
      <animate attributeName="r" from="1.3" to="3.8" dur="3s" repeatCount="indefinite" />
      <animate attributeName="fill-opacity" from="0.15" to="0" dur="3s" repeatCount="indefinite" />
    </circle>

    <!-- 外圈底座光晕 -->
    <circle r="1.8" :fill="statusColor" fill-opacity="0.12" stroke="none" />

    <!-- 底座圆盘 -->
    <circle r="1.6" fill="rgba(4,14,41,0.85)" :stroke="statusColor" stroke-width="0.2" stroke-opacity="0.6" />

    <!-- 按类型绘制图标 -->
    <!-- 企业：工厂建筑 -->
    <g v-if="marker.type === 'enterprise'" :fill="statusColor" stroke="none">
      <rect x="-0.7" y="-0.4" width="0.5" height="0.8" rx="0.05" />
      <rect x="-0.1" y="-0.7" width="0.5" height="1.1" rx="0.05" />
      <rect x="0.5" y="-0.2" width="0.4" height="0.6" rx="0.05" />
      <!-- 烟囱 -->
      <rect x="0.65" y="-0.6" width="0.15" height="0.35" />
    </g>

    <!-- 氟化物池：烧杯/化学反应池 -->
    <g v-else-if="marker.type === 'fluoride_pool'" :fill="statusColor" stroke="none">
      <!-- 烧杯轮廓 -->
      <path d="M-0.5,-0.7 L-0.5,-0.2 L-0.7,0.5 Q-0.7,0.7 -0.5,0.7 L0.5,0.7 Q0.7,0.7 0.7,0.5 L0.5,-0.2 L0.5,-0.7 Z" fill-opacity="0.3" :stroke="statusColor" stroke-width="0.15" />
      <!-- 液面波纹 -->
      <path d="M-0.55,0 Q-0.3,0.15 0,0 Q0.3,-0.15 0.55,0" fill="none" :stroke="statusColor" stroke-width="0.12" />
      <!-- F标识 -->
      <text x="0" y="0.45" text-anchor="middle" :fill="statusColor" font-size="0.55" font-weight="bold" font-family="sans-serif">F</text>
    </g>

    <!-- 排污口：排水管道 -->
    <g v-else-if="marker.type === 'discharge_outlet'" :fill="statusColor" stroke="none">
      <!-- 管道主体 -->
      <rect x="-0.8" y="-0.25" width="1.0" height="0.5" rx="0.1" fill-opacity="0.35" :stroke="statusColor" stroke-width="0.12" />
      <!-- 排水口 -->
      <path d="M0.2,-0.25 L0.6,-0.5 L0.6,0.5 L0.2,0.25 Z" fill-opacity="0.4" :stroke="statusColor" stroke-width="0.1" />
      <!-- 水滴 -->
      <ellipse cx="0.8" cy="0" rx="0.15" ry="0.2" fill-opacity="0.6" />
    </g>

    <!-- 大气站：风速仪/信号塔 -->
    <g v-else-if="marker.type === 'air_station'" :fill="statusColor" stroke="none">
      <!-- 中心柱 -->
      <rect x="-0.08" y="-0.1" width="0.16" height="0.8" rx="0.04" />
      <!-- 三叶风叶 -->
      <circle cx="0" cy="-0.15" r="0.15" fill-opacity="0.6" />
      <path d="M0,-0.15 Q-0.5,-0.7 -0.15,-0.7 Q0,-0.4 0,-0.15" fill-opacity="0.5" />
      <path d="M0,-0.15 Q0.6,-0.2 0.55,0.15 Q0.2,0 0,-0.15" fill-opacity="0.5" />
      <path d="M0,-0.15 Q-0.3,0.4 0.05,0.45 Q0.1,0.15 0,-0.15" fill-opacity="0.5" />
      <!-- 底座 -->
      <rect x="-0.3" y="0.65" width="0.6" height="0.1" rx="0.05" fill-opacity="0.4" />
    </g>

    <!-- 雨排口：雨滴云朵 -->
    <g v-else-if="marker.type === 'rain_outlet'" :fill="statusColor" stroke="none">
      <!-- 云朵 -->
      <circle cx="-0.2" cy="-0.3" r="0.3" fill-opacity="0.35" />
      <circle cx="0.2" cy="-0.35" r="0.25" fill-opacity="0.35" />
      <circle cx="0" cy="-0.45" r="0.25" fill-opacity="0.35" />
      <rect x="-0.4" y="-0.35" width="0.8" height="0.2" fill-opacity="0.3" />
      <!-- 雨滴 -->
      <ellipse cx="-0.25" cy="0.15" rx="0.07" ry="0.12" />
      <ellipse cx="0" cy="0.25" rx="0.07" ry="0.12" />
      <ellipse cx="0.25" cy="0.1" rx="0.07" ry="0.12" />
    </g>

    <!-- VOC：分子结构 -->
    <g v-else-if="marker.type === 'voc'" :fill="statusColor" stroke="none">
      <!-- 中心原子 -->
      <circle cx="0" cy="0" r="0.25" fill-opacity="0.5" :stroke="statusColor" stroke-width="0.1" />
      <!-- 外围原子键 -->
      <line x1="0" y1="-0.25" x2="0" y2="-0.6" :stroke="statusColor" stroke-width="0.08" />
      <circle cx="0" cy="-0.7" r="0.15" fill-opacity="0.4" />
      <line x1="0.22" y1="0.12" x2="0.5" y2="0.35" :stroke="statusColor" stroke-width="0.08" />
      <circle cx="0.58" cy="0.42" r="0.15" fill-opacity="0.4" />
      <line x1="-0.22" y1="0.12" x2="-0.5" y2="0.35" :stroke="statusColor" stroke-width="0.08" />
      <circle cx="-0.58" cy="0.42" r="0.15" fill-opacity="0.4" />
    </g>

    <!-- 恶臭：鼻子/气味波 -->
    <g v-else-if="marker.type === 'odor'" :fill="statusColor" stroke="none">
      <!-- 气味波浪线 -->
      <path d="M-0.5,0.2 Q-0.25,-0.1 0,0.2 Q0.25,-0.1 0.5,0.2" fill="none" :stroke="statusColor" stroke-width="0.12" />
      <path d="M-0.4,-0.15 Q-0.2,-0.45 0,-0.15 Q0.2,-0.45 0.4,-0.15" fill="none" :stroke="statusColor" stroke-width="0.12" />
      <path d="M-0.3,-0.5 Q-0.15,-0.7 0,-0.5 Q0.15,-0.7 0.3,-0.5" fill="none" :stroke="statusColor" stroke-width="0.1" fill-opacity="0.6" />
      <!-- 感叹号 -->
      <rect x="-0.06" y="0.35" width="0.12" height="0.2" rx="0.03" />
      <circle cx="0" cy="0.65" r="0.07" />
    </g>

    <!-- 固废暂存：垃圾桶 -->
    <g v-else-if="marker.type === 'waste_storage'" :fill="statusColor" stroke="none">
      <!-- 桶盖 -->
      <rect x="-0.5" y="-0.6" width="1.0" height="0.15" rx="0.05" />
      <!-- 把手 -->
      <rect x="-0.2" y="-0.75" width="0.4" height="0.15" rx="0.08" fill-opacity="0.4" :stroke="statusColor" stroke-width="0.08" />
      <!-- 桶身 -->
      <path d="M-0.4,-0.45 L-0.35,0.6 Q-0.35,0.7 -0.25,0.7 L0.25,0.7 Q0.35,0.7 0.35,0.6 L0.4,-0.45 Z" fill-opacity="0.35" :stroke="statusColor" stroke-width="0.1" />
      <!-- 回收标志线 -->
      <line x1="-0.15" y1="-0.15" x2="-0.15" y2="0.35" :stroke="statusColor" stroke-width="0.06" />
      <line x1="0.15" y1="-0.15" x2="0.15" y2="0.35" :stroke="statusColor" stroke-width="0.06" />
    </g>

    <!-- 地磅：称重台 -->
    <g v-else-if="marker.type === 'weigh_station'" :fill="statusColor" stroke="none">
      <!-- 称台 -->
      <rect x="-0.6" y="-0.15" width="1.2" height="0.35" rx="0.05" fill-opacity="0.4" :stroke="statusColor" stroke-width="0.1" />
      <!-- 支柱 -->
      <rect x="-0.5" y="0.2" width="0.15" height="0.3" />
      <rect x="0.35" y="0.2" width="0.15" height="0.3" />
      <!-- 显示屏 -->
      <rect x="-0.25" y="-0.6" width="0.5" height="0.35" rx="0.05" fill-opacity="0.3" :stroke="statusColor" stroke-width="0.08" />
      <text x="0" y="-0.38" text-anchor="middle" :fill="statusColor" font-size="0.28" font-weight="bold" font-family="monospace">kg</text>
    </g>

    <!-- hover 标签 -->
    <g class="opacity-0 hover:opacity-100 transition-opacity duration-200" style="pointer-events: none">
      <rect x="-22" y="-10" width="44" height="7" rx="0.5" fill="rgba(11,33,82,0.92)" stroke="rgba(6,182,212,0.5)" stroke-width="0.2" />
      <text x="0" y="-5.5" text-anchor="middle" fill="#e2e8f0" font-size="3.2" font-weight="bold" font-family="sans-serif">{{ truncatedName }}</text>
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MapMarker as MapMarkerData } from '../../data/mapData'
import { statusColors } from '../../data/mapData'

interface Props {
  marker: MapMarkerData
}

const props = defineProps<Props>()
defineEmits<{ (e: 'click', marker: MapMarkerData): void }>()

const x = computed(() => props.marker.x)
const y = computed(() => props.marker.y)
const status = computed(() => props.marker.status)
const statusColor = computed(() => statusColors[props.marker.status])
const truncatedName = computed(() => props.marker.name.length > 8 ? props.marker.name.substring(0, 8) + '..' : props.marker.name)
</script>
