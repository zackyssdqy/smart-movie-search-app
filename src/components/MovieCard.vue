<template>
  <article :class="cardClass">
    <FavoriteButton
      class="absolute right-3 top-3 z-10"
      :active="isSaved"
      :aria-label="`Toggle favorite for ${movie.Title}`"
      @click.stop="handleFavoriteClick"
    />

    <RouterLink :to="`/movie/${movie.imdbID}`" class="block">
      <img
        :src="getPoster(movie.Poster)"
        :alt="movie.Title"
        :class="posterClass"
      />

      <div class="p-4">
        <h2 class="line-clamp-2 font-semibold text-white">
          {{ movie.Title }}
        </h2>

        <p class="mt-1 text-sm text-slate-400">
          {{ movie.Year }} • {{ movie.Type }}
        </p>
      </div>
    </RouterLink>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const favoritesStore = useFavoritesStore()

const isSaved = computed(() => favoritesStore.isFavorite(props.movie.imdbID))
const cardClass = computed(() => {
  return [
    'group relative overflow-hidden rounded-xl bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:bg-slate-800',
    props.compact ? 'w-44 shrink-0 sm:w-48' : '',
  ].join(' ')
})
const posterClass = computed(() => {
  return [
    'w-full object-cover',
    props.compact ? 'h-64' : 'h-80',
  ].join(' ')
})

const handleFavoriteClick = () => {
  favoritesStore.toggleFavorite(props.movie)
}

const getPoster = (poster) => {
  if (!poster || poster === 'N/A') {
    return 'https://placehold.co/300x445?text=No+Poster'
  }

  return poster
}
</script>
