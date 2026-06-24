<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center justify-between px-4 py-3.5 border-b border-border bg-white/80 backdrop-blur-sm shrink-0">
      <h1 class="text-lg font-bold text-ink tracking-tight">Ajustes</h1>
    </header>

    <div class="flex-1 overflow-y-auto px-4 py-6 space-y-8">
      <section>
        <h2 class="text-[11px] font-bold text-ink-soft uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Copia de seguridad
        </h2>
        <div class="bg-white rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <button class="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink text-left cursor-pointer border-none transition-colors hover:bg-surface active:scale-[0.99]" @click="exportBackup">
            <span class="w-8 h-8 rounded-xl bg-accent-subtle text-accent flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="block">Exportar copia</span>
              <span class="block text-[11px] text-ink-subtle font-normal mt-0.5">Descarga todas las canciones y listas</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-ink-subtle shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink text-left cursor-pointer border-none transition-colors hover:bg-surface active:scale-[0.99]" @click="triggerImport">
            <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 10 12 15 7 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="block">Restaurar copia</span>
              <span class="block text-[11px] text-ink-subtle font-normal mt-0.5">Sobreescribe todos los datos actuales</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-ink-subtle shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button disabled class="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink-subtle text-left cursor-not-allowed border-none opacity-50">
            <span class="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="block">Copia en la nube</span>
              <span class="block text-[11px] text-ink-subtle font-normal mt-0.5">Guardar y restaurar</span>
            </div>
            <span class="text-[10px] font-semibold text-ink-subtle bg-surface px-2 py-0.5 rounded-md">Pronto</span>
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-[11px] font-bold text-ink-soft uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Sincronización en la nube
        </h2>
        <div class="bg-white rounded-2xl border border-border overflow-hidden">
          <button disabled class="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink-subtle text-left cursor-not-allowed border-none opacity-50">
            <span class="w-8 h-8 rounded-xl bg-surface text-ink-soft flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M21.2 8H2.8M21.2 16H2.8M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="block">Iniciar sesión con Google</span>
              <span class="block text-[11px] text-ink-subtle font-normal mt-0.5">Activa la sincronización en la nube</span>
            </div>
            <span class="text-[10px] font-semibold text-ink-subtle bg-surface px-2 py-0.5 rounded-md">Pronto</span>
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Zona de peligro
        </h2>
        <div class="bg-white rounded-2xl border border-red-200 overflow-hidden">
          <button class="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-600 text-left cursor-pointer border-none transition-colors hover:bg-red-50 active:scale-[0.99]" @click="deleteAllData">
            <span class="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="block">Borrar todos los datos</span>
              <span class="block text-[11px] text-red-400 font-normal mt-0.5">Elimina canciones, listas y datos de la app</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-red-300 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </section>
    </div>

    <TabBar activeTab="settings" />

    <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleImport" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { usePlaylistsStore } from '../stores/playlistsStore'
import { useAudioCache } from '../composables/useAudioCache'
import TabBar from '../components/TabBar.vue'

const router = useRouter()
const songsStore = useSongsStore()
const playlistsStore = usePlaylistsStore()
const { clearAll: clearAudio } = useAudioCache()
const fileInput = ref(null)

const BACKUP_VERSION = 1

function exportBackup() {
  const songsStore = useSongsStore()
  const playlistsStore = usePlaylistsStore()
  const backup = {
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    songs: songsStore.exportAll(),
    playlists: playlistsStore.exportAll(),
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chordshift-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function triggerImport() {
  fileInput.value.click()
}

async function handleImport(e) {
  const file = e.target.files[0]
  if (!file) return
  e.target.value = ''
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    if (data.version !== BACKUP_VERSION) {
      alert('Versión de copia no compatible')
      return
    }
    if (!Array.isArray(data.songs) || !Array.isArray(data.playlists)) {
      alert('Copia de seguridad inválida')
      return
    }
    if (!confirm('¿Restaurar copia? Todos los datos actuales serán sobrescritos.')) return
    songsStore.importAll(data.songs)
    playlistsStore.replaceAll(data.playlists)
    alert('Copia restaurada correctamente')
  } catch {
    alert('Error al leer el archivo de copia')
  }
}

async function deleteAllData() {
  if (!confirm('¿Borrar todos los datos? Esta acción no se puede deshacer.')) return
  if (!confirm('¿Estás seguro? Se eliminarán todas las canciones, listas y datos de audio.')) return
  clearAudio()
  songsStore.clearAll()
  playlistsStore.clearAll()
  alert('Todos los datos han sido eliminados')
  router.push('/')
}
</script>
