<template>
  <div class="stats-view">
    <h1>Chess Statistics</h1>

    <div v-if="chessStore.isLoading" class="loading">Loading statistics...</div>

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
            <img
              :src="chessStore.profile.avatar"
              :alt="chessStore.profile.username"
            />
          </div>
          <div class="profile-details">
            <h3>
              {{ chessStore.profile?.name || chessStore.profile?.username }}
            </h3>
            <p>@{{ chessStore.profile?.username }}</p>
            <p v-if="chessStore.profile?.location">
              📍 {{ chessStore.profile.location }}
            </p>
            <p v-if="chessStore.profile?.country">
              🌍 {{ chessStore.profile.country }}
            </p>
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
            <span class="stat-value win">{{
              chessStore.winLossRecord.wins
            }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Losses:</span>
            <span class="stat-value loss">{{
              chessStore.winLossRecord.losses
            }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Draws:</span>
            <span class="stat-value draw">{{
              chessStore.winLossRecord.draws
            }}</span>
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
                <span class="stat-value">{{
                  chessStore.colorSeparatedStats.white.games
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Wins:</span>
                <span class="stat-value win">{{
                  chessStore.colorSeparatedStats.white.wins
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Losses:</span>
                <span class="stat-value loss">{{
                  chessStore.colorSeparatedStats.white.losses
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Draws:</span>
                <span class="stat-value draw">{{
                  chessStore.colorSeparatedStats.white.draws
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Win Rate:</span>
                <span
                  class="stat-value"
                  :class="
                    getWinRateClass(
                      chessStore.colorSeparatedStats.white.winRate
                    )
                  "
                  >{{ chessStore.colorSeparatedStats.white.winRate }}%</span
                >
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{
                  chessStore.colorSeparatedStats.white.averageRating
                }}</span>
              </div>
            </div>
          </div>

          <!-- Black Statistics -->
          <div class="color-section black-section">
            <h3>🖤 Playing as Black</h3>
            <div class="stats-summary">
              <div class="stat-item">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{
                  chessStore.colorSeparatedStats.black.games
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Wins:</span>
                <span class="stat-value win">{{
                  chessStore.colorSeparatedStats.black.wins
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Losses:</span>
                <span class="stat-value loss">{{
                  chessStore.colorSeparatedStats.black.losses
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Draws:</span>
                <span class="stat-value draw">{{
                  chessStore.colorSeparatedStats.black.draws
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Win Rate:</span>
                <span
                  class="stat-value"
                  :class="
                    getWinRateClass(
                      chessStore.colorSeparatedStats.black.winRate
                    )
                  "
                  >{{ chessStore.colorSeparatedStats.black.winRate }}%</span
                >
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{
                  chessStore.colorSeparatedStats.black.averageRating
                }}</span>
              </div>
            </div>
          </div>

          <!-- Combined Statistics -->
          <div class="color-section combined-section">
            <h3>🔄 Combined (Historical Games)</h3>
            <div class="stats-summary">
              <div class="stat-item">
                <span class="stat-label">Games:</span>
                <span class="stat-value">{{
                  chessStore.colorSeparatedStats.combined.games
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Wins:</span>
                <span class="stat-value win">{{
                  chessStore.colorSeparatedStats.combined.wins
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Losses:</span>
                <span class="stat-value loss">{{
                  chessStore.colorSeparatedStats.combined.losses
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Draws:</span>
                <span class="stat-value draw">{{
                  chessStore.colorSeparatedStats.combined.draws
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Win Rate:</span>
                <span
                  class="stat-value"
                  :class="
                    getWinRateClass(
                      chessStore.colorSeparatedStats.combined.winRate
                    )
                  "
                  >{{ chessStore.colorSeparatedStats.combined.winRate }}%</span
                >
              </div>
              <div class="stat-item">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{
                  chessStore.colorSeparatedStats.combined.averageRating
                }}</span>
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
            <span class="value">{{
              chessStore.stats.tactics.highest.rating
            }}</span>
          </div>
          <div class="tactic-stat">
            <span class="label">Lowest:</span>
            <span class="value">{{
              chessStore.stats.tactics.lowest.rating
            }}</span>
          </div>
        </div>
      </div>

      <!-- Worst Openings Analysis -->
      <WorstOpenings />

      <!-- Recent Form Indicator -->
      <RecentForm
        v-if="chessStore.recentGames.length > 0"
        :recent-games="chessStore.recentGames"
        :username="chessStore.profile?.username || ''"
        :display-count="10"
      />

      <!-- Color-Separated Opening Statistics -->
      <div
        v-if="
          chessStore.coloredOpeningStats &&
          (chessStore.coloredOpeningStats.white.length > 0 ||
            chessStore.coloredOpeningStats.black.length > 0)
        "
        class="openings-section"
      >
        <h2>Opening Statistics by Color</h2>

        <!-- Opening Tabs -->
        <div class="opening-tabs">
          <button
            :class="['tab-button', { active: activeOpeningTab === 'white' }]"
            @click="activeOpeningTab = 'white'"
          >
            🤍 White Openings ({{
              chessStore.coloredOpeningStats.white.length
            }})
          </button>
          <button
            :class="['tab-button', { active: activeOpeningTab === 'black' }]"
            @click="activeOpeningTab = 'black'"
          >
            🖤 Black Openings ({{
              chessStore.coloredOpeningStats.black.length
            }})
          </button>
          <button
            :class="['tab-button', { active: activeOpeningTab === 'combined' }]"
            @click="activeOpeningTab = 'combined'"
          >
            🔄 Combined ({{ chessStore.coloredOpeningStats.combined.length }})
          </button>
        </div>

        <!-- White Openings -->
        <div
          v-if="
            activeOpeningTab === 'white' &&
            chessStore.coloredOpeningStats.white.length > 0
          "
          class="openings-grid"
        >
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
                <span
                  class="stat-value"
                  :class="getWinRateClass(opening.winRate)"
                  >{{ opening.winRate }}%</span
                >
              </div>
              <div class="stat-row">
                <span class="stat-label">W/L/D:</span>
                <span class="stat-value"
                  >{{ opening.wins }}/{{ opening.losses }}/{{
                    opening.draws
                  }}</span
                >
              </div>
              <div class="stat-row">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ opening.averageRating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Black Openings -->
        <div
          v-if="
            activeOpeningTab === 'black' &&
            chessStore.coloredOpeningStats.black.length > 0
          "
          class="openings-grid"
        >
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
                <span
                  class="stat-value"
                  :class="getWinRateClass(opening.winRate)"
                  >{{ opening.winRate }}%</span
                >
              </div>
              <div class="stat-row">
                <span class="stat-label">W/L/D:</span>
                <span class="stat-value"
                  >{{ opening.wins }}/{{ opening.losses }}/{{
                    opening.draws
                  }}</span
                >
              </div>
              <div class="stat-row">
                <span class="stat-label">Avg Rating:</span>
                <span class="stat-value">{{ opening.averageRating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Combined Openings -->
        <div
          v-if="
            activeOpeningTab === 'combined' &&
            chessStore.coloredOpeningStats.combined.length > 0
          "
          class="openings-grid"
        >
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
                <span
                  class="stat-value"
                  :class="getWinRateClass(opening.winRate)"
                  >{{ opening.winRate }}%</span
                >
              </div>
              <div class="stat-row">
                <span class="stat-label">W/L/D:</span>
                <span class="stat-value"
                  >{{ opening.wins }}/{{ opening.losses }}/{{
                    opening.draws
                  }}</span
                >
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
              <p class="tournament-type">
                {{ tournament.type.toUpperCase() }} -
                {{ tournament.time_class }}
              </p>
              <p class="tournament-players">
                {{ tournament.total_players }} players
              </p>
              <p class="tournament-date">
                {{ formatDate(tournament.start_time) }}
              </p>
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
              <img
                v-if="club.icon"
                :src="club.icon"
                :alt="club.name"
                class="club-icon"
              />
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
import { computed, ref } from 'vue';
import { useChessStore } from '@/stores/chess';
import RatingCard from '@/components/RatingCard.vue';
import WorstOpenings from '@/components/WorstOpenings.vue';
import RecentForm from '@/components/RecentForm.vue';

const chessStore = useChessStore();
const activeOpeningTab = ref<'white' | 'black' | 'combined'>('combined');

const winRate = computed(() => {
  const record = chessStore.winLossRecord;
  if (!record || record.total === 0) return 0;
  return Math.round((record.wins / record.total) * 100);
});

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp * 1000).toLocaleDateString();
};

const formatStatus = (status: string): string => {
  return status.replace('_', ' ').toUpperCase();
};

const getWinRateClass = (winRate: number): string => {
  if (winRate >= 60) return 'excellent';
  if (winRate >= 50) return 'good';
  if (winRate >= 40) return 'average';
  return 'poor';
};
</script>

<style scoped>
.stats-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-view h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--bg-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
}

.loading,
.error,
.no-data {
  text-align: center;
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: var(--shadow);
}

.loading {
  background: var(--loading-bg);
  border: 2px solid var(--loading-border);
  color: var(--loading-text);
}

.error {
  background: var(--error-bg);
  border: 2px solid var(--error-border);
  color: var(--error-text);
}

.no-data {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-section:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.profile-section h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.profile-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid var(--accent-primary);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.avatar img:hover {
  transform: scale(1.05);
}

.profile-details h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.profile-details p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.ratings-section {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ratings-section:hover {
  box-shadow: var(--shadow-xl);
}

.ratings-section h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.overall-stats {
  background: linear-gradient(
    135deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 100%
  );
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.overall-stats:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.overall-stats h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
}

.stat-item:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.stat-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.stat-value {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.stat-value.win {
  color: #10b981;
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.stat-value.loss {
  color: #ef4444;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.stat-value.draw {
  color: #f59e0b;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
}

.tactics-section {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tactics-section:hover {
  box-shadow: var(--shadow-xl);
}

.tactics-section h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.tactics-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.tactic-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: var(--card-gradient);
  border-radius: var(--radius-lg);
  min-width: 150px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
}

.tactic-stat:hover {
  box-shadow: var(--shadow);
  transform: scale(1.05);
}

.tactic-stat .label {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tactic-stat .value {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.openings-section,
.tournaments-section,
.clubs-section,
.matches-section {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.openings-section:hover,
.tournaments-section:hover,
.clubs-section:hover,
.matches-section:hover {
  box-shadow: var(--shadow-xl);
}

.openings-section h2,
.tournaments-section h2,
.clubs-section h2,
.matches-section h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.openings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.opening-card {
  background: var(--card-gradient);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.opening-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.opening-name {
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-weight: 700;
}

.opening-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.stat-label {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-weight: 700;
  font-size: 1.1rem;
}

.stat-value.excellent {
  color: #10b981;
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.stat-value.good {
  color: #84cc16;
}

.stat-value.average {
  color: #f59e0b;
}

.stat-value.poor {
  color: #ef4444;
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
}

/* Color-separated statistics styles */
.color-stats {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-stats:hover {
  box-shadow: var(--shadow-xl);
}

.color-stats h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.color-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.color-section {
  background: var(--card-gradient);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.color-section:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.white-section {
  border-color: #10b981;
  background: linear-gradient(
    135deg,
    var(--bg-secondary) 0%,
    rgba(16, 185, 129, 0.1) 100%
  );
}

.black-section {
  border-color: var(--text-secondary);
  background: linear-gradient(
    135deg,
    var(--bg-secondary) 0%,
    rgba(100, 116, 139, 0.1) 100%
  );
}

.combined-section {
  border-color: #667eea;
  background: linear-gradient(
    135deg,
    var(--bg-secondary) 0%,
    rgba(102, 126, 234, 0.1) 100%
  );
}

.color-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Opening tabs styles */
.opening-tabs {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.tab-button {
  padding: 1rem 2rem;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
}

.tab-button:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.tab-button.active {
  background: linear-gradient(
    135deg,
    var(--accent-primary) 0%,
    var(--accent-secondary) 100%
  );
  border-color: var(--accent-primary);
  color: white;
  box-shadow: var(--shadow);
}

/* Opening card color variants */
.opening-card.white-opening {
  border-left: 4px solid #10b981;
}

.opening-card.black-opening {
  border-left: 4px solid var(--text-secondary);
}

.opening-card.combined-opening {
  border-left: 4px solid #667eea;
}

.tournaments-list,
.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.tournament-card,
.match-card {
  background: var(--card-gradient);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.tournament-card:hover,
.match-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.tournament-header,
.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tournament-header h4,
.match-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 700;
}

.tournament-status,
.match-result {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-sm);
}

.tournament-status.finished,
.match-result.win {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.tournament-status.in_progress {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.tournament-status.registration {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.match-result.loss {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.match-result.draw {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.tournament-details,
.match-details {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.tournament-details p,
.match-details p {
  margin: 0.5rem 0;
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.club-card {
  background: var(--card-gradient);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.club-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.club-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.club-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.club-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 700;
}

.club-joined {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

h1,
h2 {
  color: var(--text-primary);
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
