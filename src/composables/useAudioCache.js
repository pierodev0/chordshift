const DB_NAME = 'chord-audio'
const STORE_NAME = 'files'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function useAudioCache() {
  async function saveAudio(songId, file) {
    const arrayBuffer = await file.arrayBuffer()
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put({ blob: arrayBuffer, name: file.name, type: file.type }, `audio-${songId}`)
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error)
    })
  }

  async function loadAudio(songId) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const result = await new Promise((resolve, reject) => {
      const req = store.get(`audio-${songId}`)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    if (!result) return null
    const blob = new Blob([result.blob], { type: result.type || 'audio/mpeg' })
    return { url: URL.createObjectURL(blob), name: result.name }
  }

  async function loadAudioBlob(songId) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const result = await new Promise((resolve, reject) => {
      const req = store.get(`audio-${songId}`)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    if (!result) return null
    return new Blob([result.blob], { type: result.type || 'audio/mpeg' })
  }

  async function loadAudioBuffer(songId) {
    const blob = await loadAudioBlob(songId)
    if (!blob) return null
    const arrayBuffer = await blob.arrayBuffer()
    const ctx = new AudioContext()
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
    ctx.close()
    return audioBuffer
  }

  async function deleteAudio(songId) {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(`audio-${songId}`)
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error)
    })
  }

  return { saveAudio, loadAudio, loadAudioBlob, loadAudioBuffer, deleteAudio }
}
