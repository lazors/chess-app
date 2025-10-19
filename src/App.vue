<template>
  <div id="app">
    <nav role="navigation" aria-label="Main navigation">
      <div class="nav-links" role="list">
        <RouterLink to="/" role="listitem" aria-label="Navigate to Home page">Home</RouterLink>
        <RouterLink to="/games" role="listitem" aria-label="Navigate to Games page">Games</RouterLink>
        <RouterLink to="/stats" role="listitem" aria-label="Navigate to Statistics page">Statistics</RouterLink>
        <RouterLink to="/leaderboards" role="listitem" aria-label="Navigate to Leaderboards page">Leaderboards</RouterLink>
      </div>
      <ThemeToggle />
    </nav>
    <main role="main" aria-label="Main content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initializeTheme();
});
</script>

<style scoped>
nav {
  padding: 1.25rem 2rem;
  background: var(--nav-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

nav a {
  color: var(--nav-text);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

nav a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: left 0.3s ease;
}

nav a:hover::before {
  left: 100%;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

nav a.router-link-active {
  background: rgba(255, 255, 255, 0.95);
  color: var(--accent-primary);
  box-shadow: var(--shadow);
}

main {
  padding: 2.5rem;
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  nav {
    padding: 1rem 1.5rem;
  }

  .nav-links {
    gap: 0.25rem;
  }

  nav a {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  main {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  nav {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: space-around;
  }

  nav a {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  main {
    padding: 1rem;
  }
}
</style>
