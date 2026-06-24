import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './config.js'
import { user } from './auth.js'
import { getDeviceId } from './device.js'
import { mergeState } from './merge.js'
import { exportSyncState, importSyncState } from './serializer.js'

const SYNC_KEY = 'chordshift-cloud-sync'
const SCHEMA_VERSION = 1
let _syncTimer = null
let _listenerUnsub = null
let _initialSyncDone = false

export function getSyncMeta() {
  try {
    return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}
  } catch {
    return {}
  }
}

function setSyncMeta(meta) {
  localStorage.setItem(SYNC_KEY, JSON.stringify(meta))
}

function getStateDocRef(uid) {
  return doc(db, 'users', uid, 'app', 'state')
}

export async function uploadState() {
  const u = user.value
  if (!u) return

  const data = exportSyncState(
    (await import('../stores/songsStore.js')).useSongsStore(),
    (await import('../stores/playlistsStore.js')).usePlaylistsStore(),
  )

  await setDoc(getStateDocRef(u.uid), {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: serverTimestamp(),
    _localUpdatedAt: Date.now(),
    deviceId: getDeviceId(),
    data,
  })

  setSyncMeta({
    lastSyncAt: Date.now(),
    lastSyncUid: u.uid,
    _syncedAt: Date.now(),
  })

  dispatchSyncEvent('synced')
}

export async function downloadAndMergeState() {
  const u = user.value
  if (!u) return { changed: false }

  const snap = await getDoc(getStateDocRef(u.uid))
  const cloudData = snap.data()
  const localData = getSyncMeta()

  const { changed, data } = mergeState(localData, cloudData)
  if (!changed || !data) return { changed: false }

  const imported = importSyncState(data)
  return { changed: true, ...imported }
}

let _scheduleTimer = null
let _autoSyncEnabled = null

function isAutoSyncEnabled() {
  if (_autoSyncEnabled === null) {
    const meta = getSyncMeta()
    _autoSyncEnabled = meta.autoSync !== false
  }
  return _autoSyncEnabled
}

export function setAutoSync(enabled) {
  _autoSyncEnabled = enabled
  const meta = getSyncMeta()
  meta.autoSync = enabled
  setSyncMeta(meta)
}

export function scheduleCloudSync() {
  if (!user.value || !isAutoSyncEnabled()) return

  if (_scheduleTimer) clearTimeout(_scheduleTimer)
  _scheduleTimer = setTimeout(() => {
    _scheduleTimer = null
    dispatchSyncEvent('syncing')
    uploadState().catch(() => {})
  }, 2000)
}

export async function syncNow() {
  if (!user.value) return
  dispatchSyncEvent('syncing')
  await uploadState()
}

export function startSyncListener(callback) {
  if (_listenerUnsub) {
    _listenerUnsub()
    _listenerUnsub = null
  }

  const u = user.value
  if (!u) return

  _initialSyncDone = false

  _listenerUnsub = onSnapshot(getStateDocRef(u.uid), (snap) => {
    if (!_initialSyncDone) {
      _initialSyncDone = true
      return
    }

    const cloudData = snap.data()
    if (!cloudData) return

    if (cloudData.deviceId === getDeviceId()) return

    const meta = getSyncMeta()
    const localTime = meta._syncedAt || 0
    const cloudTime =
      cloudData.updatedAt?.toMillis?.() || cloudData.updatedAt || 0

    if (cloudTime > localTime) {
      const imported = importSyncState(cloudData.data || {})
      callback(imported)
    }
  })
}

export function stopSyncListener() {
  if (_listenerUnsub) {
    _listenerUnsub()
    _listenerUnsub = null
  }
  _initialSyncDone = false
}

export async function saveBackup(label) {
  const u = user.value
  if (!u) return

  const data = exportSyncState(
    (await import('../stores/songsStore.js')).useSongsStore(),
    (await import('../stores/playlistsStore.js')).usePlaylistsStore(),
  )

  const backupsRef = collection(db, 'users', u.uid, 'backups')
  await addDoc(backupsRef, {
    createdAt: serverTimestamp(),
    label: label || `Copia ${new Date().toLocaleDateString()}`,
    data,
  })
}

export async function listBackups() {
  const u = user.value
  if (!u) return []

  const backupsRef = collection(db, 'users', u.uid, 'backups')
  const q = query(backupsRef, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function loadBackup(backupId) {
  const u = user.value
  if (!u) return null

  const ref = doc(db, 'users', u.uid, 'backups', backupId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data()
  return importSyncState(data.data || {})
}

export async function deleteBackup(backupId) {
  const u = user.value
  if (!u) return

  const ref = doc(db, 'users', u.uid, 'backups', backupId)
  await deleteDoc(ref)
}

function dispatchSyncEvent(status) {
  window.dispatchEvent(new CustomEvent('chordshift-sync', { detail: { status } }))
}
