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
      <div class="win-percentage">
        Win Rate: {{ winPercentage }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameRecord } from '@/types/chess'

interface Props {
  title: string
  rating: number
  record?: GameRecord
  color: string
}

const props = defineProps<Props>()

const totalGames = computed(() => {
  if (!props.record) return 0
  return props.record.win + props.record.loss + props.record.draw
})

const winPercentage = computed(() => {
  if (!props.record || totalGames.value === 0) return 0
  return Math.round((props.record.win / totalGames.value) * 100)
})
</script>

<style scoped>
.rating-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rating-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rating-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.rating-value {
  font-size: 2rem;
  font-weight: bold;
}

.rating-record {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.record-item.total {
  border-top: 1px solid #eee;
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  font-weight: 600;
}

.record-label {
  color: #666;
  font-size: 0.9rem;
}

.record-value {
  font-weight: 600;
}

.record-value.win {
  color: #4CAF50;
}

.record-value.loss {
  color: #f44336;
}

.record-value.draw {
  color: #FF9800;
}

.win-percentage {
  text-align: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

@media (max-width: 480px) {
  .rating-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .rating-value {
    font-size: 1.5rem;
  }
}
</style>