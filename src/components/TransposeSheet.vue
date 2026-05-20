<template>
  <AppBottomSheet :show="show" panelClass="px-5 pt-5 pb-8" @close="$emit('close')">
    <template #title>
      <p class="text-center text-xs font-bold text-ink-soft tracking-widest uppercase mb-3">Transponer</p>
    </template>
    <TransposeBar :keyText @transpose="$emit('transpose', $event)" />
  </AppBottomSheet>
</template>

<script setup>
import AppBottomSheet from './AppBottomSheet.vue'
import TransposeBar from './TransposeBar.vue'

defineProps({
  show: Boolean,
  keyText: { type: String, default: 'Tono Original' },
})
defineEmits(['close', 'transpose'])
</script>
