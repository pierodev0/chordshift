import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/SongList.vue'),
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: () => import('../views/PlaylistList.vue'),
  },
  {
    path: '/playlists/new',
    name: 'playlist-new',
    component: () => import('../views/PlaylistEditor.vue'),
  },
  {
    path: '/playlists/:id',
    name: 'playlist-detail',
    component: () => import('../views/PlaylistDetail.vue'),
  },
  {
    path: '/playlists/:id/edit',
    name: 'playlist-edit',
    component: () => import('../views/PlaylistEditor.vue'),
  },
  {
    path: '/song/new',
    name: 'song-new',
    component: () => import('../views/SongEditor.vue'),
  },
  {
    path: '/song/:id',
    name: 'song-detail',
    component: () => import('../views/SongDetail.vue'),
  },
  {
    path: '/song/:id/edit',
    name: 'song-edit',
    component: () => import('../views/SongEditor.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
