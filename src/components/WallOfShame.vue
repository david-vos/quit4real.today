<template>
  <div class="wall-of-shame">
    <Notification />

    <header class="header">
      <h1 class="title">WALL OF SHAME</h1>
      <button @click="$emit('toggle-add-subscription')" class="add-button">
        <PlusIcon class="icon" />
        <span class="button-text">Add Subscription</span>
      </button>
    </header>

    <div class="content-container">
      <table v-if="fails && fails.length > 0">
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

      <EmptyState
          v-else
          title="No Fails Yet"
          :message="fails === null ? 'Start by adding a game subscription to track' : 'No one has failed yet. Keep it up!'"
          :showButton="fails === null"
          buttonText="Add Your First Subscription"
          @action="$emit('toggle-add-subscription')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlusIcon } from 'lucide-vue-next'
import Notification from "./Notification.vue"
import EmptyState from "./EmptyState.vue"
import { addNotification } from "../notificationService.js"

const fails = ref(null)

onMounted(async () => {
  await fetchLeaderboard()
})

async function fetchLeaderboard() {
  const apiUrl = import.meta.env.VITE_APP_API_URL
  try {
    const response = await fetch(`${apiUrl}/fail/leaderboard`)
    if (!response.ok) {
      console.error("Failed to fetch leaderboard data")
      addNotification('error', 'Failed to fetch leaderboard')
      return
    }
    const data = await response.json()
    fails.value = data
    console.log('Fetched data:', data)
  } catch (error) {
    console.error("Error fetching leaderboard data:", error)
    addNotification('error', "Something went wrong")
  }
}

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

addNotification('debug', 'This website is still in Pre-Alpha bugs will happen!')
</script>

<style scoped>
.wall-of-shame {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--primary), #9333EA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content-container {
  flex: 1;
  background-color: var(--surface);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: var(--primary-hover);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .button-text {
    display: none;
  }

  .add-button {
    padding: 0.75rem;
  }

  th, td {
    padding: 0.75rem;
  }
}
</style>