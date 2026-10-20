<template>
  <div :class="[isLargeScreen ? 'space-y-3' : 'space-y-4']">
    <!-- Header -->
    <div :class="['flex justify-between items-center text-slate-200 border-b border-[#06b6d4]/20 font-sans font-bold pb-1.5', isLargeScreen ? 'text-base' : 'text-lg']">
      <span>专属两专二代保障机制</span>
      <span class="text-[#2dd4bf]">在线全时受理</span>
    </div>

    <!-- Quick action buttons -->
    <div class="grid grid-cols-3 gap-2">
      <button
        @click="emit('toast', '管委会林总管已收到您的急难诉求！15分钟内电话回复')"
        class="rounded border border-cyan-500/30 bg-[#07245c] p-2.5 text-center cursor-pointer hover:border-[#2dd4bf] hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition group"
      >
        <div class="text-xl group-hover:scale-110 transition">📞</div>
        <span class="text-base text-cyan-300 font-bold block font-sans">一键呼叫</span>
        <span class="text-sm text-slate-400 block">急难直达</span>
      </button>
      <button
        @click="emit('toast', '已打开在线申报表单，请填写诉求内容')"
        class="rounded border border-cyan-500/30 bg-[#07245c] p-2.5 text-center cursor-pointer hover:border-[#2dd4bf] hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition group"
      >
        <div class="text-xl group-hover:scale-110 transition">📝</div>
        <span class="text-base text-cyan-300 font-bold block font-sans">在线申报</span>
        <span class="text-sm text-slate-400 block">表单提交</span>
      </button>
      <button
        @click="emit('toast', '诉求进度查询：当前在办 3 件，平均处理 1.2 工作日')"
        class="rounded border border-cyan-500/30 bg-[#07245c] p-2.5 text-center cursor-pointer hover:border-[#2dd4bf] hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition group"
      >
        <div class="text-xl group-hover:scale-110 transition">🔍</div>
        <span class="text-base text-cyan-300 font-bold block font-sans">进度查询</span>
        <span class="text-sm text-slate-400 block">实时跟踪</span>
      </button>
    </div>

    <!-- Service channels -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10 font-sans', isLargeScreen ? 'p-2.5' : 'p-3']">
      <div class="text-base text-cyan-300 font-bold mb-1.5">📋 管委会「代代办」专项直通</div>
      <div class="text-sm text-slate-400 leading-relaxed">
        两专二代团队在线代申报涉企减排账目、人才奖励款项、全自动清运审核等，全流程闭环管理。
      </div>
      <div class="grid grid-cols-2 gap-1.5 mt-2 text-sm border-t border-cyan-500/15 pt-2">
        <div class="flex items-center gap-1.5 text-amber-300">
          <span>🔄</span><span class="font-sans">代办中: 3D切片增容专案</span>
        </div>
        <div class="flex items-center gap-1.5 text-cyan-300">
          <span>👨‍🔧</span><span class="font-sans">派单中: 23号大楼供气</span>
        </div>
        <div class="flex items-center gap-1.5 text-emerald-300">
          <span>✅</span><span class="font-sans">已完成: 华兴电力增容</span>
        </div>
        <div class="flex items-center gap-1.5 text-cyan-300">
          <span>📋</span><span class="font-sans">待派单: 环保整改协助</span>
        </div>
      </div>
    </div>

    <!-- Service statistics -->
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-2">
        <span class="text-sm text-slate-400 block font-sans">本月受理</span>
        <span class="text-xl font-bold text-cyan-300 font-mono">18 <span class="text-sm text-slate-500">件</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-2">
        <span class="text-sm text-slate-400 block font-sans">平均响应</span>
        <span class="text-xl font-bold text-emerald-400 font-mono">1.2 <span class="text-sm text-slate-500">工作日</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-2">
        <span class="text-sm text-slate-400 block font-sans">满意度</span>
        <span class="text-xl font-bold text-emerald-400 font-mono">5.0 <span class="text-sm text-slate-500">分</span></span>
      </div>
    </div>

    <!-- Hot service links -->
    <div :class="['bg-[#0d2a63]/30 rounded border border-cyan-500/10', isLargeScreen ? 'p-2.5' : 'p-3']">
      <div class="text-base text-cyan-300 font-bold mb-2 font-sans">🔥 高频服务快捷入口</div>
      <div class="flex flex-wrap gap-1.5">
        <button @click="emit('toast', '正在打开：固废清运在线申请')" class="text-sm px-3 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/25 transition font-sans">固废清运</button>
        <button @click="emit('toast', '正在打开：扩租/退租申请')" class="text-sm px-3 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/25 transition font-sans">扩租申请</button>
        <button @click="emit('toast', '正在打开：环保整改协助')" class="text-sm px-3 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/25 transition font-sans">环保整改</button>
        <button @click="emit('toast', '正在打开：电力增容申请')" class="text-sm px-3 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/25 transition font-sans">电力增容</button>
        <button @click="emit('toast', '正在打开：招工需求发布')" class="text-sm px-3 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/25 transition font-sans">招工需求</button>
        <button @click="emit('toast', '正在打开：政策奖励申报')" class="text-sm px-3 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/25 transition font-sans">政策奖励</button>
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
