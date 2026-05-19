<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader
      title="Nueva lista"
      @back="router.push({ name: 'playlists' })"
    />

    <div class="flex-1 overflow-y-auto px-4 py-5">
      <AppInput v-model="name" label="Nombre" placeholder="Ej: Rock classics, Acústicas..." />
    </div>

    <div class="px-4 py-3 border-t border-border bg-white shrink-0">
      <AppButton full size="lg" shadow :disabled="!name.trim()" @click="save">
        Crear lista
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaylistsStore } from '../stores/playlistsStore'
import AppPageHeader from '../components/AppPageHeader.vue'
import AppInput from '../components/AppInput.vue'
import AppButton from '../components/AppButton.vue'

const router = useRouter()
const store = usePlaylistsStore()
const name = ref('')

function save() {
  if (!name.value.trim()) return
  const pl = store.create({ name: name.value.trim() })
  router.push({ name: 'playlist-detail', params: { id: pl.id } })
}
</script>
