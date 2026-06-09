<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="text-3xl font-bold">Find Your Favorite Movies</h1>

    <button class="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white" @click="testApi">
      Test API
    </button>
  </main>
</template>

<script setup>
import { searchMovies } from '@/services/api';


const testApi = async () => {
  try {
    const response = await searchMovies('batman', 1)
    console.log(response);

  } catch (error) {
    console.log(error);

  }
}

</script>
