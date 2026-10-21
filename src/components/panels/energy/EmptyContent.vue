<template>
  <div></div>
</template>

<script setup lang="ts">
defineProps<{
  isLargeScreen?: boolean
}>()

defineEmits<{
  (e: 'toast', msg: string): void
}>()
</script>
