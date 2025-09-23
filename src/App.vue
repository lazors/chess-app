<template>
  <div id="app">
    <nav>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/games">Games</RouterLink>
        <RouterLink to="/stats">Statistics</RouterLink>
      </div>
      <ThemeToggle />
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<style scoped>
nav {
  padding: 1rem;
  background: var(--nav-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

nav a {
  color: var(--nav-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

nav a:hover,
nav a.router-link-active {
  background: var(--accent-primary);
  color: white;
}

main {
  padding: 2rem;
}

@media (max-width: 640px) {
  nav {
    padding: 0.75rem;
  }

  .nav-links {
    gap: 0.5rem;
  }

  nav a {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  main {
    padding: 1rem;
  }
}
</style>