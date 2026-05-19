<template>
  <button
    class="w-9 h-9 rounded-xl hover:bg-accent-subtle transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center shrink-0"
    :class="extraClass"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  extraClass: { type: String, default: '' },
})
</script>
