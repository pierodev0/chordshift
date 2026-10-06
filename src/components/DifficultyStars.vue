<template>
  <span
    class="inline-flex items-center gap-0.5"
    role="img"
    :aria-label="'Dificultad ' + value + ' de 10'"
    data-testid="difficulty-stars"
  >
    <svg
      v-for="n in 10"
      :key="n"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      :fill="n <= value ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="1.8"
      :class="n <= value ? 'text-accent' : 'text-ink-subtle'"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" stroke-linejoin="round" />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  value: { type: Number, default: 0 },
  size: { type: Number, default: 14 },
})
</script>
