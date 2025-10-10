<template>
  <div class="rating-card" :style="{ borderLeftColor: color }">
    <div class="rating-header">
      <h3>{{ title }}</h3>
      <div class="rating-value" :style="{ color }">{{ rating }}</div>
    </div>

    <div v-if="record" class="rating-record">
      <div class="record-item">
        <span class="record-label">Wins:</span>
        <span class="record-value win">{{ record.win }}</span>
      </div>
      <div class="record-item">
        <span class="record-label">Losses:</span>
        <span class="record-value loss">{{ record.loss }}</span>
      </div>
      <div class="record-item">
        <span class="record-label">Draws:</span>
        <span class="record-value draw">{{ record.draw }}</span>
      </div>
      <div class="record-item total">
        <span class="record-label">Total:</span>
        <span class="record-value">{{ totalGames }}</span>
      </div>
      <div class="win-percentage">Win Rate: {{ winPercentage }}%</div>
      <div class="win-rate-bar">
        <div
          class="bar-segment win-segment"
          :style="{ width: `${winPercentage}%` }"
          title="Wins"
        ></div>
        <div
          class="bar-segment loss-segment"
          :style="{ width: `${lossPercentage}%` }"
          title="Losses"
        ></div>
        <div
          class="bar-segment draw-segment"
          :style="{ width: `${drawPercentage}%` }"
          title="Draws"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameRecord } from '@/types/chess';

interface Props {
  title: string;
  rating: number;
  record?: GameRecord;
  color: string;
}

const props = defineProps<Props>();

const totalGames = computed(() => {
  if (!props.record) return 0;
  return props.record.win + props.record.loss + props.record.draw;
});

const winPercentage = computed(() => {
  if (!props.record || totalGames.value === 0) return 0;
  return Math.round((props.record.win / totalGames.value) * 100);
});

const lossPercentage = computed(() => {
  if (!props.record || totalGames.value === 0) return 0;
  return Math.round((props.record.loss / totalGames.value) * 100);
});

const drawPercentage = computed(() => {
  if (!props.record || totalGames.value === 0) return 0;
  return Math.round((props.record.draw / totalGames.value) * 100);
});
</script>

<style scoped>
.rating-card {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border-left: 6px solid;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.rating-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rating-card:hover::before {
  opacity: 1;
}

.rating-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.rating-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rating-value {
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.rating-record {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.record-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.record-item.total {
  border-top: none;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 700;
  background: var(--card-gradient);
  box-shadow: var(--shadow-sm);
}

.record-label {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 600;
}

.record-value {
  font-weight: 700;
  font-size: 1.2rem;
}

.record-value.win {
  color: #10b981;
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.record-value.loss {
  color: #ef4444;
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
}

.record-value.draw {
  color: #f59e0b;
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.3);
}

.win-percentage {
  text-align: center;
  padding: 1rem;
  background: var(--card-gradient);
  border-radius: var(--radius-md);
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.win-percentage:hover {
  transform: scale(1.02);
}

.win-rate-bar {
  display: flex;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-top: 1rem;
  background: var(--bg-tertiary);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bar-segment {
  height: 100%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.bar-segment::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
}

.win-segment {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.loss-segment {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.draw-segment {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

@media (max-width: 480px) {
  .rating-card {
    padding: 1.5rem;
  }

  .rating-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .rating-header h3 {
    font-size: 1.2rem;
  }

  .rating-value {
    font-size: 2rem;
  }
}
</style>
