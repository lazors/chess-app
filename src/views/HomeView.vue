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
    await chessStore.fetchUserProfile(username.value)
    await chessStore.fetchUserStats(username.value)
    await chessStore.fetchRecentGames(username.value)
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
  background: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1976d2;
}

.status.error {
  background: #ffebee;
  border: 1px solid #ef5350;
  color: #c62828;
}

.status.success {
  background: #e8f5e8;
  border: 1px solid #81c784;
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
  color: #2c3e50;
}

.user-info .username {
  margin: 0 0 0.25rem 0;
  color: #666;
  font-weight: 500;
}

.user-info .title {
  margin: 0 0 0.25rem 0;
  color: #e67e22;
  font-weight: bold;
}

.user-info .location {
  margin: 0;
  color: #7f8c8d;
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
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-input button {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
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