<template>
  <section class="rounded-xl bg-slate-900 p-6 text-slate-300">
    {{ message }}
  </section>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>
