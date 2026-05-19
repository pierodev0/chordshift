<template>
  <div v-if="show" class="fixed inset-0 z-50" @click="$emit('close')">
    <div class="absolute inset-0 bg-ink/40 sheet-bg" />
    <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] flex flex-col sheet-panel" @click.stop>
      <div class="w-8 h-1 rounded-full bg-border mx-auto mt-3 mb-1" />

      <div class="flex items-center justify-between px-5 py-2">
        <p class="text-xs font-bold text-ink-soft tracking-widest uppercase">Secciones</p>
        <button
          class="text-xs font-semibold text-accent cursor-pointer bg-transparent border-none hover:text-accent-hover transition-colors"
          @click="$emit('toggleAll', allVisible)"
        >
          {{ allVisible ? 'Ocultar todas' : 'Seleccionar todas' }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 pb-4">
        <div
          v-for="sec in sections"
          :key="sec.id"
          class="flex items-center gap-3 py-2.5 border-b border-border-light last:border-none"
        >
          <input
            type="checkbox"
            :checked="visibility[sec.id] !== false"
            @change="$emit('toggle', sec.id)"
            class="w-4 h-4 rounded accent-accent shrink-0"
          />
          <label class="flex-1 min-w-0 cursor-pointer text-sm" @click="$emit('toggle', sec.id)">
            <span class="font-semibold text-ink">{{ sec.label }}</span>
            <span class="text-ink-subtle ml-1.5">{{ sec.count }} líneas</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  sections: { type: Array, default: () => [] },
  visibility: { type: Object, default: () => ({}) },
})
defineEmits(['close', 'toggle', 'toggleAll'])

const allVisible = computed(() =>
  props.sections.length > 0 && props.sections.every((s) => props.visibility[s.id] !== false),
)
</script>

<style scoped>
.sheet-bg {
  animation: sheetFadeIn 0.2s ease;
}
.sheet-panel {
  animation: sheetSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes sheetFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sheetSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
