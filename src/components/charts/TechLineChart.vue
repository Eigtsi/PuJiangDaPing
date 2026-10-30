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
  smooth?: boolean
  areaStyle?: boolean
  yAxisIndex?: number
}

interface Props {
  xData: string[]
  series: SeriesItem[]
  height?: number
  yMin?: number
  yMax?: number
  yInterval?: number
  yFormatter?: string
  yName?: string
  y2Name?: string
  showArea?: boolean
  showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 96,
  showArea: true,
  showLegend: false,
})

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const buildOption = (): echarts.EChartsOption => {
  const hasSecondAxis = props.series.some(s => s.yAxisIndex === 1)

  const makeYAxis = (second: boolean) => ({
    type: 'value' as const,
    position: second ? ('right' as const) : ('left' as const),
    min: second ? undefined : props.yMin,
    max: second ? undefined : props.yMax,
    interval: (second || hasSecondAxis) ? undefined : props.yInterval,
    splitNumber: 4,
    name: second ? props.y2Name : props.yName,
    nameTextStyle: { color: '#94a3b8', fontSize: 10 },
    splitLine: { show: !second, lineStyle: { color: 'rgba(6, 182, 212, 0.2)' } },
    axisLine: { lineStyle: { color: 'rgba(6, 182, 212, 0.5)' } },
    axisLabel: {
      color: '#cbd5e1',
      fontSize: 10,
      formatter: second ? undefined : (props.yFormatter ? `{value}${props.yFormatter}` : undefined),
    },
  })

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 31, 74, 0.95)',
      borderColor: '#06b6d4',
      textStyle: { color: '#e2e8f0', fontSize: 10 },
    },
    ...(props.showLegend ? {
      legend: {
        show: true,
        type: 'scroll',
        top: 2,
        left: 'center',
        itemWidth: 12,
        itemHeight: 9,
        itemGap: 14,
        icon: 'circle',
        textStyle: { color: '#cbd5e1', fontSize: 10 },
        pageIconSize: 9,
        pageIconColor: '#06b6d4',
        pageIconInactiveColor: '#334155',
        pageTextStyle: { color: '#94a3b8', fontSize: 9 },
      },
    } : {}),
    grid: { top: props.showLegend ? '24%' : '12%', bottom: 20, left: '12%', right: hasSecondAxis ? '12%' : '8%' },
    xAxis: {
      type: 'category',
      data: props.xData,
      axisLine: { lineStyle: { color: 'rgba(6, 182, 212, 0.5)' } },
      axisLabel: { color: '#cbd5e1', fontSize: 9 },
    },
    yAxis: hasSecondAxis ? [makeYAxis(false), makeYAxis(true)] : makeYAxis(false),
    series: props.series.map(s => ({
      name: s.name,
      type: 'line' as const,
      smooth: s.smooth !== false,
      data: s.data,
      symbol: 'circle',
      symbolSize: 3,
      yAxisIndex: s.yAxisIndex ?? 0,
      itemStyle: { color: s.color || '#06b6d4' },
      lineStyle: { width: 1.5, color: s.color || '#06b6d4' },
      ...(props.showArea ? {
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: (s.color || '#06b6d4') + '66' },
            { offset: 1, color: (s.color || '#06b6d4') + '00' },
          ]),
        },
      } : {}),
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

watch(() => [props.xData, props.series], () => {
  setTimeout(initChart, 50)
}, { deep: true })
</script>
