<template>
  <div>
    <span
      v-if="label"
      class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block"
    >
      {{ label }}
    </span>
    <div class="flex items-center gap-1 p-3 rounded-xl border border-border bg-white">
      <button
        v-for="n in 10"
        :key="n"
        type="button"
        class="p-0.5 border-none bg-transparent cursor-pointer transition-transform active:scale-90"
        :class="n <= modelValue ? 'text-accent' : 'text-ink-subtle'"
        :aria-label="'Dificultad ' + n + ' de 10'"
        :aria-pressed="n === modelValue"
        data-testid="difficulty-star"
        @click="pick(n)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" :fill="n <= modelValue ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" stroke-linejoin="round" />
        </svg>
      </button>
      <span v-if="modelValue > 0" class="ml-auto text-xs font-bold text-ink-soft tabular-nums shrink-0">
        {{ modelValue }}/10
      </span>
      <span v-else class="ml-auto text-xs text-ink-subtle shrink-0">
        Sin definir
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

function pick(n) {
  emit('update:modelValue', n === props.modelValue ? 0 : n)
}
</script>
