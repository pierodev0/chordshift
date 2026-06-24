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
    <router-link
      to="/settings"
      class="flex-1 flex flex-col items-center py-2 transition-colors no-underline"
      :class="activeTab === 'settings' ? 'text-accent' : 'text-ink-subtle'"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
      <span class="text-[10px] mt-0.5 font-semibold">Ajustes</span>
    </router-link>
  </div>
</template>

<script setup>
defineProps({ activeTab: { type: String, required: true } })
</script>
