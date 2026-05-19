<template>
  <div class="flex items-center border-t border-border bg-white/95 backdrop-blur-sm px-2 shrink-0 relative z-10">
    <router-link
      to="/"
      class="flex-1 flex flex-col items-center py-2 transition-colors no-underline"
      :class="activeTab === 'songs' ? 'text-accent' : 'text-ink-subtle'"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
      <span class="text-[10px] mt-0.5 font-semibold">Canciones</span>
    </router-link>
    <router-link
      to="/playlists"
      class="flex-1 flex flex-col items-center py-2 transition-colors no-underline"
      :class="activeTab === 'playlists' ? 'text-accent' : 'text-ink-subtle'"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
      <span class="text-[10px] mt-0.5 font-semibold">Listas</span>
    </router-link>
  </div>
</template>

<script setup>
defineProps({ activeTab: { type: String, required: true } })
</script>
