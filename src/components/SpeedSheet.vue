<template>
  <AppBottomSheet :show="show" panelClass="px-6 pb-8 pt-3" @close="$emit('close')">
    <template #title>
      <p class="text-center text-xs font-bold text-ink-soft tracking-widest uppercase mb-6">
        Velocidad
      </p>
    </template>

    <div class="text-center mb-6">
      <span class="text-5xl font-bold text-ink tabular-nums">{{ displayValue }}</span>
    </div>

    <div class="px-2 mb-6">
      <input
        type="range"
        min="0.25"
        max="1.5"
        step="0.05"
        :value="value"
        @input="$emit('change', parseFloat($event.target.value))"
        class="w-full accent-accent h-1.5 appearance-none bg-border rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab"
      />
      <div class="flex justify-between text-xs text-ink-soft mt-1.5 px-0.5">
        <span>0.25×</span>
        <span>1.5×</span>
      </div>
    </div>

    <div class="flex justify-center gap-2">
      <button
        v-for="s in presets"
        :key="s"
        class="px-5 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer"
        :class="value === s ? 'bg-accent text-white border-accent' : 'bg-white text-ink border-border hover:bg-surface'"
        @click="$emit('change', s)"
      >
        {{ s }}×
      </button>
    </div>

    <p class="text-center text-[11px] text-ink-soft mt-6 leading-relaxed">
      El autoscroll se sincroniza<br />automáticamente
    </p>
  </AppBottomSheet>
</template>

<script setup>
import { computed } from 'vue'
import AppBottomSheet from './AppBottomSheet.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  value: { type: Number, default: 1 },
})

defineEmits(['close', 'change'])

const presets = [0.5, 0.75, 1, 1.25]

const displayValue = computed(() => {
  const v = props.value
  return v === 1 ? '1×' : v + '×'
})
</script>
