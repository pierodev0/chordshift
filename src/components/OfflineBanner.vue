<template>
  <Transition name="banner">
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 text-ink text-xs font-semibold shadow-md"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      <span>Sin conexión</span>
    </div>
  </Transition>
</template>

<script setup>
import { useOnlineStatus } from '../composables/useOnlineStatus'

const { isOnline } = useOnlineStatus()
</script>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.banner-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.banner-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
