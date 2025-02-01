<template>
  <div class="app-container">
    <Sidebar @add-subscription="togglePopup" />

    <main class="main-content">
      <Notification />

      <header class="header">
        <h1 class="title">WALL OF SHAME</h1>
        <button @click="togglePopup" class="add-button">
          <PlusIcon class="icon" />
          Add Subscription
        </button>
      </header>

      <div class="table-container">
        <table v-if="fails.length > 0">
          <thead>
          <tr>
            <th>PLAYER</th>
            <th>GAME</th>
            <th>PLAY COUNT</th>
            <th>LAST PLAYED</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="player in fails" :key="player.id"
              :class="{ 'shame': player.duration_minutes > 0 }">
            <td @click="handleClick(player.platform_user_id)">
              {{ player.display_name }}
            </td>
            <td @click="handleClick(player.platform_game_id)">
              {{ player.game_name }}
            </td>
            <td>{{ player.duration_minutes + " minutes" }}</td>
            <td>{{ timeAgo(player.timestamp) }}</td>
          </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <ClipboardListIcon class="empty-icon" />
          <h3>No Subscriptions Yet</h3>
          <p>Start by adding a game subscription to track</p>
          <button @click="togglePopup" class="add-button">
            Add Your First Subscription
          </button>
        </div>
      </div>
    </main>

    <div v-if="showPopup" class="popup-overlay" @click.self="togglePopup">
      <div class="popup-content">
        <AddSubscription @close="togglePopup" :close-popup="togglePopup" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlusIcon, ClipboardListIcon } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'
import AddSubscription from './AddSubscription.vue'
import Notification from "./Notification.vue"
import { addNotification } from "./notificationService.js"

const fails = ref([])
const showPopup = ref(false)

onMounted(async () => {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  try {
    console.log('Fetching from:', `${apiUrl}/fail/leaderboard`);
    const response = await fetch(`${apiUrl}/fail/leaderboard`);
    console.log('Response status:', response.status);
    if (!response.ok) {
      console.error("Failed to fetch leaderboard data");
      addNotification('error', 'Failed to fetch leaderboard');
      return;
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    fails.value = data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    addNotification('error', "Something went wrong");
  }
})

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return `${interval} years ago`
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return `${interval} months ago`
  interval = Math.floor(seconds / 86400)
  if (interval > 1) return `${interval} days ago`
  interval = Math.floor(seconds / 3600)
  if (interval > 1) return `${interval} hours ago`
  interval = Math.floor(seconds / 60)
  if (interval > 1) return `${interval} minutes ago`
  return `${seconds} seconds ago`
}

function handleClick(id) {
  console.log(`Clicked ID: ${id}`)
}

function togglePopup() {
  showPopup.value = !showPopup.value
}

// Debug notification
addNotification('debug', 'This website is still in Pre-Alpha bugs will happen!')
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--primary), #9333EA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.table-container {
  background-color: var(--surface);
  border-radius: 1rem;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

th {
  background-color: var(--surface-hover);
  font-weight: 600;
  color: var(--text-secondary);
}

tr {
  transition: background-color 0.2s;
}

tr:hover {
  background-color: var(--surface-hover);
}

tr.shame {
  background-color: var(--shame);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

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

.popup-content {
  background: var(--surface);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  width: 50%;
}
</style>