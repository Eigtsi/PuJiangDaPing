<template>
  <div :class="['font-sans', isLargeScreen ? 'space-y-2' : 'space-y-3.5']">
    <!-- Header -->
    <div class="flex justify-between items-center text-[13px] text-cyan-300 font-bold bg-[#0b245c]/30 p-1.5 rounded">
      <span>📝 入驻合同审批与续签流程闭环</span>
      <span class="text-[#cbd5e1] font-mono text-xs">当日待办: 4份</span>
    </div>

    <!-- Current approval status -->
    <div class="border border-cyan-500/15 bg-gradient-to-r from-[#0d2a63]/25 to-[#0b2152]/10 p-1.5 rounded space-y-1">
      <div class="flex justify-between text-slate-300 font-bold text-[13px]">
        <span>正在用章：浦江晶智科技（A栋3F扩租合同）</span>
        <span class="text-[#2dd4bf]">审批中 80%</span>
      </div>
      <div class="text-xs text-slate-450">
        <span>提交发起：经办客服部门</span>
        <span class="mx-2">|</span>
        <span>当前会签：财务、资产及法务审核</span>
      </div>

      <!-- Flow timeline -->
      <div class="grid grid-cols-4 gap-1 mt-1 text-xs text-center font-sans">
        <div class="bg-emerald-950/80 text-emerald-400 p-1 border border-emerald-500/20 rounded font-bold">✓ 1.申请提报</div>
        <div class="bg-emerald-950/80 text-emerald-400 p-1 border border-emerald-500/20 rounded font-bold">✓ 2.主管批准</div>
        <div class="bg-cyan-950/80 text-cyan-300 p-1 border border-cyan-500/30 rounded font-bold animate-pulse">→ 3.会印签章</div>
        <div class="bg-slate-900/60 text-slate-500 p-1 rounded">4.归档交付</div>
      </div>
    </div>

    <!-- Approval statistics -->
    <div class="grid grid-cols-3 gap-1 text-center">
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">年度签约</span>
        <span class="text-base font-bold text-cyan-300 font-mono">158 <span class="text-xs text-slate-500">份</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">履约绿灯率</span>
        <span class="text-base font-bold text-emerald-400 font-mono">100<span class="text-xs text-slate-500">%</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">审批通过率</span>
        <span class="text-base font-bold text-emerald-400 font-mono">97.5<span class="text-xs text-slate-500">%</span></span>
      </div>
    </div>

    <!-- Pending approval list -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[13px] text-cyan-300 font-bold mb-1 font-sans">⏳ 待审批事项</div>
      <div class="space-y-0.5 text-[13px] font-mono">
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">恒锐水晶 续租3年申请</span>
          <span class="text-amber-400">会签中</span>
        </div>
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">锦程灯饰 面积调整申请</span>
          <span class="text-amber-400">待主管</span>
        </div>
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">鑫达物流 退园手续</span>
          <span class="text-rose-400">法务审核</span>
        </div>
      </div>
    </div>

    <!-- Bottom stats bar -->
    <div class="bg-[#051330]/60 p-1.5 rounded border border-cyan-500/10 flex justify-between items-center text-[13px]">
      <span class="text-slate-400 font-sans">累计执行合同：</span>
      <span class="text-cyan-250 font-bold font-mono text-xs">满意度 99.8% | 平均审批 2.3工作日</span>
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
