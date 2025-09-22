<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/games">Games</RouterLink>
      <RouterLink to="/stats">Statistics</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
nav {
  padding: 1rem;
  background: #2c3e50;
}

nav a {
  color: white;
  margin-right: 1rem;
  text-decoration: none;
}

nav a:hover {
  color: #42b883;
}

main {
  padding: 2rem;
}
</style>