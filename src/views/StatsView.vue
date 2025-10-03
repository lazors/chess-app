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
        <h2>Overall Statistics (Chess.com API)</h2>
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

      <!-- Color-Separated Game Statistics -->
      <div v-if="chessStore.colorSeparatedStats" class="color-stats">
        <h2>Game Statistics by Color</h2>
        <div class="color-stats-grid">
          <!-- White Statistics -->
          <div class="color-section white-section">
            <h3>🤍 Playing as White</h3>
            <div class="stats-summary">
              <div class="stat-item">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{ chessStore.colorSeparatedStats.white.games }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Wins:</span>
                <span class="stat-value win">{{ chessStore.colorSeparatedStats.white.wins }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Losses:</span>
                <span class="stat-value loss">{{ chessStore.colorSeparatedStats.white.losses }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Draws:</span>
                <span class="stat-value draw">{{ chessStore.colorSeparatedStats.white.draws }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value" :class="getWinRateClass(chessStore.colorSeparatedStats.white.winRate)">{{ chessStore.colorSeparatedStats.white.winRate }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ chessStore.colorSeparatedStats.white.averageRating }}</span>
              </div>
            </div>
          </div>

          <!-- Black Statistics -->
          <div class="color-section black-section">
            <h3>🖤 Playing as Black</h3>
            <div class="stats-summary">
              <div class="stat-item">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{ chessStore.colorSeparatedStats.black.games }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Wins:</span>
                <span class="stat-value win">{{ chessStore.colorSeparatedStats.black.wins }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Losses:</span>
                <span class="stat-value loss">{{ chessStore.colorSeparatedStats.black.losses }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Draws:</span>
                <span class="stat-value draw">{{ chessStore.colorSeparatedStats.black.draws }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value" :class="getWinRateClass(chessStore.colorSeparatedStats.black.winRate)">{{ chessStore.colorSeparatedStats.black.winRate }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ chessStore.colorSeparatedStats.black.averageRating }}</span>
              </div>
            </div>
          </div>

          <!-- Combined Statistics -->
          <div class="color-section combined-section">
            <h3>🔄 Combined (Historical Games)</h3>
            <div class="stats-summary">
              <div class="stat-item">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{ chessStore.colorSeparatedStats.combined.games }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Wins:</span>
                <span class="stat-value win">{{ chessStore.colorSeparatedStats.combined.wins }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Losses:</span>
                <span class="stat-value loss">{{ chessStore.colorSeparatedStats.combined.losses }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Draws:</span>
                <span class="stat-value draw">{{ chessStore.colorSeparatedStats.combined.draws }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value" :class="getWinRateClass(chessStore.colorSeparatedStats.combined.winRate)">{{ chessStore.colorSeparatedStats.combined.winRate }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ chessStore.colorSeparatedStats.combined.averageRating }}</span>
              </div>
            </div>
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

      <!-- Color-Separated Opening Statistics -->
      <div v-if="chessStore.coloredOpeningStats && (chessStore.coloredOpeningStats.white.length > 0 || chessStore.coloredOpeningStats.black.length > 0)" class="openings-section">
        <h2>Opening Statistics by Color</h2>
        
        <!-- Opening Tabs -->
        <div class="opening-tabs">
          <button 
            :class="['tab-button', { active: activeOpeningTab === 'white' }]"
            @click="activeOpeningTab = 'white'"
          >
            🤍 White Openings ({{ chessStore.coloredOpeningStats.white.length }})
          </button>
          <button 
            :class="['tab-button', { active: activeOpeningTab === 'black' }]"
            @click="activeOpeningTab = 'black'"
          >
            🖤 Black Openings ({{ chessStore.coloredOpeningStats.black.length }})
          </button>
          <button 
            :class="['tab-button', { active: activeOpeningTab === 'combined' }]"
            @click="activeOpeningTab = 'combined'"
          >
            🔄 Combined ({{ chessStore.coloredOpeningStats.combined.length }})
          </button>
        </div>

        <!-- White Openings -->
        <div v-if="activeOpeningTab === 'white' && chessStore.coloredOpeningStats.white.length > 0" class="openings-grid">
          <div
            v-for="opening in chessStore.coloredOpeningStats.white"
            :key="`white-${opening.opening}`"
            class="opening-card white-opening"
          >
            <h3 class="opening-name">{{ opening.opening }}</h3>
            <div class="opening-stats">
              <div class="stat-row">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{ opening.games }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value" :class="getWinRateClass(opening.winRate)">{{ opening.winRate }}%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">W/L/D:</span>
                <span class="stat-value">{{ opening.wins }}/{{ opening.losses }}/{{ opening.draws }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ opening.averageRating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Black Openings -->
        <div v-if="activeOpeningTab === 'black' && chessStore.coloredOpeningStats.black.length > 0" class="openings-grid">
          <div
            v-for="opening in chessStore.coloredOpeningStats.black"
            :key="`black-${opening.opening}`"
            class="opening-card black-opening"
          >
            <h3 class="opening-name">{{ opening.opening }}</h3>
            <div class="opening-stats">
              <div class="stat-row">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{ opening.games }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value" :class="getWinRateClass(opening.winRate)">{{ opening.winRate }}%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">W/L/D:</span>
                <span class="stat-value">{{ opening.wins }}/{{ opening.losses }}/{{ opening.draws }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ opening.averageRating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Combined Openings -->
        <div v-if="activeOpeningTab === 'combined' && chessStore.coloredOpeningStats.combined.length > 0" class="openings-grid">
          <div
            v-for="opening in chessStore.coloredOpeningStats.combined"
            :key="`combined-${opening.opening}`"
            class="opening-card combined-opening"
          >
            <h3 class="opening-name">{{ opening.opening }}</h3>
            <div class="opening-stats">
              <div class="stat-row">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{ opening.games }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value" :class="getWinRateClass(opening.winRate)">{{ opening.winRate }}%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">W/L/D:</span>
                <span class="stat-value">{{ opening.wins }}/{{ opening.losses }}/{{ opening.draws }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ opening.averageRating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tournaments Section -->
      <div v-if="chessStore.tournaments.length > 0" class="tournaments-section">
        <h2>Recent Tournaments</h2>
        <div class="tournaments-list">
          <div
            v-for="tournament in chessStore.tournaments.slice(0, 5)"
            :key="tournament.url"
            class="tournament-card"
          >
            <div class="tournament-header">
              <h4>{{ tournament.title }}</h4>
              <span class="tournament-status" :class="tournament.status">
                {{ formatStatus(tournament.status) }}
              </span>
            </div>
            <div class="tournament-details">
              <p class="tournament-type">{{ tournament.type.toUpperCase() }} - {{ tournament.time_class }}</p>
              <p class="tournament-players">{{ tournament.total_players }} players</p>
              <p class="tournament-date">{{ formatDate(tournament.start_time) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Clubs Section -->
      <div v-if="chessStore.clubs.length > 0" class="clubs-section">
        <h2>Chess Clubs</h2>
        <div class="clubs-grid">
          <div
            v-for="club in chessStore.clubs"
            :key="club.club_id"
            class="club-card"
          >
            <div class="club-header">
              <img v-if="club.icon" :src="club.icon" :alt="club.name" class="club-icon" />
              <div>
                <h4>{{ club.name }}</h4>
                <p class="club-joined">Joined {{ formatDate(club.joined) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Matches Section -->
      <div v-if="chessStore.teamMatches.length > 0" class="matches-section">
        <h2>Team Matches</h2>
        <div class="matches-list">
          <div
            v-for="match in chessStore.teamMatches.slice(0, 5)"
            :key="match.url"
            class="match-card"
          >
            <div class="match-header">
              <h4>vs {{ match.opponent }}</h4>
              <span class="match-result" :class="match.result">
                {{ match.result.toUpperCase() }}
              </span>
            </div>
            <div class="match-details">
              <p>{{ match.time_class }} - {{ match.status }}</p>
              <p>{{ formatDate(match.start_time) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChessStore } from '@/stores/chess'
import RatingCard from '@/components/RatingCard.vue'

const chessStore = useChessStore()
const activeOpeningTab = ref<'white' | 'black' | 'combined'>('combined')

const winRate = computed(() => {
  const record = chessStore.winLossRecord
  if (!record || record.total === 0) return 0
  return Math.round((record.wins / record.total) * 100)
})

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp * 1000).toLocaleDateString()
}

const formatStatus = (status: string): string => {
  return status.replace('_', ' ').toUpperCase()
}

const getWinRateClass = (winRate: number): string => {
  if (winRate >= 60) return 'excellent'
  if (winRate >= 50) return 'good'
  if (winRate >= 40) return 'average'
  return 'poor'
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

.openings-section,
.tournaments-section,
.clubs-section,
.matches-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.openings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.opening-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  transition: transform 0.2s ease;
}

.opening-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.opening-name {
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-weight: 600;
}

.opening-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-value {
  font-weight: 600;
}

.stat-value.excellent {
  color: #4CAF50;
}

.stat-value.good {
  color: #8BC34A;
}

.stat-value.average {
  color: #FF9800;
}

.stat-value.poor {
  color: #f44336;
}

/* Color-separated statistics styles */
.color-stats {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.color-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.color-section {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.color-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.white-section {
  border-color: #d1ecf1;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.black-section {
  border-color: #d6d8db;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.combined-section {
  border-color: #b3d4fc;
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%);
}

.color-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Opening tabs styles */
.opening-tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #495057;
}

.tab-button:hover {
  border-color: #2196F3;
  color: #2196F3;
}

.tab-button.active {
  background: #2196F3;
  border-color: #2196F3;
  color: white;
}

/* Opening card color variants */
.opening-card.white-opening {
  border-left: 4px solid #28a745;
}

.opening-card.black-opening {
  border-left: 4px solid #6c757d;
}

.opening-card.combined-opening {
  border-left: 4px solid #2196F3;
}

.tournaments-list,
.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.tournament-card,
.match-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
}

.tournament-header,
.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tournament-header h4,
.match-header h4 {
  margin: 0;
  color: #2c3e50;
}

.tournament-status,
.match-result {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.tournament-status.finished,
.match-result.win {
  background: #d4edda;
  color: #155724;
}

.tournament-status.in_progress {
  background: #fff3cd;
  color: #856404;
}

.tournament-status.registration {
  background: #d1ecf1;
  color: #0c5460;
}

.match-result.loss {
  background: #f8d7da;
  color: #721c24;
}

.match-result.draw {
  background: #fff3cd;
  color: #856404;
}

.tournament-details,
.match-details {
  font-size: 0.9rem;
  color: #666;
}

.tournament-details p,
.match-details p {
  margin: 0.25rem 0;
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.club-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
}

.club-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.club-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}

.club-header h4 {
  margin: 0;
  color: #2c3e50;
}

.club-joined {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: #666;
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