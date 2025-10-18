<template>
  <button
    @click="themeStore.toggleTheme()"
    class="theme-toggle"
    :title="themeStore.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-label="themeStore.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-pressed="themeStore.isDark"
    role="switch"
    type="button"
  >
    <span class="theme-icon" aria-hidden="true">
      {{ themeStore.isDark ? '☀️' : '🌙' }}
    </span>
    <span class="theme-text">
      {{ themeStore.isDark ? 'Light' : 'Dark' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
}

.theme-toggle:hover {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.theme-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.theme-text {
  font-size: 0.85rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .theme-text {
    display: none;
  }

  .theme-toggle {
    padding: 0.5rem;
    min-width: 40px;
    justify-content: center;
  }
}
</style>