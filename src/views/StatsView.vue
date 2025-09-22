<template>
  <div class="stats-view">
    <h1>Chess Statistics</h1>

    <div v-if="chessStore.isLoading" class="loading">
      Loading statistics...
    </div>

    <div v-else-if="chessStore.hasError" class="error">
      {{ chessStore.error }}
    </div>

    <div v-else-if="!chessStore.hasProfile" class="no-data">
      No data available. Please enter a username on the home page.
    </div>

    <div v-else class="stats-container">
      <!-- Profile Section -->
      <div class="profile-section">
        <h2>Profile</h2>
        <div class="profile-info">
          <div v-if="chessStore.profile?.avatar" class="avatar">
            <img :src="chessStore.profile.avatar" :alt="chessStore.profile.username" />
          </div>
          <div class="profile-details">
            <h3>{{ chessStore.profile?.name || chessStore.profile?.username }}</h3>
            <p>@{{ chessStore.profile?.username }}</p>
            <p v-if="chessStore.profile?.location">📍 {{ chessStore.profile.location }}</p>
            <p v-if="chessStore.profile?.country">🌍 {{ chessStore.profile.country }}</p>
            <p>👥 {{ chessStore.profile?.followers }} followers</p>
            <p>📅 Joined {{ formatDate(chessStore.profile?.joined) }}</p>
          </div>
        </div>
      </div>

      <!-- Ratings Section -->
      <div class="ratings-section">
        <h2>Current Ratings</h2>
        <div class="ratings-grid">
          <RatingCard
            v-if="chessStore.rapidRating"
            title="Rapid"
            :rating="chessStore.rapidRating"
            :record="chessStore.stats?.chess_rapid?.record"
            color="#4CAF50"
          />
          <RatingCard
            v-if="chessStore.blitzRating"
            title="Blitz"
            :rating="chessStore.blitzRating"
            :record="chessStore.stats?.chess_blitz?.record"
            color="#FF9800"
          />
          <RatingCard
            v-if="chessStore.bulletRating"
            title="Bullet"
            :rating="chessStore.bulletRating"
            :record="chessStore.stats?.chess_bullet?.record"
            color="#F44336"
          />
          <RatingCard
            v-if="chessStore.dailyRating"
            title="Daily"
            :rating="chessStore.dailyRating"
            :record="chessStore.stats?.chess_daily?.record"
            color="#2196F3"
          />
        </div>
      </div>

      <!-- Overall Statistics -->
      <div v-if="chessStore.winLossRecord" class="overall-stats">
        <h2>Overall Statistics</h2>
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-label">Total Games:</span>
            <span class="stat-value">{{ chessStore.winLossRecord.total }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Wins:</span>
            <span class="stat-value win">{{ chessStore.winLossRecord.wins }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Losses:</span>
            <span class="stat-value loss">{{ chessStore.winLossRecord.losses }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Draws:</span>
            <span class="stat-value draw">{{ chessStore.winLossRecord.draws }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Win Rate:</span>
            <span class="stat-value">{{ winRate }}%</span>
          </div>
        </div>
      </div>

      <!-- Tactics Section -->
      <div v-if="chessStore.stats?.tactics" class="tactics-section">
        <h2>Tactics</h2>
        <div class="tactics-stats">
          <div class="tactic-stat">
            <span class="label">Highest:</span>
            <span class="value">{{ chessStore.stats.tactics.highest.rating }}</span>
          </div>
          <div class="tactic-stat">
            <span class="label">Lowest:</span>
            <span class="value">{{ chessStore.stats.tactics.lowest.rating }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChessStore } from '@/stores/chess'
import RatingCard from '@/components/RatingCard.vue'

const chessStore = useChessStore()

const winRate = computed(() => {
  const record = chessStore.winLossRecord
  if (!record || record.total === 0) return 0
  return Math.round((record.wins / record.total) * 100)
})

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp * 1000).toLocaleDateString()
}
</script>

<style scoped>
.stats-view {
  max-width: 1200px;
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

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.profile-details h3 {
  margin: 0 0 0.5rem 0;
}

.profile-details p {
  margin: 0.25rem 0;
  color: #666;
}

.ratings-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.overall-stats {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.stat-label {
  font-weight: 500;
}

.stat-value {
  font-weight: bold;
}

.stat-value.win {
  color: #4CAF50;
}

.stat-value.loss {
  color: #f44336;
}

.stat-value.draw {
  color: #FF9800;
}

.tactics-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tactics-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.tactic-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.tactic-stat .label {
  font-size: 0.9rem;
  color: #666;
}

.tactic-stat .value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2196F3;
}

h1, h2 {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
  }

  .tactics-stats {
    flex-direction: column;
  }
}
</style>