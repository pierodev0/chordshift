<template>
    <div class="px-4 py-2.5 bg-white border-b border-border shrink-0">
        <div
            ref="playerContainer"
            class="w-full aspect-video rounded-xl overflow-hidden border border-border max-w-lg"
            :id="containerId"
        />
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useYoutubePlayer } from "../composables/useYoutubePlayer";

const props = defineProps({
    videoId: { type: String, default: "" },
    autoScrolling: Boolean,
    totalLines: { type: Number, default: 0 },
});

const emit = defineEmits(["timeupdate", "play", "pause", "ready"]);

const containerId = "yt-player-" + Math.random().toString(36).slice(2, 8);
const playerContainer = ref(null);

const { initPlayer, cueVideo, destroy } = useYoutubePlayer();

onMounted(() => {
    initPlayer(containerId, props.videoId, {
        onReady() {
            emit("ready");
        },
        onStateChange(state) {
            if (state === YT.PlayerState.PLAYING) emit("play");
            if (state === YT.PlayerState.PAUSED) emit("pause");
        },
        onTimeUpdate(currentTime, duration) {
            emit("timeupdate", currentTime, duration);
        },
        onError() {
            // YT error — silent
        },
    });
});

watch(
    () => props.videoId,
    (id) => {
        if (id) cueVideo(id);
    },
);

onBeforeUnmount(() => {
    destroy();
});
</script>
