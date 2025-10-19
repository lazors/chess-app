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
        <img
          v-if="chessStore.profile?.avatar"
          :src="chessStore.profile.avatar"
          alt="User Avatar"
          class="avatar"
        />
        <div class="user-info">
          <h2>
            {{ chessStore.profile?.name || chessStore.profile?.username }}
          </h2>
          <p class="username">@{{ chessStore.profile?.username }}</p>
          <p v-if="chessStore.profile?.title" class="title">
            {{ chessStore.profile.title }}
          </p>
          <p v-if="chessStore.profile?.location" class="location">
            📍 {{ chessStore.profile.location }}
          </p>
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
        :class="{ 'input-error': usernameError }"
        @input="usernameError = null"
      />
      <p v-if="usernameError" class="error-message" role="alert" aria-live="polite">{{ usernameError }}</p>
      <button
        @click="fetchUserData"
        :disabled="!username || chessStore.isLoading"
        :aria-busy="chessStore.isLoading"
        aria-label="Load user data from Chess.com"
        type="button"
      >
        {{ chessStore.isLoading ? 'Loading...' : 'Load Data' }}
      </button>
      <button
        v-if="chessStore.hasProfile"
        @click="clearData"
        class="clear-button"
        aria-label="Clear all loaded user data"
        type="button"
      >
        Clear Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChessStore } from '@/stores/chess';
import { VALIDATION } from '@/constants/api';

const username = ref('');
const usernameError = ref<string | null>(null);
const chessStore = useChessStore();

const validateUsername = (username: string): boolean => {
  // Clear previous errors
  usernameError.value = null;

  // Check minimum length
  if (!username || username.length < VALIDATION.USERNAME_MIN_LENGTH) {
    usernameError.value = `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`;
    return false;
  }

  // Check maximum length
  if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    usernameError.value = `Username must not exceed ${VALIDATION.USERNAME_MAX_LENGTH} characters`;
    return false;
  }

  // Check valid characters (alphanumeric, underscore, hyphen)
  if (!VALIDATION.USERNAME_PATTERN.test(username)) {
    usernameError.value = 'Username can only contain letters, numbers, underscores, and hyphens';
    return false;
  }

  return true;
};

const fetchUserData = async () => {
  if (username.value && validateUsername(username.value)) {
    await chessStore.fetchAllUserData(username.value);
  }
};

const clearData = () => {
  chessStore.clearData();
  username.value = '';
  usernameError.value = null;
};
</script>

<style scoped>
.home {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}

.home h1 {
  font-size: 3rem;
  font-weight: 900;
  background: var(--bg-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -1px;
}

.home > p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  font-weight: 500;
}

.status {
  margin: 2rem 0;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.status:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.status.loading {
  background: var(--loading-bg);
  border: 2px solid var(--loading-border);
  color: var(--loading-text);
}

.status.loading p {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.status.error {
  background: var(--error-bg);
  border: 2px solid var(--error-border);
  color: var(--error-text);
}

.status.error p {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.status.success {
  background: var(--success-bg);
  border: 2px solid var(--success-border);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  text-align: left;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid var(--accent-primary);
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

.user-info h2 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 800;
}

.user-info .username {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1.1rem;
}

.user-info .title {
  margin: 0 0 0.5rem 0;
  color: #e67e22;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.25rem 0.75rem;
  background: rgba(230, 126, 34, 0.1);
  border-radius: var(--radius-md);
  display: inline-block;
}

.user-info .location {
  margin: 0;
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 500;
}

.user-input {
  margin-top: 3rem;
  background: var(--bg-secondary);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.user-input:hover {
  box-shadow: var(--shadow-xl);
}

.user-input label {
  display: block;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: left;
}

.user-input input {
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  box-sizing: border-box;
}

.user-input input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: var(--input-focus-shadow);
  transform: translateY(-2px);
}

.user-input input::placeholder {
  color: var(--text-muted);
}

.user-input input.input-error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  margin: -1rem 0 1rem 0;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-sm);
  border-left: 3px solid #ef4444;
}

.user-input button {
  padding: 1rem 2.5rem;
  background: linear-gradient(
    135deg,
    var(--accent-primary) 0%,
    var(--accent-secondary) 100%
  );
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  margin: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow);
}

.user-input button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.user-input button:active:not(:disabled) {
  transform: translateY(0);
}

.user-input button:disabled {
  background: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.clear-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
}

.clear-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
}

@media (max-width: 640px) {
  .home {
    padding: 1rem;
  }

  .home h1 {
    font-size: 2rem;
  }

  .user-profile {
    flex-direction: column;
    text-align: center;
  }

  .user-info {
    text-align: center;
  }

  .user-input {
    padding: 1.5rem;
  }

  .user-input button {
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style>
