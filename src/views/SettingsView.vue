<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center justify-between px-4 py-3.5 border-b border-border bg-white/80 backdrop-blur-sm shrink-0">
      <h1 class="text-lg font-bold text-ink tracking-tight">Ajustes</h1>
    </header>

    <div class="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-8">
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
          <button
            v-if="user"
            class="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink text-left cursor-pointer border-none transition-colors hover:bg-surface active:scale-[0.99]"
            @click="saveCloudBackup"
          >
            <span class="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="block">Guardar copia en la nube</span>
              <span class="block text-[11px] text-ink-subtle font-normal mt-0.5">Crea un respaldo manual en tu cuenta</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-ink-subtle shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-[11px] font-bold text-ink-soft uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Sincronización en la nube
        </h2>
        <div class="bg-white rounded-2xl border border-border overflow-hidden">
          <template v-if="user">
            <div class="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <span class="w-8 h-8 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-bold shrink-0">
                {{ user.email?.charAt(0).toUpperCase() || '?' }}
              </span>
              <div class="flex-1 min-w-0">
                <span class="block text-sm font-medium text-ink truncate">{{ user.email }}</span>
                <span class="flex items-center gap-1 text-[11px]" :class="syncStatus === 'syncing' ? 'text-amber-500' : 'text-green-600'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'" />
                  {{ syncStatus === 'syncing' ? 'Sincronizando...' : 'Conectado' }}
                </span>
              </div>
              <button
                class="text-xs font-semibold text-red-500 border border-red-200 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-red-50 transition-colors"
                @click="logout"
              >Cerrar sesión</button>
            </div>
            <button
              class="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink text-left cursor-pointer border-none transition-colors hover:bg-surface active:scale-[0.99] border-b border-border"
              @click="syncNow"
            >
              <span class="w-8 h-8 rounded-xl bg-accent-subtle text-accent flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </span>
              <div class="flex-1 min-w-0">
                <span class="block">Sincronizar ahora</span>
                <span class="block text-[11px] text-ink-subtle font-normal mt-0.5">
                  Última sincronización: {{ lastSyncLabel }}
                </span>
              </div>
            </button>
            <label class="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none">
              <div class="w-10 h-6 rounded-full transition-colors relative shrink-0" :class="autoSync ? 'bg-accent' : 'bg-border'" @click="toggleAutoSync">
                <div class="w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all" :class="autoSync ? 'left-5' : 'left-1'" />
              </div>
              <div class="flex-1 min-w-0">
                <span class="block text-sm font-medium text-ink">Sincronización automática</span>
                <span class="block text-[11px] text-ink-subtle font-normal mt-0.5">Sincroniza cambios automáticamente al editar</span>
              </div>
            </label>
          </template>
          <button
            v-else
            class="w-full flex items-center gap-3 px-4 py-4 text-sm font-medium text-ink text-left cursor-pointer border-none transition-colors hover:bg-surface active:scale-[0.99]"
            @click="login"
          >
            <span class="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M21.2 8H2.8M21.2 16H2.8M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="block font-semibold">Iniciar sesión con Google</span>
              <span class="block text-[12px] text-ink-subtle font-normal mt-0.5">Activa la sincronización en la nube</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-ink-subtle shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </section>

      <section v-if="user">
        <h2 class="text-[11px] font-bold text-ink-soft uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          Copias en la nube
        </h2>
        <div class="bg-white rounded-2xl border border-border overflow-hidden">
          <div v-if="backups.length === 0" class="px-4 py-6 text-center text-sm text-ink-subtle">
            No hay copias guardadas
          </div>
          <div v-else class="divide-y divide-border">
            <div v-for="b in backups" :key="b.id" class="flex items-center gap-3 px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-ink-subtle shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div class="flex-1 min-w-0">
                <span class="block text-sm text-ink truncate">{{ b.label }}</span>
                <span class="block text-[11px] text-ink-subtle">{{ formatBackupDate(b.createdAt) }}</span>
              </div>
              <button class="text-xs font-semibold text-accent px-2.5 py-1 rounded-lg cursor-pointer hover:bg-accent-subtle transition-colors" @click="restoreBackup(b.id)">Restaurar</button>
              <button class="text-xs font-semibold text-red-400 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-red-50 transition-colors" @click="removeBackup(b.id)">Eliminar</button>
            </div>
          </div>
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

    <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleImport" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { usePlaylistsStore } from '../stores/playlistsStore'
import { useAudioCache } from '../composables/useAudioCache'
import { user, loginGoogle, logoutGoogle } from '../firebase/auth.js'
import { syncNow as doSyncNow, getSyncMeta, setAutoSync, saveBackup, listBackups, loadBackup, deleteBackup } from '../firebase/sync.js'
const router = useRouter()
const songsStore = useSongsStore()
const playlistsStore = usePlaylistsStore()
const { clearAll: clearAudio } = useAudioCache()
const fileInput = ref(null)
const backups = ref([])
const syncStatus = ref('idle')

const autoSync = ref(getSyncMeta().autoSync !== false)
const lastSyncLabel = computed(() => {
  const t = getSyncMeta().lastSyncAt
  if (!t) return 'Nunca'
  const d = new Date(t)
  return d.toLocaleString()
})

const BACKUP_VERSION = 1

async function login() {
  try {
    await loginGoogle()
  } catch (err) {
    console.error('Login error:', err)
    window.dispatchEvent(new CustomEvent('chordshift-toast', {
      detail: {
        message: err.code === 'auth/unauthorized-domain'
          ? 'Dominio no autorizado. Agregalo en Firebase Console > Authentication > Settings.'
          : 'Error al iniciar sesión: ' + (err.message || err),
        type: 'error',
      },
    }))
  }
}

async function logout() {
  await logoutGoogle()
}

async function fetchBackups() {
  try {
    backups.value = await listBackups()
  } catch {
    backups.value = []
  }
}

async function saveCloudBackup() {
  if (!user.value) return
  try {
    await saveBackup()
    await fetchBackups()
  } catch {
    window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Error al guardar la copia', type: 'error' } }))
  }
}

async function restoreBackup(id) {
  if (!confirm('¿Restaurar esta copia? Todos los datos actuales serán sobrescritos.')) return
  try {
    const data = await loadBackup(id)
    if (!data) return
    if (data.songs) songsStore.importAll(data.songs)
    if (data.playlists) playlistsStore.replaceAll(data.playlists)
    window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Copia restaurada correctamente', type: 'success' } }))
  } catch {
    window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Error al restaurar la copia', type: 'error' } }))
  }
}

async function removeBackup(id) {
  if (!confirm('¿Eliminar esta copia?')) return
  try {
    await deleteBackup(id)
    backups.value = backups.value.filter((b) => b.id !== id)
  } catch {
    window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Error al eliminar la copia', type: 'error' } }))
  }
}

function toggleAutoSync() {
  const next = !autoSync.value
  autoSync.value = next
  setAutoSync(next)
}

function syncNow() {
  doSyncNow().catch(() => {})
}

function formatBackupDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString()
}

function exportBackup() {
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
      window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Versión de copia no compatible', type: 'error' } }))
      return
    }
    if (!Array.isArray(data.songs) || !Array.isArray(data.playlists)) {
      window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Copia de seguridad inválida', type: 'error' } }))
      return
    }
    if (!confirm('¿Restaurar copia? Todos los datos actuales serán sobrescritos.')) return
    songsStore.importAll(data.songs)
    playlistsStore.replaceAll(data.playlists)
    window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Copia restaurada correctamente', type: 'success' } }))
  } catch {
    window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Error al leer el archivo de copia', type: 'error' } }))
  }
}

async function deleteAllData() {
  if (!confirm('¿Borrar todos los datos? Esta acción no se puede deshacer.')) return
  if (!confirm('¿Estás seguro? Se eliminarán todas las canciones, listas y datos de audio.')) return
  clearAudio()
  songsStore.clearAll()
  playlistsStore.clearAll()
  window.dispatchEvent(new CustomEvent('chordshift-toast', { detail: { message: 'Todos los datos han sido eliminados', type: 'success' } }))
  router.push('/')
}

function onSyncEvent(e) {
  syncStatus.value = e.detail.status
}

watch(user, (u) => {
  if (u) fetchBackups()
}, { immediate: true })

onMounted(() => {
  window.addEventListener('chordshift-sync', onSyncEvent)
})

onBeforeUnmount(() => {
  window.removeEventListener('chordshift-sync', onSyncEvent)
})
</script>
