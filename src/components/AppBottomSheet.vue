<template>
  <div v-if="show" class="fixed inset-0 z-50" @click="$emit('close')">
    <div class="absolute inset-0 bg-ink/40 sheet-bg" />
    <div
      class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl sheet-panel"
      :class="panelClass"
      @click.stop
    >
      <div class="w-8 h-1 rounded-full bg-border mx-auto mt-3 mb-1" />
      <slot name="title" />
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  panelClass: { type: String, default: 'px-6 pb-8 pt-3' },
})
defineEmits(['close'])
</script>

<style scoped>
.sheet-bg {
  animation: sheetFadeIn 0.2s ease;
}
.sheet-panel {
  animation: sheetSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes sheetFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sheetSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
