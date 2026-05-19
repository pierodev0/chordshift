<template>
  <div class="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-border shadow-sm">
    <button
      class="w-10 h-10 rounded-lg font-semibold cursor-pointer border border-border transition-all duration-200 flex items-center justify-center bg-white hover:bg-accent-subtle hover:border-accent hover:text-accent active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none shrink-0"
      @click="$emit('transpose', -1)"
      aria-label="Bajar semitono"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M5 12h14" />
      </svg>
    </button>
    <div class="h-10 px-3 flex items-center justify-center bg-accent-subtle text-accent rounded-lg font-bold text-xs sm:text-sm flex-1 min-w-0 truncate">
      {{ keyText }}
    </div>
    <button
      class="w-10 h-10 rounded-lg font-semibold cursor-pointer border border-border transition-all duration-200 flex items-center justify-center bg-white hover:bg-accent-subtle hover:border-accent hover:text-accent active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none shrink-0"
      @click="$emit('transpose', 1)"
      aria-label="Subir semitono"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({ keyText: { type: String, default: 'Tono Original' } })
defineEmits(['transpose'])
</script>
