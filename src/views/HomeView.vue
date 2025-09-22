<template>
  <div class="home">
    <h1>Chess App</h1>
    <p>Welcome to your Chess.com statistics and game analyzer!</p>
    <div class="user-input">
      <label for="username">Chess.com Username:</label>
      <input
        v-model="username"
        type="text"
        id="username"
        placeholder="Enter your Chess.com username"
      >
      <button @click="fetchUserData" :disabled="!username">Load Data</button>
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
</script>

<style scoped>
.home {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
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
}

.user-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>