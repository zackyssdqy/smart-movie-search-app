<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <header class="border-b border-slate-800 bg-slate-950/90">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <RouterLink to="/" class="text-xl font-bold tracking-tight">
          Smart Movie Search
        </RouterLink>

        <div class="flex items-center gap-4 text-sm text-slate-300">
          <RouterLink to="/" class="hover:text-white" active-class="text-white font-semibold">
            Search
          </RouterLink>

          <RouterLink to="/favorites" class="hover:text-white" active-class="text-white font-semibold">
            Favorites
          </RouterLink>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
