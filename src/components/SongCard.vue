<template>
  <div
    class="bg-white rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]"
    @click="$router.push({ name: 'song-detail', params: { id: song.id } })"
  >
    <div class="border-l-4 border-accent h-full">
      <div class="p-4">
        <h3 class="font-semibold text-ink text-base truncate">{{ song.title }}</h3>
        <p v-if="song.artist" class="text-ink-soft text-sm mt-0.5">{{ song.artist }}</p>
        <p class="text-ink-soft/60 text-xs mt-2 font-mono truncate">
          {{ preview }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ song: { type: Object, required: true } })

const preview = computed(() => {
  const firstLine = props.song.content.split('\n').find((l) => l.trim().length > 5)
  return firstLine ? firstLine.trim().slice(0, 60) : 'Sin contenido'
})
</script>
