<template>
  <div class="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-border mb-6">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
    <h2 class="text-lg font-semibold text-ink mb-2">Todavía no tenés canciones</h2>
    <p class="text-ink-soft text-sm mb-6 max-w-[260px]">
      Agregá tu primera canción y empezá a practicar con los acordes transportados al tono que quieras.
    </p>
    <button
      class="px-6 py-3 rounded-xl font-semibold bg-accent text-white border-none transition-all duration-200 hover:bg-accent-hover active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer"
      @click="$router.push({ name: 'song-new' })"
    >
      Agregar canción
    </button>
  </div>
</template>

<script setup>
</script>
