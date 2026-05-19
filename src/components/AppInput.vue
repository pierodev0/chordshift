<template>
  <div>
    <label
      v-if="label"
      class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block"
    >
      {{ label }}
    </label>
    <div v-if="$slots.icon" class="relative">
      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none">
        <slot name="icon" />
      </span>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        class="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-white text-sm text-ink outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-ink-subtle"
        v-bind="$attrs"
      />
    </div>
    <input
      v-else
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :placeholder="placeholder"
      class="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-ink outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-ink-subtle"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
})
defineEmits(['update:modelValue'])
</script>
