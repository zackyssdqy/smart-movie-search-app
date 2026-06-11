<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <div class="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold md:text-4xl">My Favorites</h1>
        <p class="mt-2 text-slate-400">
          Movies you saved will stay here even after refresh.
        </p>
      </div>

      <RouterLink to="/" class="text-sm text-blue-400 hover:underline">
        Back to search
      </RouterLink>
    </div>

    <EmptyState
      v-if="favorites.length === 0"
      message="You have not saved any movies yet."
    />

    <section v-else>
      <p class="mb-4 text-sm text-slate-400">
        {{ favorites.length }} movie{{ favorites.length === 1 ? '' : 's' }} saved
      </p>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MovieCard v-for="movie in favorites" :key="movie.imdbID" :movie="movie" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import MovieCard from '@/components/MovieCard.vue'
import EmptyState from '@/components/states/EmptyState.vue'
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()
const { favorites } = storeToRefs(favoritesStore)
</script>
