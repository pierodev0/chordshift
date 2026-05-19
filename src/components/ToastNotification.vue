<template>
  <div
    v-show="show"
    class="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:min-w-[280px] bg-ink text-white px-5 py-3.5 rounded-xl shadow-lg animate-fade-in text-center sm:text-left"
  >
    ✅ ¡Copiado! Listo para pegar en Word
  </div>
</template>

<script setup>
defineProps({ show: Boolean })
</script>
