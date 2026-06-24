import { ref, onBeforeUnmount } from 'vue'

let apiLoaded = false
let apiLoading = false
const readyQueue = []

function ensureApiLoaded() {
  if (apiLoaded) return Promise.resolve()
  if (apiLoading) {
    return new Promise((resolve) => readyQueue.push(resolve))
  }
  apiLoading = true
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      apiLoaded = true
      apiLoading = false
      resolve()
      return
    }
    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true
      apiLoading = false
      readyQueue.forEach((fn) => fn())
      readyQueue.length = 0
      resolve()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
}

export function useYoutubePlayer() {
  let player = null
  let pollInterval = null
  const isReady = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)

  async function initPlayer(containerId, videoId, callbacks = {}) {
    await ensureApiLoaded()
    if (player) {
      player.destroy()
      clearInterval(pollInterval)
      pollInterval = null
    }
    const opts = {
      height: '100%',
      width: '100%',
      videoId: videoId || '',
      playerVars: {
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady() {
          isReady.value = true
          if (callbacks.onReady) callbacks.onReady()
          // Poll for time updates
          pollInterval = setInterval(() => {
            if (!player || !player.getCurrentTime) return
            const ct = player.getCurrentTime()
            const dur = player.getDuration()
            currentTime.value = ct
            duration.value = dur
            if (callbacks.onTimeUpdate) callbacks.onTimeUpdate(ct, dur)
          }, 250)
        },
        onStateChange(e) {
          if (callbacks.onStateChange) callbacks.onStateChange(e.data)
          if (e.data === YT.PlayerState.PLAYING && callbacks.onPlay) {
            callbacks.onPlay()
          }
          if (e.data === YT.PlayerState.PAUSED && callbacks.onPause) {
            callbacks.onPause()
          }
        },
        onError(e) {
          if (callbacks.onError) callbacks.onError(e)
        },
      },
    }
    player = new YT.Player(containerId, opts)
  }

  function cueVideo(videoId) {
    if (!player || !player.cueVideoById) return
    player.cueVideoById(videoId)
  }

  function play() {
    if (!player || !player.playVideo) return
    player.playVideo()
  }

  function pause() {
    if (!player || !player.pauseVideo) return
    player.pauseVideo()
  }

  function seek(time) {
    if (!player || !player.seekTo) return
    player.seekTo(time, true)
  }

  function setPlaybackRate(rate) {
    if (!player || !player.setPlaybackRate) return
    player.setPlaybackRate(rate)
  }

  function destroy() {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
    if (player) {
      player.destroy()
      player = null
    }
    isReady.value = false
  }

  onBeforeUnmount(() => {
    destroy()
  })

  return { isReady, currentTime, duration, initPlayer, cueVideo, play, pause, seek, setPlaybackRate, destroy }
}
