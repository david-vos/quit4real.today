<template>
  <div class="subscriptions-container">
    <header class="header">
      <h2 class="title">Subscriptions</h2>
      <button @click="$emit('toggle-add-subscription')" class="add-button">
        <PlusIcon class="icon" />
        <span class="button-text">Add Subscription</span>
      </button>
    </header>

    <div class="content-container">
      <div v-if="subscriptions && subscriptions.length > 0" class="subscription-list">
        <div v-for="sub in subscriptions" :key="sub.ID" class="subscription-item">
          <h3>{{ sub.display_name }}</h3>
          <p><strong>Game:</strong> {{ sub.game_name }}</p>
          <p><strong>Platform:</strong> {{ sub.platform_id }}</p>
          <p><strong>Played:</strong> {{ formatPlayTime(sub.played_amount) }}</p>
        </div>
      </div>
      <div v-else-if="loading" class="loading-state">
        <p>Loading subscriptions...</p>
      </div>
      <EmptyState
          v-else
          title="No Subscriptions"
          message="You haven't added any subscriptions yet."
          :showButton="true"
          buttonText="Add Your First Subscription"
          @action="$emit('toggle-add-subscription')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlusIcon } from 'lucide-vue-next'
import { addNotification } from '../notificationService'
import EmptyState from './EmptyState.vue'

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
    const data = await response.json()
    subscriptions.value = data
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
</script>

<style scoped>
.subscriptions-container {
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
  color: var(--primary);
}

.content-container {
  flex: 1;
  background-color: var(--surface);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.subscription-list {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.subscription-item {
  background-color: var(--background);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subscription-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.subscription-item p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
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

  .subscription-list {
    grid-template-columns: 1fr;
  }
}
</style>