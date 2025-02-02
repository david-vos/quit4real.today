<template>
  <div class="add-subscription-container">
    <Notification />
    <h2 class="title">Add Subscription</h2>
    <form @submit.prevent="submitSubscription">
      <div class="form-group">
        <label for="display_name">Display Name</label>
        <input
            type="text"
            id="display_name"
            v-model="subscription.display_name"
            required
        />
        <p class="info-message">*Only for visual use</p>
      </div>

      <div class="form-group">
        <label for="platform_user_id">Platform User ID</label>
        <input
            type="text"
            id="platform_user_id"
            v-model="subscription.platform_user_id"
            required
        />
        <p class="info-message">*AccountID found in their URL, No current support for Vanity URL</p>
      </div>

      <div class="form-group">
        <label for="platform_game_id">Platform Game ID</label>
        <div class="input-wrapper">
          <input
              type="text"
              id="platform_game_id"
              v-model="searchQuery"
              @input="searchGames"
              placeholder="Search for a game..."
              autocomplete="off"
              @keydown.down.prevent="moveHighlight(1)"
              @keydown.up.prevent="moveHighlight(-1)"
              @keydown.enter.prevent="selectHighlighted"
          />
          <ul v-if="searchResults.length > 0" class="search-results">
            <li
                v-for="(game, index) in searchResults"
                :key="game.id"
                @click="selectGame(game.id)"
                :class="{ highlighted: index === highlightedIndex }"
                :ref="(el) => (searchItems[index] = el)"
            >
              {{ game.name }}
            </li>
          </ul>
        </div>
        <p class="info-message">*AppID/GameID can be found on SteamDB</p>
      </div>

      <div class="form-group">
        <label for="platform_id">Platform</label>
        <select id="platform_id" v-model="subscription.platform_id" required>
          <option value="" disabled>Select a platform</option>
          <option value="steam">Steam</option>
        </select>
        <p class="info-message">*More platforms coming soon.</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button">Add Subscription</button>
        <button type="button" @click="closePopup" class="cancel-button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, nextTick } from 'vue';
import Notification from './Notification.vue';
import { addNotification } from '../notificationService.js';

const props = defineProps({
  closePopup: {
    type: Function,
    required: true,
  },
});

const subscription = reactive({
  display_name: '',
  platform_user_id: '',
  platform_game_id: '',
  platform_id: 'steam',
});

async function submitSubscription() {
  try {
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const response = await fetch(`${apiUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (response.ok) {
      const text = await response.text();
      console.log('Subscription added:', text);
      addNotification('success', 'Subscription added successfully!');
      props.closePopup();
    } else {
      const errorText = await response.text();
      console.error('Error adding subscription:', errorText);
      addNotification('error', `Error adding subscription: ${errorText}`);
    }
  } catch (error) {
    console.error('Error adding subscription:', error);
    addNotification('error', 'Error adding subscription. Please try again.');
  }
}

const searchQuery = ref('');
const searchResults = ref([]);
const highlightedIndex = ref(0);
const searchItems = ref([]);

async function searchGames() {
  if (searchQuery.value.trim() === '' || subscription.platform_id !== 'steam') {
    searchResults.value = [];
    return;
  }

  try {
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const response = await fetch(
        `${apiUrl}/games/${encodeURIComponent(searchQuery.value)}/steam`
    );
    if (response.ok) {
      const data = await response.json();
      searchResults.value = data || [];
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error('Error searching games:', error);
    searchResults.value = [];
  }
}

function selectGame(gameId) {
  subscription.platform_game_id = gameId;
  searchQuery.value = searchResults.value.find((game) => game.id === gameId)?.name || '';
  searchResults.value = [];
  highlightedIndex.value = 0;
}

function selectHighlighted() {
  if (searchResults.value.length > 0 && highlightedIndex.value >= 0) {
    selectGame(searchResults.value[highlightedIndex.value].id);
  }
}

watch(searchQuery, (newValue) => {
  if (!newValue) {
    subscription.platform_game_id = "";
  }
});

function moveHighlight(direction) {
  if (searchResults.value.length === 0) return;

  highlightedIndex.value =
      (highlightedIndex.value + direction + searchResults.value.length) %
      searchResults.value.length;

  nextTick(() => {
    const item = searchItems.value[highlightedIndex.value];
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}
</script>

<style scoped>
.add-subscription-container {
  background-color: var(--surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background-color: var(--background);
  color: var(--text);
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary);
}

.info-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.input-wrapper {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.search-results li {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-results li:hover,
.search-results li.highlighted {
  background-color: var(--surface-hover);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button,
.cancel-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button {
  background-color: var(--primary);
  color: white;
}

.submit-button:hover {
  background-color: var(--primary-hover);
}

.cancel-button {
  background-color: var(--surface-hover);
  color: var(--text);
}

.cancel-button:hover {
  background-color: var(--border);
}
</style>