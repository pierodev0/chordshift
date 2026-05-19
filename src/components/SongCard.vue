<template>
  <div
    class="bg-white rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer active:scale-[0.98]"
    @click="$router.push({ name: 'song-detail', params: { id: song.id } })"
  >
    <div :class="coverColor" class="h-14 flex items-center justify-center">
      <span class="text-2xl font-bold text-white/90 select-none">{{ initial }}</span>
    </div>
    <div class="p-3.5">
      <h3 class="font-semibold text-ink text-sm truncate">{{ song.title }}</h3>
      <p v-if="song.artist" class="text-ink-soft text-xs mt-0.5">{{ song.artist }}</p>
      <p class="text-ink-subtle text-xs mt-1.5 font-mono truncate leading-relaxed">
        {{ preview }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ song: { type: Object, required: true } })

const initial = computed(() => (props.song.title || '?')[0].toUpperCase())

const coverColor = computed(() => {
  const c = initial.value
  if (c <= 'B') return 'bg-cover-1'
  if (c <= 'D') return 'bg-cover-2'
  if (c <= 'L') return 'bg-cover-3'
  return 'bg-cover-4'
})

const preview = computed(() => {
  const firstLine = props.song.content.split('\n').find((l) => l.trim().length > 5)
  return firstLine ? firstLine.trim().slice(0, 60) : 'Sin contenido'
})
</script>
