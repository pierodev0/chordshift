<template>
  <div class="flex items-center gap-2 p-2 bg-surface rounded-xl border border-border shadow-sm">
    <button
      class="flex-1 sm:flex-none px-3 py-2.5 rounded-lg font-semibold cursor-pointer border border-border transition-all duration-200 flex items-center justify-center gap-1 bg-white hover:bg-accent-subtle hover:border-accent hover:text-accent active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none text-sm"
      @click="$emit('transpose', -1)"
      aria-label="Bajar semitono"
    >
      <svg height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M5 12h14" />
      </svg>
    </button>
    <div class="px-2 py-2 bg-accent-subtle text-accent rounded-lg font-bold text-center text-xs sm:text-sm min-w-0 flex-1 truncate">
      {{ keyText }}
    </div>
    <button
      class="flex-1 sm:flex-none px-3 py-2.5 rounded-lg font-semibold cursor-pointer border border-border transition-all duration-200 flex items-center justify-center gap-1 bg-white hover:bg-accent-subtle hover:border-accent hover:text-accent active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none text-sm"
      @click="$emit('transpose', 1)"
      aria-label="Subir semitono"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({ keyText: { type: String, default: 'Tono Original' } })
defineEmits(['transpose'])
</script>
