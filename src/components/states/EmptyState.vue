<template>
  <section class="rounded-xl bg-slate-900 p-6 text-slate-400">
    <h2 v-if="title" class="text-lg font-semibold text-white">
      {{ title }}
    </h2>

    <p :class="title ? 'mt-2' : ''">
      {{ message }}
    </p>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
})
</script>
