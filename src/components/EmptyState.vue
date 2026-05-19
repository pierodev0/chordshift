<template>
  <div class="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
    <div class="w-24 h-24 rounded-2xl bg-accent-subtle flex items-center justify-center mb-6">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-accent">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
        <path d="M9 5l12-2" stroke-width="1" class="text-accent/40" />
      </svg>
    </div>
    <h2 class="text-lg font-semibold text-ink mb-1.5">Todavía no tenés canciones</h2>
    <p class="text-ink-soft text-sm mb-7 max-w-[260px] leading-relaxed">
      Agregá tu primera canción y empezá a practicar con los acordes transportados al tono que quieras.
    </p>
    <AppButton shadow @click="$router.push({ name: 'song-new' })">
      Agregar canción
    </AppButton>
  </div>
</template>

<script setup>
import AppButton from './AppButton.vue'
</script>
