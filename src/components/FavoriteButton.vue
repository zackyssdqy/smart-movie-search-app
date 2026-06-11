<template>
  <button
    type="button"
    :class="buttonClass"
    :aria-label="ariaLabel"
    :title="ariaLabel"
    @click="$emit('click', $event)"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
      aria-hidden="true"
    >
      <path
        v-if="active"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z"
      />
      <path
        v-else
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.49l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'

defineEmits(['click'])

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const buttonClass = computed(() => {
  return [
    'inline-flex items-center justify-center rounded-full transition',
    props.compact ? 'h-9 w-9' : 'h-10 w-10',
    props.active
      ? 'bg-rose-500 text-white hover:bg-rose-400'
      : 'bg-slate-950/90 text-white ring-1 ring-white/10 hover:bg-slate-800',
  ].join(' ')
})
</script>
