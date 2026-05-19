<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* Hallmark · genre: playful · macrostructure: Mobile Songbook · theme: Plume
 * enrichment: none · pre-emit critique: P5 H5 E5 S4 R5 V5 */
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
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
