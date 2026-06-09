import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomePage.vue"),
    },
    {
      path: "/movie/:id",
      name: "movie-detail",
      component: () => import("@/views/DetailMovie.vue"),
      props: true,
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("@/views/MovieFavorite.vue"),
    },
  ],
});

export default router;
