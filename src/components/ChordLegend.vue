<template>
  <div v-if="chords.length" class="p-3 bg-accent-subtle rounded-lg border-l-4 border-accent">
    <p class="text-xs font-bold text-ink-soft tracking-wider mb-2">ACORDES</p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="chord in chords"
        :key="chord"
        class="px-2.5 py-1 bg-white rounded-md text-accent font-bold text-sm font-mono shadow-sm"
      >
        {{ chord }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({ chords: { type: Array, default: () => [] } })
</script>
