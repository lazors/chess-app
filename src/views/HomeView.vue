<template>
  <div class="home">
    <h1>Chess App</h1>
    <p>Welcome to your Chess.com statistics and game analyzer!</p>

    <!-- Loading status and user info -->
    <div v-if="chessStore.isLoading" class="status loading">
      <p>⏳ Loading user data...</p>
    </div>

    <div v-else-if="chessStore.hasError" class="status error">
      <p>❌ Error: {{ chessStore.error }}</p>
    </div>

    <div v-else-if="chessStore.hasProfile" class="status success">
      <div class="user-profile">
        <img v-if="chessStore.profile?.avatar" :src="chessStore.profile.avatar" alt="User Avatar" class="avatar" />
        <div class="user-info">
          <h2>{{ chessStore.profile?.name || chessStore.profile?.username }}</h2>
          <p class="username">@{{ chessStore.profile?.username }}</p>
          <p v-if="chessStore.profile?.title" class="title">{{ chessStore.profile.title }}</p>
          <p v-if="chessStore.profile?.location" class="location">📍 {{ chessStore.profile.location }}</p>
        </div>
      </div>
    </div>

    <div class="user-input">
      <label for="username">Chess.com Username:</label>
      <input
        v-model="username"
        type="text"
        id="username"
        placeholder="Enter your Chess.com username"
      >
      <button @click="fetchUserData" :disabled="!username || chessStore.isLoading">
        {{ chessStore.isLoading ? 'Loading...' : 'Load Data' }}
      </button>
      <button v-if="chessStore.hasProfile" @click="clearData" class="clear-button">
        Clear Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChessStore } from '@/stores/chess'

const username = ref('')
const chessStore = useChessStore()

const fetchUserData = async () => {
  if (username.value) {
    await chessStore.fetchAllUserData(username.value)
  }
}

const clearData = () => {
  chessStore.clearData()
  username.value = ''
}
</script>

<style scoped>
.home {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.status {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
}

.status.loading {
  background: var(--loading-bg);
  border: 1px solid var(--loading-border);
  color: var(--loading-text);
}

.status.error {
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  color: var(--error-text);
}

.status.success {
  background: var(--success-bg);
  border: 1px solid var(--success-border);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  text-align: left;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #42b883;
}

.user-info h2 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.user-info .username {
  margin: 0 0 0.25rem 0;
  color: var(--text-secondary);
  font-weight: 500;
}

.user-info .title {
  margin: 0 0 0.25rem 0;
  color: #e67e22;
  font-weight: bold;
}

.user-info .location {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.user-input {
  margin-top: 2rem;
}

.user-input label {
  display: block;
  margin-bottom: 0.5rem;
}

.user-input input {
  padding: 0.5rem;
  margin-right: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.user-input input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--input-focus-shadow);
}

.user-input button {
  padding: 0.5rem 1rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.3s ease;
}

.user-input button:hover:not(:disabled) {
  background: var(--accent-secondary);
}

.user-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-button {
  background: #e74c3c !important;
}

.clear-button:hover {
  background: #c0392b !important;
}
</style>