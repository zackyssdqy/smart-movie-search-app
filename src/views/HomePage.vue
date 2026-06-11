<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <section class="mb-8">
      <h1 class="text-3xl font-bold md:text-4xl">
        Find Your Favorite Movies
      </h1>

      <p class="mt-3 max-w-2xl text-slate-400">
        Search movies from OMDb API or browse curated 2026 collections.
      </p>
    </section>

    <section class="mb-10">
      <SearchBar v-model="searchQuery" />
    </section>

    <section v-if="showDiscoveryRows">
      <LoadingState
        v-if="discoveryLoading"
        message="Loading curated movie rows..."
      />

      <ErrorState v-else-if="discoveryError" :message="discoveryError" />

      <section v-else class="space-y-10">
        <article
          v-for="row in discoveryRows"
          :key="row.key"
          class="rounded-2xl bg-slate-950/40 p-4 ring-1 ring-white/5"
        >
          <div class="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold md:text-2xl">
                {{ row.title }}
              </h2>

              <p class="mt-1 text-sm text-slate-400">
                Based on OMDb results filtered to 2026.
              </p>
            </div>

            <span class="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-400">
              {{ row.movies.length }} titles
            </span>
          </div>

          <div class="overflow-x-auto pb-2">
            <div class="flex gap-4">
              <MovieCard
                v-for="movie in row.movies"
                :key="movie.imdbID"
                :movie="movie"
                compact
              />
            </div>
          </div>

          <EmptyState
            v-if="row.movies.length === 0"
            message="No movies found for this category yet."
          />
        </article>
      </section>
    </section>

    <section v-else>
      <EmptyState
        v-if="searchQuery.trim() && !hasSearched && !loading && !error"
        message="Waiting for you to stop typing..."
      />

      <LoadingState v-if="loading" message="Loading movies..." />

      <ErrorState v-else-if="error" :message="error" />

      <EmptyState
        v-else-if="!hasSearched"
        message="Start typing to search for movies."
      />

      <EmptyState
        v-else-if="movies.length === 0"
        message="No movies found."
      />

      <section v-else>
        <p class="mb-4 text-sm text-slate-400">
          Showing {{ movies.length }} of {{ totalResults }} results
        </p>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MovieCard v-for="movie in movies" :key="movie.imdbID" :movie="movie" />
        </div>

        <div
          v-if="hasMoreMovies"
          ref="loadMoreTrigger"
          class="mt-8 flex justify-center py-6 text-sm text-slate-400"
        >
          <span v-if="isLoadingMore">Loading more movies...</span>
          <span v-else>Scroll to load more</span>
        </div>

        <div v-else class="mt-8 rounded-xl bg-slate-900 p-4 text-center text-sm text-slate-400">
          You have reached the end of the results.
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import MovieCard from '@/components/MovieCard.vue'
import EmptyState from '@/components/states/EmptyState.vue'
import ErrorState from '@/components/states/ErrorState.vue'
import LoadingState from '@/components/states/LoadingState.vue'
import { useDebounce } from '@/composables/useDebounce'
import { searchMovies } from '@/services/api'
import { buildDiscoveryRows } from '@/services/discovery'

const DISCOVERY_YEAR = 2026

const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 500)

const movies = ref([])
const totalResults = ref(0)
const currentPage = ref(1)

const loading = ref(false)
const isLoadingMore = ref(false)
const error = ref('')
const hasSearched = ref(false)

const discoveryRows = ref([])
const discoveryLoading = ref(false)
const discoveryError = ref('')

const loadMoreTrigger = ref(null)
let observer = null
let requestId = 0

const showDiscoveryRows = computed(() => {
  return !searchQuery.value.trim()
})

const hasMoreMovies = computed(() => {
  return movies.value.length < totalResults.value
})

const resetSearchState = () => {
  movies.value = []
  totalResults.value = 0
  currentPage.value = 1
  error.value = ''
}

const fetchMovies = async ({ page = 1, append = false } = {}) => {
  const query = debouncedSearchQuery.value.trim()

  if (!query) {
    resetSearchState()
    hasSearched.value = false
    return
  }

  if (query.length < 3) {
    resetSearchState()
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
      resetSearchState()
    }

    error.value = ''
    hasSearched.value = true

    const data = await searchMovies(query, page)

    if (currentRequestId !== requestId) {
      return
    }

    if (data.Response === 'False') {
      if (append) {
        return
      }

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

    movies.value = append ? [...movies.value, ...newMovies] : newMovies
    totalResults.value = Number(data.totalResults || 0)
    currentPage.value = page
  } catch (fetchError) {
    if (currentRequestId !== requestId) {
      return
    }

    if (!append) {
      movies.value = []
      totalResults.value = 0
    }

    error.value = fetchError.message || 'Something went wrong.'
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
  if (loading.value || isLoadingMore.value || !hasMoreMovies.value) {
    return
  }

  fetchMovies({
    page: currentPage.value + 1,
    append: true,
  })
}

const observeLoadMoreTrigger = () => {
  if (observer) {
    observer.disconnect()
  }

  if (!loadMoreTrigger.value || !hasMoreMovies.value) {
    return
  }

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

const loadDiscoveryRows = async () => {
  try {
    discoveryLoading.value = true
    discoveryError.value = ''
    discoveryRows.value = []

    discoveryRows.value = await buildDiscoveryRows(DISCOVERY_YEAR)
  } catch (fetchError) {
    discoveryError.value = fetchError.message || 'Something went wrong.'
  } finally {
    discoveryLoading.value = false
  }
}

watch(debouncedSearchQuery, () => {
  fetchMovies({ page: 1, append: false })
})

onMounted(() => {
  loadDiscoveryRows()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
