import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'smart-movie-search-favorites'

const loadFavorites = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)

    return storedValue ? JSON.parse(storedValue) : []
  } catch {
    return []
  }
}

const saveFavorites = (favorites) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(loadFavorites())

  const favoriteCount = computed(() => favorites.value.length)

  const isFavorite = (movieId) => {
    return favorites.value.some((movie) => movie.imdbID === movieId)
  }

  const addFavorite = (movie) => {
    if (!movie || !movie.imdbID || isFavorite(movie.imdbID)) {
      return
    }

    favorites.value = [...favorites.value, movie]
  }

  const removeFavorite = (movieId) => {
    favorites.value = favorites.value.filter((movie) => movie.imdbID !== movieId)
  }

  const toggleFavorite = (movie) => {
    if (!movie || !movie.imdbID) {
      return
    }

    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID)
      return
    }

    addFavorite(movie)
  }

  const clearFavorites = () => {
    favorites.value = []
  }

  watch(
    favorites,
    (newFavorites) => {
      saveFavorites(newFavorites)
    },
    { deep: true }
  )

  return {
    favorites,
    favoriteCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  }
})
