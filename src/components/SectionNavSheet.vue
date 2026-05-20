<template>
  <AppBottomSheet :show="show" panelClass="px-5 pb-4 max-h-[70vh] flex flex-col" @close="$emit('close')">
    <template #title>
      <div class="flex items-center justify-between px-5 py-2 -mx-5">
        <p class="text-xs font-bold text-ink-soft tracking-widest uppercase">Secciones</p>
        <button
          class="text-xs font-semibold text-accent cursor-pointer bg-transparent border-none hover:text-accent-hover transition-colors"
          @click="$emit('toggleAll', allVisible)"
        >
          {{ allVisible ? 'Ocultar todas' : 'Seleccionar todas' }}
        </button>
      </div>
    </template>

    <div class="flex-1 overflow-y-auto">
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
  </AppBottomSheet>
</template>

<script setup>
import { computed } from 'vue'
import AppBottomSheet from './AppBottomSheet.vue'

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
