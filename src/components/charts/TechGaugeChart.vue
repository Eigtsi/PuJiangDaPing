<template>
  <div ref="chartRef" :style="{ width: '100%', height: height + 'px' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  value: number               // 0-100
  label?: string
  color?: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  color: '#06b6d4',
  height: 120,
})

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const buildOption = (): echarts.EChartsOption => ({
  series: [{
    type: 'gauge',
    startAngle: 210,
    endAngle: -30,
    min: 0,
    max: 100,
    progress: { show: true, width: 10, itemStyle: { color: props.color } },
    axisLine: { lineStyle: { width: 10, color: [[1, 'rgba(6,182,212,0.15)']] } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    pointer: { show: false },
    title: { offsetCenter: [0, '70%'], fontSize: 10, color: '#cbd5e1' },
    detail: {
      valueAnimation: true,
      offsetCenter: [0, '30%'],
      fontSize: 18,
      fontWeight: 'bold',
      color: props.color,
      formatter: '{value}%',
    },
    data: [{ value: props.value, name: props.label }],
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

watch(() => props.value, () => { setTimeout(initChart, 50) })
</script>
