<template>
  <div ref="chartRef" :style="{ width: '100%', height: height + 'px' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface SeriesItem {
  name: string
  data: number[]
  color?: string
  stack?: string             // 相同 stack 的系列会堆叠
}

interface Props {
  xData: string[]
  series: SeriesItem[]
  height?: number
  stacked?: boolean
  horizontal?: boolean
  showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 120,
  stacked: false,
  horizontal: false,
  showLegend: false,
})

const defaultColors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const buildOption = (): echarts.EChartsOption => {
  const isH = props.horizontal
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 31, 74, 0.95)',
      borderColor: '#06b6d4',
      textStyle: { color: '#e2e8f0', fontSize: 10 },
    },
    legend: props.showLegend ? {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#94a3b8', fontSize: 9 },
      itemGap: 6,
    } : undefined,
    grid: { top: props.showLegend ? '20%' : '12%', bottom: '18%', left: '12%', right: '8%' },
    xAxis: {
      type: isH ? 'value' as const : 'category' as const,
      data: isH ? undefined : props.xData,
      axisLine: { lineStyle: { color: 'rgba(6, 182, 212, 0.25)' } },
      axisLabel: { color: '#cbd5e1', fontSize: 9 },
    },
    yAxis: {
      type: isH ? 'category' as const : 'value' as const,
      data: isH ? props.xData : undefined,
      splitLine: { lineStyle: { color: 'rgba(6, 182, 212, 0.1)' } },
      axisLine: { show: false },
      axisLabel: { color: '#cbd5e1', fontSize: 8 },
    },
    series: props.series.map((s, i) => ({
      name: s.name,
      type: 'bar' as const,
      stack: props.stacked ? 'total' : s.stack,
      data: s.data,
      barWidth: props.stacked ? '40%' : `${Math.max(20, 60 / props.series.length)}%`,
      itemStyle: {
        color: s.color || defaultColors[i % defaultColors.length],
        borderRadius: props.stacked && i === props.series.length - 1 ? [2, 2, 0, 0] : 0,
      },
    })),
  }
}

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

watch(() => [props.xData, props.series], () => { setTimeout(initChart, 50) }, { deep: true })
</script>
