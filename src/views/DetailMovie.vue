<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <RouterLink to="/" class="text-sm text-blue-400 hover:underline">
      ← Back to search
    </RouterLink>

    <LoadingState class="mt-8" v-if="loading" message="Loading movie detail..." />

    <ErrorState class="mt-8" v-else-if="error" :message="error" />

    <section v-else-if="movie" class="mt-8 grid gap-8 md:grid-cols-[300px_1fr]">
      <div>
        <img :src="getPoster(movie.Poster)" :alt="movie.Title"
          class="w-full rounded-xl bg-slate-900 object-cover shadow-lg" />
      </div>

      <div>
        <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold md:text-4xl">
              {{ movie.Title }}
            </h1>

            <p class="mt-2 text-slate-400">
              {{ movie.Year }} • {{ movie.Runtime }} • {{ movie.Genre }}
            </p>
          </div>

          <FavoriteButton
            :active="isSaved"
            aria-label="Toggle favorite for this movie"
            @click="handleFavoriteClick"
          />
        </div>

        <div class="mb-6 flex flex-wrap gap-3">
          <span class="rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-300">
            IMDb {{ movie.imdbRating }}
          </span>

          <span class="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
            {{ movie.Rated }}
          </span>

          <span class="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-300">
            {{ movie.Type }}
          </span>
        </div>

        <div class="mb-6">
          <h2 class="mb-2 text-xl font-semibold">Plot</h2>
          <p class="leading-7 text-slate-300">
            {{ movie.Plot }}
          </p>
        </div>

        <div class="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
          <div class="rounded-xl bg-slate-900 p-4">
            <p class="text-slate-500">Director</p>
            <p class="mt-1 font-medium text-white">{{ movie.Director }}</p>
          </div>

          <div class="rounded-xl bg-slate-900 p-4">
            <p class="text-slate-500">Writer</p>
            <p class="mt-1 font-medium text-white">{{ movie.Writer }}</p>
          </div>

          <div class="rounded-xl bg-slate-900 p-4 sm:col-span-2">
            <p class="text-slate-500">Actors</p>
            <p class="mt-1 font-medium text-white">{{ movie.Actors }}</p>
          </div>

          <div class="rounded-xl bg-slate-900 p-4">
            <p class="text-slate-500">Released</p>
            <p class="mt-1 font-medium text-white">{{ movie.Released }}</p>
          </div>

          <div class="rounded-xl bg-slate-900 p-4">
            <p class="text-slate-500">Country</p>
            <p class="mt-1 font-medium text-white">{{ movie.Country }}</p>
          </div>
        </div>

        <div v-if="movie.Ratings?.length" class="mt-6">
          <h2 class="mb-3 text-xl font-semibold">Ratings</h2>

          <div class="grid gap-3 sm:grid-cols-3">
            <div v-for="rating in movie.Ratings" :key="rating.Source" class="rounded-xl bg-slate-900 p-4">
              <p class="text-sm text-slate-500">{{ rating.Source }}</p>
              <p class="mt-1 text-lg font-semibold text-white">
                {{ rating.Value }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMovieDetail } from '@/services/api'
import FavoriteButton from '@/components/FavoriteButton.vue'
import ErrorState from '@/components/states/ErrorState.vue'
import LoadingState from '@/components/states/LoadingState.vue'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const favoritesStore = useFavoritesStore()

const movie = ref(null)
const loading = ref(false)
const error = ref('')

const isSaved = computed(() => {
  return movie.value ? favoritesStore.isFavorite(movie.value.imdbID) : false
})

const getPoster = (poster) => {
  if (!poster || poster === 'N/A') {
    return 'https://placehold.co/300x445?text=No+Poster'
  }

  return poster
}

const handleFavoriteClick = () => {
  if (!movie.value) {
    return
  }

  favoritesStore.toggleFavorite(movie.value)
}

const fetchMovieDetail = async () => {
  try {
    loading.value = true
    error.value = ''

    const data = await getMovieDetail(route.params.id)

    if (data.Response === 'False') {
      error.value = data.Error || 'Movie detail not found.'
      return
    }

    movie.value = data
  } catch (err) {
    error.value = err.message || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMovieDetail()
})
</script>
