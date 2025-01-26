<template>
  <div class="layout-container">
    <!-- Button to open the Add Subscription popup -->
    <div class="button-container">
      <button @click="togglePopup">Add Subscription</button>
    </div>

    <!-- Table displaying leaderboard data -->
    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>Player</th>
          <th>Game</th>
          <th>Play Count</th>
          <th>Last Played</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="player in fails" :key="player.id">
          <td @click="handleClick(player.platform_user_id)">
            {{ player.display_name }}
          </td>
          <td @click="handleClick(player.platform_game_id)">
            {{ player.game_name }}
          </td>
          <td>
            {{ player.duration_minutes + " minutes" }}
          </td>
          <td>
            {{ timeAgo(player.timestamp) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Modal -->
    <div v-if="showPopup" class="popup-overlay" @click.self="togglePopup">
      <div class="popup-content">
        <add-subscription @close="togglePopup" :close-popup="togglePopup" />
      </div>
    </div>
  </div>
</template>

<script>
import AddSubscription from './AddSubscription.vue';

export default {
  components: {
    AddSubscription,
  },
  data() {
    return {
      fails: [], // Holds leaderboard data fetched from the server
      showPopup: false, // Tracks the visibility of the popup
    };
  },
  async created() {
    // Fetch leaderboard data on component creation
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    try {
      const response = await fetch(`${apiUrl}/fail/leaderboard`);
      if (!response.ok) {
        console.error("Failed to fetch leaderboard data");
        return;
      }
      this.fails = await response.json(); // Store fetched data in the fails array
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  },
  methods: {
    /**
     * Converts a timestamp to a relative "time ago" string.
     * @param {string} date - The date string to convert.
     * @returns {string} - A human-readable time ago string.
     */
    timeAgo(date) {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      let interval = Math.floor(seconds / 31536000);
      if (interval > 1) return `${interval} years ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) return `${interval} months ago`;
      interval = Math.floor(seconds / 86400);
      if (interval > 1) return `${interval} days ago`;
      interval = Math.floor(seconds / 3600);
      if (interval > 1) return `${interval} hours ago`;
      interval = Math.floor(seconds / 60);
      if (interval > 1) return `${interval} minutes ago`;
      return `${seconds} seconds ago`;
    },

    /**
     * Handles cell click events by logging the ID.
     * @param {string} id - The ID to log on click.
     */
    handleClick(id) {
      console.log(`Clicked ID: ${id}`);
    },

    /**
     * Toggles the visibility of the Add Subscription popup.
     */
    togglePopup() {
      this.showPopup = !this.showPopup;
    },
  },
};
</script>

<style scoped>
/* Layout container for button and table */
.layout-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Button container styling */
.button-container {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: var(--highlight-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e66a00;
}

/* Popup overlay styling */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Popup content styling */
.popup-content {
  background: var(--header-bg-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  width: 50%;
}
</style>
