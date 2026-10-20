<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between gap-2.5 min-h-0' : 'space-y-3.5']">
    <!-- image thumbnail with bigger size and full scenery viewing layout -->
    <div :class="[isLargeScreen ? 'h-[140px]' : '', 'relative rounded overflow-hidden border border-cyan-500/30 group']">
      <img
        src="/src/assets/images/industrial_park_view_1779843805340.png"
        alt="Pujiang Crystal Industry Operation Management"
        class="w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
      />
      <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#02081d] to-transparent p-1.5 px-2.5 text-xs text-cyan-200 flex justify-between font-bold">
        <span>智慧运营大脑监控中</span>
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />三维孪生
        </span>
      </div>
    </div>

    <!-- Description requested by user -->
    <div :class="['text-slate-100 leading-relaxed overflow-y-auto pr-1 bg-[#071638]/40 border border-[#06b6d4]/10 rounded font-sans', isLargeScreen ? 'text-xs p-1.5 max-h-[82px]' : 'text-sm p-3 rounded max-h-32']">
      聚焦园区资产与经营状况的可视化分析。动态展示各厂房、宿舍等资产的租赁状态、承租企业信息及合同期限。实时统计并展示园区整体及分区域的租金、物业费、水电费等各类收入构成与收缴情况，动态呈现园区运营的经济效益指标。
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-2 text-center">
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-1' : 'p-3']">
        <span class="block text-[10px] text-slate-350 font-bold">运营总有效资产</span>
        <span :class="['block font-black text-cyan-300 font-mono', isLargeScreen ? 'text-xs mt-0.5' : 'text-lg md:text-xl mt-1']">45.2 万㎡</span>
      </div>
      <div
        @click="emit('toast', '当前正在展示各资产类型的出租与营运数据...')"
        :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded cursor-pointer hover:border-cyan-400 transition', isLargeScreen ? 'py-1' : 'p-3']"
      >
        <span class="block text-[10px] text-slate-350 font-bold">租户投产合规率</span>
        <span :class="['block font-black text-emerald-400 font-mono', isLargeScreen ? 'text-xs mt-0.5' : 'text-lg md:text-xl mt-1']">98.4%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()
</script>
