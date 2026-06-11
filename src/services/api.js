import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const searchMovies = async (query, page = 1, year) => {
  const params = {
    apikey: apiKey,
    s: query,
    page,
    type: "movie",
  };

  if (year) {
    params.y = year;
  }

  const res = await axios.get(apiUrl, {
    params,
  });

  return res.data;
};

export const getMovieDetail = async (id) => {
  const res = await axios.get(apiUrl, {
    params: {
      apikey: apiKey,
      i: id,
      plot: "full",
    },
  });

  return res.data;
};
