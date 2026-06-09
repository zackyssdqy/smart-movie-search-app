<template>
  <article class="overflow-hidden rounded-xl bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:bg-slate-800">
    <RouterLink :to="`/movie/${movie.imdbID}`" class="block">
      <img :src="getPoster(movie.Poster)" :alt="movie.Title" class="h-80 w-full object-cover" />

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
defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const getPoster = (poster) => {
  if (!poster || poster === 'N/A') {
    return 'https://placehold.co/300x445?text=No+Poster'
  }

  return poster
}
</script>
