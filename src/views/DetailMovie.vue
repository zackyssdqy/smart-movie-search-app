<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <RouterLink to="/" class="text-sm text-blue-400 hover:underline">
      ← Back to search
    </RouterLink>

    <h1 class="mt-6 text-3xl font-bold">
      Movie Detail Page
    </h1>

    <p class="mt-2 text-slate-400">
      Movie ID: {{ route.params.id }}
    </p>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
