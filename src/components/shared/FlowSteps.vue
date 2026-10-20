<template>
  <div class="grid grid-cols-4 gap-1 text-[8px] text-center font-sans">
    <div
      v-for="(step, idx) in steps"
      :key="idx"
      :class="[
        'p-0.5 rounded font-bold border',
        getStepClass(idx)
      ]"
    >
      {{ idx + 1 }}.{{ step }}
      <span v-if="idx === activeStep" class="block animate-pulse">▲</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  steps: string[]               // 4个步骤名称
  activeStep: number             // 0-3 当前进行到的步骤
  completedClass?: string
  activeClass?: string
  pendingClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  completedClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/20',
  activeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/20',
  pendingClass: 'bg-slate-900/60 text-slate-400 border-transparent',
})

const getStepClass = (idx: number) => {
  if (idx < props.activeStep) return props.completedClass
  if (idx === props.activeStep) return props.activeClass
  return props.pendingClass
}
</script>
