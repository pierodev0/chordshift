<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader :title="isEdit ? 'Editar canción' : 'Nueva canción'" @back="goBack" />

    <div class="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
      <AppInput
        v-model="title"
        label="Título"
        placeholder="Título de la canción"
      />
      <AppInput
        v-model="artist"
        label="Artista"
        placeholder="Nombre del artista"
      />

      <div class="flex-1 flex flex-col min-h-0">
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Letra y acordes</label>
        <textarea
          v-model="content"
          spellcheck="false"
          class="flex-1 min-h-[200px] w-full p-4 rounded-xl border border-border bg-white font-mono text-sm text-ink outline-none resize-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-ink-subtle"
          placeholder="Pegá la letra con acordes. Ejemplo:
Fmaj7          Cadd9
Tanto tiempo disfrutamos..."
        />
      </div>
    </div>

    <div class="px-4 py-3 border-t border-border bg-white shrink-0">
      <AppButton
        full
        size="lg"
        shadow
        :disabled="!title.trim()"
        @click="save"
      >
        Guardar
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import AppPageHeader from '../components/AppPageHeader.vue'
import AppInput from '../components/AppInput.vue'
import AppButton from '../components/AppButton.vue'

const route = useRoute()
const router = useRouter()
const store = useSongsStore()

const isEdit = computed(() => route.name === 'song-edit')
const existing = computed(() => (isEdit.value ? store.getById(route.params.id) : null))

const title = ref('')
const artist = ref('')
const content = ref('')

function goBack() {
  if (isEdit.value) {
    router.push({ name: 'song-detail', params: { id: route.params.id } })
  } else {
    router.push({ name: 'home' })
  }
}

function save() {
  if (!title.value.trim()) return

  if (isEdit.value) {
    store.update(route.params.id, {
      title: title.value,
      artist: artist.value,
      content: content.value,
    })
    router.push({ name: 'song-detail', params: { id: route.params.id } })
  } else {
    const song = store.create({
      title: title.value,
      artist: artist.value,
      content: content.value,
    })
    router.push({ name: 'song-detail', params: { id: song.id } })
  }
}

onMounted(() => {
  if (!store.loaded) store.load()
  if (existing.value) {
    title.value = existing.value.title
    artist.value = existing.value.artist
    content.value = existing.value.content
  }
})
</script>
