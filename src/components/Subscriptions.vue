<template>
  <div class="app-container">
    <Sidebar @add-subscription="togglePopup" />

    <main class="main-content">
      <Notification />

      <header class="header">
        <h1 class="title">Active Subscriptions</h1>
        <button @click="togglePopup" class="add-button">
          <PlusIcon class="icon" />
          Add Subscription
        </button>
      </header>

      <div  class="table-container">
        <table v-if="subscriptions && subscriptions.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Game</th>
              <th>Platform</th>
              <th>Current playtime</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subscriptions" :key="sub.ID" class="shame">
              <td @click="handleClick(sub.platform_user_id)">
                {{ sub.display_name }}
              </td>
              <td @click="handleClick(sub.platform_game_id)">
                {{ sub.game_name }}
              </td>
              <td>{{ sub.platform_id }}</td>
              <td>{{ formatPlayTime(sub.played_amount) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-else-if="loading" class="loading-state">
          <p>Loading subscriptions...</p>
        </div>

        <div v-else class="empty-state">
          <ClipboardListIcon class="empty-icon" />
          <h3>No Fails Yet</h3>
          <p>{{ subscriptions === null ? "Start by adding a game subscription to track" : "No one has failed yet. Keep it up!" }}</p>
          <button v-if="subscriptions === null" @click="togglePopup" class="add-button">
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
import {onMounted, ref} from 'vue'
import {ClipboardListIcon, PlusIcon} from 'lucide-vue-next'
import {addNotification} from '../notificationService'
import Sidebar from "./Sidebar.vue";
import Notification from "./Notification.vue";
import AddSubscription from "./AddSubscription.vue";

const showPopup = ref(false)

const subscriptions = ref(null)
const loading = ref(true)

onMounted(async () => {
  await fetchSubscriptions()
})

async function fetchSubscriptions() {
  const apiUrl = import.meta.env.VITE_APP_API_URL
  try {
    const response = await fetch(`${apiUrl}/subscriptions`)
    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions')
    }
    subscriptions.value = await response.json()
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    addNotification('error', 'Failed to load subscriptions')
  } finally {
    loading.value = false
  }
}

function formatPlayTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

function togglePopup() {
  showPopup.value = !showPopup.value
}

function handleClick(id) {
  console.log(`Clicked ID: ${id}`)
}

// Debug notification
addNotification('debug', 'This website is still in Pre-Alpha bugs will happen!')

</script>

<style scoped>

.app-container {
  display: flex;
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


</style>