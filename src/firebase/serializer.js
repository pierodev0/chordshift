export function exportSyncState(songsStore, playlistsStore) {
  return {
    songs: songsStore.exportAll(),
    playlists: playlistsStore.exportAll(),
  }
}

export function importSyncState(data) {
  return {
    songs: data.songs || [],
    playlists: data.playlists || [],
  }
}
