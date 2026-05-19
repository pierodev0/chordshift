<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer border-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed',
      variant === 'primary'
        ? 'bg-accent text-white hover:bg-accent-hover active:scale-[0.98]'
        : 'bg-white text-ink border border-border hover:bg-accent-subtle hover:border-accent hover:text-accent active:scale-95',
      size === 'lg' ? 'py-3.5 px-6 rounded-xl' : 'py-2.5 px-4 rounded-lg',
      full ? 'w-full' : '',
      shadow ? 'shadow-lg shadow-accent/25' : '',
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  full: Boolean,
  disabled: Boolean,
  shadow: Boolean,
})
</script>
