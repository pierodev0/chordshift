<template>
  <div class="fixed inset-0 z-50" @click="$emit('close')">
    <div class="absolute inset-0 bg-ink/40 animate-fade-in" />
    <div
      class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl px-6 pb-8 pt-3 animate-slide-up"
      @click.stop
    >
      <div class="w-8 h-1 rounded-full bg-border mx-auto mb-4" />

      <p class="text-center text-xs font-bold text-ink-soft tracking-widest uppercase mb-6">
        Velocidad
      </p>

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
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 1 },
})

defineEmits(['close', 'change'])

const presets = [0.5, 0.75, 1, 1.25]

const displayValue = computed(() => {
  const v = props.value
  return v === 1 ? '1×' : v + '×'
})
</script>
