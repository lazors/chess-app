<template>
  <div class="recent-form" v-if="recentGames.length > 0">
    <h3>Recent Form (Last {{ displayCount }} Games)</h3>
    <div class="form-indicator">
      <div
        v-for="(game, index) in recentGames.slice(0, displayCount)"
        :key="index"
        class="game-result"
        :class="getResultClass(game)"
        :title="getResultTooltip(game)"
      >
        <span class="result-icon">{{ getResultIcon(game) }}</span>
      </div>
    </div>
    <div class="form-stats">
      <div class="form-stat">
        <span class="label">Last {{ displayCount }}:</span>
        <span class="value">
          <span class="win">{{ recentWins }}W</span>
          <span class="loss">{{ recentLosses }}L</span>
          <span class="draw">{{ recentDraws }}D</span>
        </span>
      </div>
      <div class="form-stat">
        <span class="label">Recent Win Rate:</span>
        <span class="value" :class="getWinRateClass(recentWinRate)"
          >{{ recentWinRate }}%</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChessComGame } from '@/types/chess';

interface Props {
  recentGames: ChessComGame[];
  username: string;
  displayCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  displayCount: 10,
});

const getResultClass = (game: ChessComGame): string => {
  const username = props.username.toLowerCase();
  const white = game.white.username.toLowerCase();
  const black = game.black.username.toLowerCase();

  if (white === username) {
    if (game.white.result === 'win') return 'win';
    if (game.black.result === 'win') return 'loss';
    return 'draw';
  } else {
    if (game.black.result === 'win') return 'win';
    if (game.white.result === 'win') return 'loss';
    return 'draw';
  }
};

const getResultIcon = (game: ChessComGame): string => {
  const result = getResultClass(game);
  if (result === 'win') return '✓';
  if (result === 'loss') return '✗';
  return '=';
};

const getResultTooltip = (game: ChessComGame): string => {
  const result = getResultClass(game);
  const date = new Date(game.end_time * 1000).toLocaleDateString();
  const opponent =
    game.white.username.toLowerCase() === props.username.toLowerCase()
      ? game.black.username
      : game.white.username;
  return `${result.toUpperCase()} vs ${opponent} (${date})`;
};

const recentWins = computed(() => {
  return props.recentGames
    .slice(0, props.displayCount)
    .filter((game) => getResultClass(game) === 'win').length;
});

const recentLosses = computed(() => {
  return props.recentGames
    .slice(0, props.displayCount)
    .filter((game) => getResultClass(game) === 'loss').length;
});

const recentDraws = computed(() => {
  return props.recentGames
    .slice(0, props.displayCount)
    .filter((game) => getResultClass(game) === 'draw').length;
});

const recentWinRate = computed(() => {
  const total = props.displayCount;
  if (total === 0) return 0;
  return Math.round((recentWins.value / total) * 100);
});

const getWinRateClass = (winRate: number): string => {
  if (winRate >= 60) return 'excellent';
  if (winRate >= 50) return 'good';
  if (winRate >= 40) return 'average';
  return 'poor';
};
</script>

<style scoped>
.recent-form {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow);
  transition: background-color 0.3s ease;
}

.recent-form h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.form-indicator {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.game-result {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-result:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.game-result.win {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
}

.game-result.loss {
  background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
  color: white;
}

.game-result.draw {
  background: linear-gradient(135deg, #ff9800 0%, #ffa726 100%);
  color: white;
}

.result-icon {
  font-size: 1.2rem;
}

.form-stats {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.form-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-stat .label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-stat .value {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  gap: 0.5rem;
  color: var(--text-primary);
}

.form-stat .value .win {
  color: #4caf50;
}

.form-stat .value .loss {
  color: #f44336;
}

.form-stat .value .draw {
  color: #ff9800;
}

.form-stat .value.excellent {
  color: #4caf50;
}

.form-stat .value.good {
  color: #8bc34a;
}

.form-stat .value.average {
  color: #ff9800;
}

.form-stat .value.poor {
  color: #f44336;
}

@media (max-width: 768px) {
  .form-indicator {
    justify-content: center;
  }

  .game-result {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .form-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
