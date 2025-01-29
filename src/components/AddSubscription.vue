<template>
  <div>
    <!-- Notification Component -->
    <Notification />

    <!-- Add Subscription Form -->
    <div class="add-subscription-container">
      <h2>Add Subscription</h2>
      <button @click="closePopup">Close</button>
      <form @submit.prevent="submitSubscription">
        <div class="form-group">
          <label for="display_name">Display Name:</label>
          <input
              type="text"
              id="display_name"
              v-model="subscription.display_name"
              required
          />
          <p class="info-message">*Only for visual use</p>
        </div>

        <div class="form-group">
          <label for="platform_user_id">Platform User ID:</label>
          <input
              type="text"
              id="platform_user_id"
              v-model="subscription.platform_user_id"
              required
          />
          <p class="info-message">*AccountID found in their URL, No current support for Vanity URL</p>
        </div>

        <div class="form-group">
          <label for="platform_game_id">Platform Game ID:</label>
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
          <label for="platform_id">Platform:</label>
          <select id="platform_id" v-model="subscription.platform_id" required>
            <option value="" disabled>Select a platform</option>
            <option value="steam">Steam</option>
          </select>
          <p class="info-message">*More platforms coming soon.</p>
        </div>

        <button type="submit">Add Subscription</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, nextTick } from 'vue';
import Notification from './Notification.vue';
import { addNotification } from './notificationService';

defineProps({
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
      body: JSON.stringify({
        display_name: subscription.display_name,
        platform_user_id: subscription.platform_user_id,
        platform_game_id: subscription.platform_game_id,
        platform_id: subscription.platform_id,
      }),  // Sending only the subscription fields as the old FE did
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Subscription added:', data);
      addNotification('success', 'Subscription added successfully!');
    } else {
      addNotification('error', 'Error adding subscription: ' + response.statusText);
      throw new Error('Network response was not ok');
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
      searchResults.value = data || []; // Handle null response
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
  margin: 20px auto;
  padding: 6%;
  background-color: var(--table-row-color);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

h2 {
  text-align: center;
  color: var(--highlight-color);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
}

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 90%;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--highlight-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e66a00; /* Slightly darker on hover */
}

.info-message {
  font-size: 0.9rem;
  color: #b7b7b7; /* Light gray for the info message */
}

.add-subscription-container {
  margin: 20px auto;
  padding: 6%;
  background-color: var(--table-row-color);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

h2 {
  text-align: center;
  color: var(--highlight-color);
}

.form-group {
  margin-bottom: 15px;
  position: relative; /* For dropdown positioning */
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
}

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box; /* Ensure dropdown matches input width */
}

.input-wrapper {
  position: relative;
}

.search-results {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  width: 100%; /* Match the input width */
  z-index: 10;
  border-radius: 4px;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
}

.search-results li:hover,
.search-results li.highlighted {
  background-color: #f0f0f0;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--highlight-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e66a00;
}

.info-message {
  font-size: 0.9rem;
  color: #b7b7b7;
}
</style>
