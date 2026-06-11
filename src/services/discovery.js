import { getMovieDetail, searchMovies } from '@/services/api'

const DISCOVERY_SEEDS = ['movie', 'film', 'love', 'story']
const DISCOVERY_PAGE_LIMIT = 5
const DISCOVERY_DETAIL_LIMIT = 40
const CAROUSEL_LIMIT = 10

const toNumber = (value) => {
  const parsedValue = Number(value)

  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const parseReleasedAt = (movie) => {
  const releasedDate = new Date(movie.Released)

  return Number.isNaN(releasedDate.getTime()) ? 0 : releasedDate.getTime()
}

const sortByLatest = (movies) => {
  return [...movies].sort((leftMovie, rightMovie) => {
    return parseReleasedAt(rightMovie) - parseReleasedAt(leftMovie)
  })
}

const sortByRating = (movies) => {
  return [...movies].sort((leftMovie, rightMovie) => {
    return toNumber(rightMovie.imdbRating) - toNumber(leftMovie.imdbRating)
  })
}

const hasGenre = (movie, genreName) => {
  const genre = movie.Genre?.toLowerCase() || ''

  return genre.includes(genreName)
}

const normalizeMovie = (searchMovie, detailMovie) => {
  return {
    ...searchMovie,
    ...detailMovie,
  }
}

const fetchDiscoveryPool = async (year) => {
  const searchRequests = DISCOVERY_SEEDS.flatMap((seed) => {
    return Array.from({ length: DISCOVERY_PAGE_LIMIT }, (_, index) => {
      return searchMovies(seed, index + 1, year)
    })
  })

  const searchResults = await Promise.allSettled(searchRequests)
  const uniqueMovies = new Map()

  for (const result of searchResults) {
    if (result.status !== 'fulfilled') {
      continue
    }

    const payload = result.value

    if (payload.Response !== 'True' || !Array.isArray(payload.Search)) {
      continue
    }

    for (const movie of payload.Search) {
      if (!uniqueMovies.has(movie.imdbID)) {
        uniqueMovies.set(movie.imdbID, movie)
      }
    }
  }

  const moviesToEnrich = Array.from(uniqueMovies.values()).slice(0, DISCOVERY_DETAIL_LIMIT)
  const detailRequests = moviesToEnrich.map((movie) => {
    return getMovieDetail(movie.imdbID)
  })

  const detailResults = await Promise.allSettled(detailRequests)
  const detailedMovies = []

  detailResults.forEach((result, index) => {
    if (result.status !== 'fulfilled') {
      return
    }

    const detailMovie = result.value

    if (detailMovie.Response !== 'True') {
      return
    }

    const searchMovie = moviesToEnrich[index]

    detailedMovies.push(normalizeMovie(searchMovie, detailMovie))
  })

  return detailedMovies.filter((movie) => movie.Year === String(year))
}

export const buildDiscoveryRows = async (year) => {
  const pool = await fetchDiscoveryPool(year)

  return [
    {
      key: 'latest',
      title: `Film Terbaru ${year}`,
      movies: sortByLatest(pool).slice(0, CAROUSEL_LIMIT),
    },
    {
      key: 'top-rated',
      title: `Film Rating Tertinggi ${year}`,
      movies: sortByRating(pool).slice(0, CAROUSEL_LIMIT),
    },
    {
      key: 'romance',
      title: `Film Romance ${year}`,
      movies: sortByRating(pool.filter((movie) => hasGenre(movie, 'romance'))).slice(0, CAROUSEL_LIMIT),
    },
    {
      key: 'comedy',
      title: `Film Comedy ${year}`,
      movies: sortByRating(pool.filter((movie) => hasGenre(movie, 'comedy'))).slice(0, CAROUSEL_LIMIT),
    },
  ]
}
