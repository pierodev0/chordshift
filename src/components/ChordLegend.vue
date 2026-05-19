<template>
  <div v-if="chords.length" class="p-3 bg-white rounded-xl border border-border">
    <p class="text-[10px] font-bold text-ink-soft tracking-widest uppercase mb-2.5">Acordes</p>
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="chord in chords"
        :key="chord"
        class="px-2.5 py-1.5 bg-accent-subtle rounded-md text-accent font-bold text-xs font-mono"
      >
        {{ chord }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({ chords: { type: Array, default: () => [] } })
</script>
