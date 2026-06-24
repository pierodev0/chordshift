<template>
  <Teleport to="body">
    <div
      v-show="visible"
      class="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:min-w-[280px] z-[9999] px-5 py-3.5 rounded-xl shadow-lg animate-fade-in text-center sm:text-left"
      :class="type === 'error' ? 'bg-red-600 text-white' : 'bg-ink text-white'"
    >
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('success')
let timer = null

function showToast(e) {
  message.value = e.detail.message || ''
  type.value = e.detail.type || 'success'
  visible.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { visible.value = false }, 3000)
}

onMounted(() => {
  window.addEventListener('chordshift-toast', showToast)
})

onBeforeUnmount(() => {
  window.removeEventListener('chordshift-toast', showToast)
  if (timer) clearTimeout(timer)
})
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
