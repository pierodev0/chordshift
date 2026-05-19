<template>
  <header class="flex items-center gap-3 px-4 py-3.5 bg-white/80 backdrop-blur-sm border-b border-border shrink-0">
    <button
      v-if="showBack"
      class="w-9 h-9 rounded-xl hover:bg-accent-subtle transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center -ml-1"
      @click="$emit('back')"
      aria-label="Volver"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-ink">
        <path d="M19 12H5m7 7-7-7 7-7" />
      </svg>
    </button>
    <div class="flex-1 min-w-0">
      <slot name="title">
        <h1 v-if="title" class="text-sm font-semibold text-ink truncate">{{ title }}</h1>
      </slot>
    </div>
    <slot name="actions" />
  </header>
</template>

<script setup>
defineProps({
  showBack: { type: Boolean, default: true },
  title: String,
})
defineEmits(['back'])
</script>
