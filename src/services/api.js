import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const searchMovies = async (query, page = 1) => {
  const res = await axios.get(apiUrl, {
    params: {
      apikey: apiKey,
      s: query,
      page,
      type: "movie",
    },
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
