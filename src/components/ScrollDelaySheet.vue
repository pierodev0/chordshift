<template>
  <AppBottomSheet :show="show" panelClass="px-6 pb-8 pt-3" @close="$emit('close')">
    <template #title>
      <p class="text-center text-xs font-bold text-ink-soft tracking-widest uppercase mb-6">
        Delay de scroll
      </p>
    </template>

    <div class="text-center mb-6">
      <div class="flex items-center justify-center gap-5">
        <button
          class="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center cursor-pointer hover:border-accent hover:text-accent transition-colors bg-white"
          @click="stepDown"
          aria-label="Reducir delay"
        >−</button>
        <span class="text-4xl font-bold text-ink tabular-nums min-w-[100px]">{{ displayValue }}</span>
        <button
          class="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center cursor-pointer hover:border-accent hover:text-accent transition-colors bg-white"
          @click="stepUp"
          aria-label="Aumentar delay"
        >+</button>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="opt in options"
        :key="opt.value"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer min-w-[60px]"
        :class="modelValue === opt.value ? 'bg-accent text-white border-accent' : 'bg-white text-ink border-border hover:bg-surface'"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <p class="text-center text-[11px] text-ink-soft mt-6 leading-relaxed">
      El scroll avanza este tiempo atrás del audio.<br />
      <strong class="text-ink">Auto</strong> calcula el delay como ⅓ del rango visible.
    </p>
  </AppBottomSheet>
</template>

<script setup>
import { computed } from 'vue'
import AppBottomSheet from './AppBottomSheet.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  modelValue: { type: [Number, String], default: 'auto' },
  autoEffective: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'update:modelValue'])

const options = [
  { value: 'auto', label: 'Auto' },
  { value: 0, label: '0s' },
  { value: 1, label: '1s' },
  { value: 2, label: '2s' },
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
]

const displayValue = computed(() => {
  const v = props.modelValue
  if (v === 'auto') {
    const ae = props.autoEffective
    return ae > 0 ? `Auto (${ae}s)` : 'Auto'
  }
  return Number(v) + 's'
})

function stepUp() {
  const step = 1
  if (props.modelValue === 'auto') {
    const base = props.autoEffective > 0 ? props.autoEffective : 0
    emit('update:modelValue', base + step)
  } else {
    emit('update:modelValue', Number(props.modelValue) + step)
  }
}

function stepDown() {
  const step = 1
  if (props.modelValue === 'auto') {
    const base = props.autoEffective > 0 ? props.autoEffective : 0
    emit('update:modelValue', Math.max(0, base - step))
  } else {
    emit('update:modelValue', Math.max(0, Number(props.modelValue) - step))
  }
}
</script>
