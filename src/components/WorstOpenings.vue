<template>
  <div class="worst-openings">
    <h2>📉 Openings You Struggle Against Most</h2>
    
    <div v-if="!hasOpeningData" class="no-data">
      <p>No opening data available. Historical games are needed to analyze opening performance.</p>
    </div>
    
    <div v-else class="worst-openings-content">
      <!-- Sorting Controls -->
      <div class="controls">
        <div class="sort-options">
          <label>Sort by:</label>
          <select v-model="sortBy" @change="updateWorstOpenings">
            <option value="losses">Most Losses</option>
            <option value="winRate">Lowest Win Rate</option>
            <option value="games">Most Games Played</option>
            <option value="lossRate">Highest Loss Rate</option>
          </select>
        </div>
        
        <div class="color-filter">
          <label>Show:</label>
          <select v-model="colorFilter" @change="updateWorstOpenings">
            <option value="combined">All Games</option>
            <option value="white">As White</option>
            <option value="black">As Black</option>
          </select>
        </div>
        
        <div class="min-games-filter">
          <label>Min games:</label>
          <input 
            v-model.number="minGames" 
            type="number" 
            min="1" 
            max="50" 
            @input="updateWorstOpenings"
          />
        </div>
      </div>

      <!-- Worst Openings List -->
      <div class="openings-list">
        <div 
          v-for="(opening, index) in worstOpenings" 
          :key="`${colorFilter}-${opening.opening}`"
          class="opening-item"
          :class="{ 'highlight-worst': index < 3 }"
        >
          <div class="opening-header">
            <div class="opening-info">
              <h3 class="opening-name">
                <span class="rank">#{{ index + 1 }}</span>
                {{ opening.opening }}
                <span v-if="opening.eco" class="eco-code">({{ opening.eco }})</span>
              </h3>
              <div class="color-indicator" v-if="colorFilter === 'combined'">
                <span v-if="opening.color === 'white'">🤍 White</span>
                <span v-else-if="opening.color === 'black'">🖤 Black</span>
                <span v-else>🔄 Combined</span>
              </div>
            </div>
            
            <div class="performance-summary">
              <div class="main-stat">
                <span v-if="sortBy === 'losses'" class="stat-value loss-count">
                  {{ opening.losses }} losses
                </span>
                <span v-else-if="sortBy === 'winRate'" class="stat-value win-rate" :class="getWinRateClass(opening.winRate)">
                  {{ opening.winRate }}% win rate
                </span>
                <span v-else-if="sortBy === 'lossRate'" class="stat-value loss-rate">
                  {{ getLossRate(opening) }}% loss rate
                </span>
                <span v-else class="stat-value">
                  {{ opening.games }} games
                </span>
              </div>
            </div>
          </div>
          
          <div class="opening-details">
            <div class="stats-grid">
              <div class="stat-box">
                <span class="stat-label">Games</span>
                <span class="stat-value">{{ opening.games }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Wins</span>
                <span class="stat-value win">{{ opening.wins }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Losses</span>
                <span class="stat-value loss">{{ opening.losses }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Draws</span>
                <span class="stat-value draw">{{ opening.draws }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Win Rate</span>
                <span class="stat-value" :class="getWinRateClass(opening.winRate)">{{ opening.winRate }}%</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Loss Rate</span>
                <span class="stat-value loss-rate">{{ getLossRate(opening) }}%</span>
              </div>
            </div>
            
            <!-- Performance Analysis -->
            <div class="performance-analysis">
              <div class="analysis-item">
                <strong>Performance:</strong>
                <span :class="getPerformanceClass(opening)">
                  {{ getPerformanceText(opening) }}
                </span>
              </div>
              <div class="analysis-item">
                <strong>Recommendation:</strong>
                <span class="recommendation">
                  {{ getRecommendation(opening) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="summary-stats" v-if="worstOpenings.length > 0">
        <h3>📊 Analysis Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Worst Opening:</span>
            <span class="summary-value">{{ worstOpenings[0]?.opening }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Losses in Worst {{ Math.min(5, worstOpenings.length) }}:</span>
            <span class="summary-value loss">{{ getTotalLosses() }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Average Win Rate (Worst {{ Math.min(5, worstOpenings.length) }}):</span>
            <span class="summary-value" :class="getWinRateClass(getAverageWinRate())">{{ getAverageWinRate() }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useChessStore } from '@/stores/chess'
import type { OpeningStats } from '@/types/chess'

const chessStore = useChessStore()

// Reactive refs for controls
const sortBy = ref<'losses' | 'winRate' | 'games' | 'lossRate'>('losses')
const colorFilter = ref<'combined' | 'white' | 'black'>('combined')
const minGames = ref(3)

// Computed for data availability
const hasOpeningData = computed(() => {
  return chessStore.coloredOpeningStats && 
    (chessStore.coloredOpeningStats.combined.length > 0 || 
     chessStore.coloredOpeningStats.white.length > 0 || 
     chessStore.coloredOpeningStats.black.length > 0)
})

// Get openings based on color filter
const filteredOpenings = computed(() => {
  if (!hasOpeningData.value) return []
  
  switch (colorFilter.value) {
    case 'white':
      return chessStore.coloredOpeningStats.white
    case 'black':
      return chessStore.coloredOpeningStats.black
    case 'combined':
    default:
      return chessStore.coloredOpeningStats.combined
  }
})

// Computed worst openings
const worstOpenings = ref<OpeningStats[]>([])

const updateWorstOpenings = () => {
  let openings = filteredOpenings.value
    .filter(opening => opening.games >= minGames.value)
  
  switch (sortBy.value) {
    case 'losses':
      openings = openings.sort((a, b) => b.losses - a.losses)
      break
    case 'winRate':
      openings = openings.sort((a, b) => a.winRate - b.winRate)
      break
    case 'games':
      openings = openings.sort((a, b) => b.games - a.games)
      break
    case 'lossRate':
      openings = openings.sort((a, b) => getLossRate(b) - getLossRate(a))
      break
  }
  
  worstOpenings.value = openings.slice(0, 15) // Show top 15 worst
}

// Watch for changes and update
watch([filteredOpenings, sortBy, minGames], updateWorstOpenings, { immediate: true })

// Helper functions
const getLossRate = (opening: OpeningStats): number => {
  if (opening.games === 0) return 0
  return Math.round((opening.losses / opening.games) * 100)
}

const getWinRateClass = (winRate: number): string => {
  if (winRate >= 60) return 'excellent'
  if (winRate >= 50) return 'good'
  if (winRate >= 40) return 'average'
  return 'poor'
}

const getPerformanceClass = (opening: OpeningStats): string => {
  const lossRate = getLossRate(opening)
  if (lossRate >= 60) return 'very-poor'
  if (lossRate >= 50) return 'poor'
  if (lossRate >= 40) return 'below-average'
  return 'average'
}

const getPerformanceText = (opening: OpeningStats): string => {
  const lossRate = getLossRate(opening)
  const winRate = opening.winRate
  
  if (lossRate >= 60) return 'Very Poor - Major Weakness'
  if (lossRate >= 50) return 'Poor - Needs Attention'
  if (winRate < 30) return 'Struggling - Consider Avoiding'
  if (winRate < 40) return 'Below Average'
  return 'Could Improve'
}

const getRecommendation = (opening: OpeningStats): string => {
  const lossRate = getLossRate(opening)
  const winRate = opening.winRate
  
  if (lossRate >= 60 || winRate < 25) {
    return 'Study theory intensively or consider avoiding this opening'
  } else if (lossRate >= 50 || winRate < 35) {
    return 'Practice tactical patterns and review your games in this opening'
  } else if (winRate < 45) {
    return 'Review your typical mistakes and improve your understanding'
  } else {
    return 'Minor improvements needed - analyze recent losses'
  }
}

// Summary functions
const getTotalLosses = (): number => {
  return worstOpenings.value
    .slice(0, 5)
    .reduce((sum, opening) => sum + opening.losses, 0)
}

const getAverageWinRate = (): number => {
  const worst5 = worstOpenings.value.slice(0, 5)
  if (worst5.length === 0) return 0
  
  const avgWinRate = worst5.reduce((sum, opening) => sum + opening.winRate, 0) / worst5.length
  return Math.round(avgWinRate)
}
</script>

<style scoped>
.worst-openings {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.controls > div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls label {
  font-weight: 500;
  color: #495057;
}

.controls select,
.controls input {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
}

.controls input[type="number"] {
  width: 80px;
}

.openings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.opening-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.opening-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #007bff;
}

.opening-item.highlight-worst {
  border-left: 4px solid #dc3545;
  background: linear-gradient(90deg, #fff5f5 0%, white 100%);
}

.opening-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.opening-info {
  flex: 1;
}

.opening-name {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rank {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.eco-code {
  background: #6c757d;
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: normal;
}

.color-indicator {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}

.performance-summary {
  text-align: right;
}

.main-stat .stat-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.main-stat .loss-count {
  color: #dc3545;
}

.main-stat .loss-rate {
  color: #dc3545;
}

.opening-details {
  padding: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: bold;
  font-size: 1rem;
}

.stat-value.win {
  color: #28a745;
}

.stat-value.loss {
  color: #dc3545;
}

.stat-value.draw {
  color: #fd7e14;
}

.stat-value.loss-rate {
  color: #dc3545;
}

.stat-value.excellent {
  color: #28a745;
}

.stat-value.good {
  color: #20c997;
}

.stat-value.average {
  color: #fd7e14;
}

.stat-value.poor {
  color: #dc3545;
}

.performance-analysis {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e9ecef;
}

.analysis-item {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.analysis-item strong {
  color: #495057;
  min-width: 120px;
}

.very-poor {
  color: #721c24;
  background: #f8d7da;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.poor {
  color: #856404;
  background: #fff3cd;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.below-average {
  color: #0c5460;
}

.recommendation {
  color: #495057;
  font-style: italic;
}

.summary-stats {
  margin-top: 2rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 6px;
  border-left: 4px solid #2196f3;
}

.summary-stats h3 {
  margin: 0 0 1rem 0;
  color: #1976d2;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.summary-label {
  font-weight: 500;
  color: #495057;
}

.summary-value {
  font-weight: bold;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .controls > div {
    justify-content: space-between;
  }
  
  .opening-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .performance-summary {
    text-align: left;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>