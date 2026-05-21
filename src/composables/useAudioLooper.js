import { ref, computed } from "vue";

import { uuid } from "../utils/uuid";
export function useAudioLooper() {
  const markers = ref([]);
  const loops = ref([]);
  const loopEnabled = ref(false);
  const snapEnabled = ref(false);
  const activeFrom = ref("");
  const activeTo = ref("");
  const snapToBeatFn = ref(null);

  function addMarker(time) {
    const label = String.fromCharCode(65 + markers.value.length);
    const marker = {       id: uuid(), label, time };
    markers.value.push(marker);
    return marker;
  }

  function removeMarker(id) {
    markers.value = markers.value.filter((m) => m.id !== id);
    if (activeFrom.value === id) activeFrom.value = "";
    if (activeTo.value === id) activeTo.value = "";
    loops.value = loops.value.filter((l) => l.from !== id && l.to !== id);
  }

  function updateMarkerTime(id, time) {
    const m = markers.value.find((m) => m.id === id);
    if (m) m.time = time;
  }

  function setActiveFrom(id) {
    activeFrom.value = id;
  }

  function setActiveTo(id) {
    activeTo.value = id;
  }

  function setCurrentAsFrom(currentTime) {
    const snapFn = snapEnabled.value ? snapToBeatFn.value : null;
    const time = snapFn ? snapFn(currentTime) : currentTime;
    activeFrom.value = addMarker(time).id;
  }

  function setCurrentAsTo(currentTime) {
    const snapFn = snapEnabled.value ? snapToBeatFn.value : null;
    const time = snapFn ? snapFn(currentTime) : currentTime;
    activeTo.value = addMarker(time).id;
  }

  const activeLoop = computed(() => {
    const from = markers.value.find((m) => m.id === activeFrom.value);
    const to = markers.value.find((m) => m.id === activeTo.value);
    if (!from || !to || from.time >= to.time) return null;
    return { from: from.time, to: to.time, fromId: from.id, toId: to.id };
  });

  function saveLoop(name) {
    if (!activeLoop.value) return null;
    const loop = {
      id: uuid(),
      name,
      from: activeFrom.value,
      to: activeTo.value,
    };
    loops.value.push(loop);
    return loop;
  }

  function removeLoop(id) {
    loops.value = loops.value.filter((l) => l.id !== id);
  }

  function clearAll() {
    markers.value = [];
    loops.value = [];
    loopEnabled.value = false;
    activeFrom.value = "";
    activeTo.value = "";
  }

  return {
    markers,
    loops,
    loopEnabled,
    snapEnabled,
    activeFrom,
    activeTo,
    activeLoop,
    snapToBeatFn,
    addMarker,
    removeMarker,
    updateMarkerTime,
    setActiveFrom,
    setActiveTo,
    setCurrentAsFrom,
    setCurrentAsTo,
    saveLoop,
    removeLoop,
    clearAll,
  };
}
