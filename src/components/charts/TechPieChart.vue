<template>
  <div ref="chartRef" :style="{ width: '100%', height: height + 'px' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface DataItem {
  name: string
  value: number
  color?: string
}

interface Props {
  data: DataItem[]
  height?: number
  innerRadius?: string       // 环形图内半径 e.g. '40%'
  outerRadius?: string       // 外半径 e.g. '70%'
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 140,
  innerRadius: '40%',
  outerRadius: '70%',
  showLabel: true,
})

const defaultColors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const buildOption = (): echarts.EChartsOption => ({
  tooltip: {
    trigger: 'item',
    appendToBody: true,
    backgroundColor: 'rgba(10, 31, 74, 0.95)',
    borderColor: '#06b6d4',
    textStyle: { color: '#e2e8f0', fontSize: 10 },
    formatter: '{b}: {c} ({d}%)',
  },
  series: [{
    type: 'pie',
    radius: [props.innerRadius, props.outerRadius],
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    itemStyle: { borderRadius: 2, borderColor: '#0a1e4a', borderWidth: 1 },
    label: props.showLabel ? {
      color: '#cbd5e1',
      fontSize: 9,
      formatter: '{b}\n{d}%',
    } : { show: false },
    labelLine: { lineStyle: { color: 'rgba(6,182,212,0.4)' } },
    data: props.data.map((d, i) => ({
      name: d.name,
      value: d.value,
      itemStyle: { color: d.color || defaultColors[i % defaultColors.length] },
    })),
  }],
})

const initChart = () => {
  if (!chartRef.value) return
  if (chart) chart.dispose()
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption())
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  setTimeout(initChart, 50)
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => { chart?.resize() })
    resizeObserver.observe(chartRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})

watch(() => props.data, () => { setTimeout(initChart, 50) }, { deep: true })
</script>
