<template>
  <div
    class="bg-white rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer active:scale-[0.98]"
    @click="$router.push({ name: 'playlist-detail', params: { id: playlist.id } })"
  >
    <div class="p-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent">
          <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-ink text-sm truncate">{{ playlist.name }}</h3>
        <p class="text-ink-soft text-xs mt-0.5">{{ playlist.songIds.length }} canciones</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-ink-subtle shrink-0">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({ playlist: { type: Object, required: true } })
</script>
