<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* Hallmark · genre: playful · theme: custom (Plume+ · Sora + JetBrains Mono)
 * macrostructure: Mobile Songbook (enriched) · enrichment: none
 * pre-emit critique: P5 H5 E5 S5 R5 V5 */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
