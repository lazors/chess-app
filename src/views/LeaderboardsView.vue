<template>
  <div class="leaderboards-view">
    <h1>Leaderboards</h1>

    <div v-if="chessStore.isLoading" class="loading">
      Loading leaderboards...
    </div>

    <div v-else-if="chessStore.hasError" class="error">
      {{ chessStore.error }}
    </div>

    <div v-else class="leaderboards-container">
      <div class="leaderboard-controls">
        <button @click="fetchLeaderboards" :disabled="chessStore.isLoading">
          {{ chessStore.isLoading ? 'Loading...' : 'Refresh Leaderboards' }}
        </button>
      </div>

      <div v-if="Object.keys(chessStore.leaderboards).length === 0" class="no-data">
        No leaderboard data available. Click "Refresh Leaderboards" to load data.
      </div>

      <div v-else class="leaderboards-grid">
        <!-- Live Rapid -->
        <div v-if="chessStore.leaderboards.live_rapid" class="leaderboard-section">
          <h2>🚀 Live Rapid</h2>
          <div class="leaderboard-list">
            <div
              v-for="(player, index) in chessStore.leaderboards.live_rapid.slice(0, 10)"
              :key="player.player_id"
              class="player-card"
              :class="{ top: index < 3 }"
            >
              <div class="player-rank">{{ index + 1 }}</div>
              <div class="player-info">
                <img v-if="player.avatar" :src="player.avatar" :alt="player.username" class="player-avatar" />
                <div class="player-details">
                  <h4>{{ player.name || player.username }}</h4>
                  <p class="username">@{{ player.username }}</p>
                  <p v-if="player.title" class="title">{{ player.title }}</p>
                </div>
              </div>
              <div class="player-score">{{ player.score }}</div>
            </div>
          </div>
        </div>

        <!-- Live Blitz -->
        <div v-if="chessStore.leaderboards.live_blitz" class="leaderboard-section">
          <h2>⚡ Live Blitz</h2>
          <div class="leaderboard-list">
            <div
              v-for="(player, index) in chessStore.leaderboards.live_blitz.slice(0, 10)"
              :key="player.player_id"
              class="player-card"
              :class="{ top: index < 3 }"
            >
              <div class="player-rank">{{ index + 1 }}</div>
              <div class="player-info">
                <img v-if="player.avatar" :src="player.avatar" :alt="player.username" class="player-avatar" />
                <div class="player-details">
                  <h4>{{ player.name || player.username }}</h4>
                  <p class="username">@{{ player.username }}</p>
                  <p v-if="player.title" class="title">{{ player.title }}</p>
                </div>
              </div>
              <div class="player-score">{{ player.score }}</div>
            </div>
          </div>
        </div>

        <!-- Live Bullet -->
        <div v-if="chessStore.leaderboards.live_bullet" class="leaderboard-section">
          <h2>💨 Live Bullet</h2>
          <div class="leaderboard-list">
            <div
              v-for="(player, index) in chessStore.leaderboards.live_bullet.slice(0, 10)"
              :key="player.player_id"
              class="player-card"
              :class="{ top: index < 3 }"
            >
              <div class="player-rank">{{ index + 1 }}</div>
              <div class="player-info">
                <img v-if="player.avatar" :src="player.avatar" :alt="player.username" class="player-avatar" />
                <div class="player-details">
                  <h4>{{ player.name || player.username }}</h4>
                  <p class="username">@{{ player.username }}</p>
                  <p v-if="player.title" class="title">{{ player.title }}</p>
                </div>
              </div>
              <div class="player-score">{{ player.score }}</div>
            </div>
          </div>
        </div>

        <!-- Daily -->
        <div v-if="chessStore.leaderboards.daily" class="leaderboard-section">
          <h2>📅 Daily</h2>
          <div class="leaderboard-list">
            <div
              v-for="(player, index) in chessStore.leaderboards.daily.slice(0, 10)"
              :key="player.player_id"
              class="player-card"
              :class="{ top: index < 3 }"
            >
              <div class="player-rank">{{ index + 1 }}</div>
              <div class="player-info">
                <img v-if="player.avatar" :src="player.avatar" :alt="player.username" class="player-avatar" />
                <div class="player-details">
                  <h4>{{ player.name || player.username }}</h4>
                  <p class="username">@{{ player.username }}</p>
                  <p v-if="player.title" class="title">{{ player.title }}</p>
                </div>
              </div>
              <div class="player-score">{{ player.score }}</div>
            </div>
          </div>
        </div>

        <!-- Tactics -->
        <div v-if="chessStore.leaderboards.tactics" class="leaderboard-section">
          <h2>🧩 Tactics</h2>
          <div class="leaderboard-list">
            <div
              v-for="(player, index) in chessStore.leaderboards.tactics.slice(0, 10)"
              :key="player.player_id"
              class="player-card"
              :class="{ top: index < 3 }"
            >
              <div class="player-rank">{{ index + 1 }}</div>
              <div class="player-info">
                <img v-if="player.avatar" :src="player.avatar" :alt="player.username" class="player-avatar" />
                <div class="player-details">
                  <h4>{{ player.name || player.username }}</h4>
                  <p class="username">@{{ player.username }}</p>
                  <p v-if="player.title" class="title">{{ player.title }}</p>
                </div>
              </div>
              <div class="player-score">{{ player.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChessStore } from '@/stores/chess'

const chessStore = useChessStore()

const fetchLeaderboards = () => {
  chessStore.fetchLeaderboards()
}
</script>

<style scoped>
.leaderboards-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #f44336;
}

.leaderboard-controls {
  text-align: center;
  margin-bottom: 2rem;
}

.leaderboard-controls button {
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.leaderboard-controls button:hover:not(:disabled) {
  background: #369870;
}

.leaderboard-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.leaderboards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.leaderboard-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.leaderboard-section h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  text-align: center;
  font-size: 1.3rem;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.player-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.player-card.top {
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  border-color: #f39c12;
}

.player-card.top:nth-child(1) {
  background: linear-gradient(135deg, #ffd700, #f39c12);
}

.player-card.top:nth-child(2) {
  background: linear-gradient(135deg, #c0c0c0, #95a5a6);
}

.player-card.top:nth-child(3) {
  background: linear-gradient(135deg, #cd7f32, #d35400);
}

.player-rank {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  min-width: 40px;
  text-align: center;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.player-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #42b883;
}

.player-details h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

.player-details .username {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.player-details .title {
  margin: 0.25rem 0 0 0;
  color: #e67e22;
  font-weight: bold;
  font-size: 0.85rem;
}

.player-score {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  min-width: 80px;
  text-align: right;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .leaderboards-grid {
    grid-template-columns: 1fr;
  }

  .player-card {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .player-info {
    flex-direction: column;
    text-align: center;
  }

  .player-score {
    text-align: center;
  }
}
</style>