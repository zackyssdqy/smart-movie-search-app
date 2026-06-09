<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <section class="mb-8">
      <h1 class="text-3xl font-bold md:text-4xl">
        Find Your Favorite Movies
      </h1>

      <p class="mt-3 max-w-2xl text-slate-400">
        Search movies from OMDb API and discover movie details.
      </p>
    </section>

    <section class="mb-8">
      <SearchBar v-model="searchQuery" />
    </section>

    <section v-if="loading" class="rounded-xl bg-slate-900 p-6 text-slate-300">
      Loading movies...
    </section>

    <section v-else-if="error" class="rounded-xl bg-red-950 p-6 text-red-200">
      {{ error }}
    </section>

    <section v-else-if="!hasSearched" class="rounded-xl bg-slate-900 p-6 text-slate-400">
      Start typing to search for movies.
    </section>

    <section v-else-if="movies.length === 0" class="rounded-xl bg-slate-900 p-6 text-slate-400">
      No movies found.
    </section>

    <section v-else>
      <p class="mb-4 text-sm text-slate-400">
        Showing {{ movies.length }} of {{ totalResults }} results
      </p>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MovieCard v-for="movie in movies" :key="movie.imdbID" :movie="movie" />
      </div>

      <div v-if="hasMoreMovies" ref="loadMoreTrigger" class="mt-8 flex justify-center py-6 text-sm text-slate-400">
        <span v-if="isLoadingMore">Loading more movies...</span>
        <span v-else>Scroll to load more</span>
      </div>

      <div v-else class="mt-8 rounded-xl bg-slate-900 p-4 text-center text-sm text-slate-400">
        You have reached the end of the results.
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { searchMovies } from '@/services/api'
import SearchBar from '@/components/SearchBar.vue'
import MovieCard from '@/components/MovieCard.vue'
import { useDebounce } from '@/composables/useDebounce'

const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 500)

const movies = ref([])
const totalResults = ref(0)
const currentPage = ref(1)

const loading = ref(false)
const isLoadingMore = ref(false)
const error = ref('')
const hasSearched = ref(false)

const loadMoreTrigger = ref(null)
let observer = null
let requestId = 0

const hasMoreMovies = computed(() => {
  return movies.value.length < totalResults.value
})

const resetState = () => {
  movies.value = []
  totalResults.value = 0
  currentPage.value = 1
  error.value = ''
}

const fetchMovies = async ({ page = 1, append = false } = {}) => {
  const query = debouncedSearchQuery.value.trim()

  if (!query) {
    resetState()
    hasSearched.value = false
    return
  }

  if (query.length < 3) {
    resetState()
    hasSearched.value = true
    error.value = 'Please type at least 3 characters.'
    return
  }

  const currentRequestId = ++requestId

  try {
    if (append) {
      isLoadingMore.value = true
    } else {
      loading.value = true
      resetState()
    }

    error.value = ''
    hasSearched.value = true

    const data = await searchMovies(query, page)

    if (currentRequestId !== requestId) return

    if (data.Response === 'False') {
      if (append) return

      movies.value = []
      totalResults.value = 0

      if (data.Error === 'Too many results.') {
        error.value = 'Too many results. Please use a more specific movie title.'
      } else if (data.Error === 'Movie not found!') {
        error.value = 'Movie not found. Try another title.'
      } else {
        error.value = data.Error || 'Something went wrong.'
      }

      return
    }

    const newMovies = data.Search || []

    movies.value = append
      ? [...movies.value, ...newMovies]
      : newMovies

    totalResults.value = Number(data.totalResults || 0)
    currentPage.value = page


  } catch (err) {
    if (currentRequestId !== requestId) return

    if (!append) {
      movies.value = []
      totalResults.value = 0
    }

    error.value = err.message || 'Something went wrong.'
  } finally {
    if (currentRequestId === requestId) {
      loading.value = false
      isLoadingMore.value = false

      await nextTick()
      observeLoadMoreTrigger()
    }
  }
}

const loadMoreMovies = () => {
  if (loading.value || isLoadingMore.value || !hasMoreMovies.value) return

  fetchMovies({
    page: currentPage.value + 1,
    append: true,
  })
}

const observeLoadMoreTrigger = () => {
  if (observer) {
    observer.disconnect()
  }

  if (!loadMoreTrigger.value || !hasMoreMovies.value) return

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        loadMoreMovies()
      }
    },
    {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    }
  )

  observer.observe(loadMoreTrigger.value)
}

watch(debouncedSearchQuery, () => {
  fetchMovies({ page: 1, append: false })
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
