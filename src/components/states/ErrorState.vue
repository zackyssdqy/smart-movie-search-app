<template>
  <section class="rounded-xl bg-red-950 p-6 text-red-200">
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
