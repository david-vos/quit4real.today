<template>
  <div class="app-container">
    <Sidebar @add-subscription="togglePopup" />
    <main class="main-content">
      <Notification />
      <div class="user-page" v-if="user">
        <div class="user-header">
          <div class="user-avatar">
            <div class="avatar-placeholder">{{ user.username[0].toUpperCase() }}</div>
          </div>
          <div class="user-info">
            <h1>{{ user.username }}</h1>
            <p>{{ user.email }}</p>
          </div>
        </div>

        <div class="user-stats">
          <div class="stat-card">
            <h3>Total Fails</h3>
            <p>{{ user.totalFails }}</p>
          </div>
          <div class="stat-card">
            <h3>Longest Streak</h3>
            <p>{{ user.longestStreak }} days</p>
          </div>
          <div class="stat-card">
            <h3>Active Subscriptions</h3>
            <p>{{ user.subscriptions.length }}</p>
          </div>
        </div>

        <div class="activity-section">
          <h2>Activity</h2>
          <div class="activity-graph">
            <div v-for="(week, weekIndex) in activityData" :key="weekIndex" class="activity-column">
              <div v-for="(day, dayIndex) in week" :key="dayIndex" 
                   class="activity-cell" 
                   :style="{ backgroundColor: getActivityColor(day) }"
                   :title="`${day} fails on ${getDayLabel(weekIndex, dayIndex)}`">
              </div>
            </div>
          </div>
          <div class="activity-legend">
            <span>Less</span>
            <div class="legend-cells">
              <div class="legend-cell" v-for="(color, index) in activityColors" :key="index" :style="{ backgroundColor: color }"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        <div class="user-subscriptions">
          <h2>Subscriptions</h2>
          <div class="subscription-grid">
            <div v-for="sub in user.subscriptions" :key="sub.id" class="subscription-card">
              <img :src="sub.imageUrl" :alt="sub.game" class="game-image">
              <div class="subscription-info">
                <h3>{{ sub.game }}</h3>
                <p>{{ sub.platform }}</p>
                <p>Last played: {{ sub.lastPlayed }}</p>
                <span :class="['status', { 'status-failed': sub.status === 'Failed' }]">
                  {{ sub.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="width: 100%;">
        <SkeletonLoader class="skeleton-loader-div"/>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { addNotification } from '../notificationService' // Assuming you have a notification service
import Notification from './Notification.vue'
import Sidebar from './Sidebar.vue'
import SkeletonLoader from './SkeletonLoader.vue' // Import the SkeletonLoader component

export default {
  components: {
    Notification,
    Sidebar,
    SkeletonLoader // Register the SkeletonLoader component
  },
  setup() {
    const user = ref(null)
    const subscriptions = ref([])
    const activityData = ref([])
    const loading = ref(true)

    // Fetch user data from the API
    const fetchUserData = async () => {
      const apiUrl = import.meta.env.VITE_APP_API_URL
      try {
        const response = await fetch(`${apiUrl}/user`)
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        user.value = await response.json()
      } catch (error) {
        console.error('Error fetching user data:', error)
        addNotification('error', 'Failed to load user data')
      } finally {
        loading.value = false
      }
    }

    // Fetch subscriptions from the API
    const fetchSubscriptions = async () => {
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

    // Fetch activity data from the API
    const fetchActivityData = async () => {
      const apiUrl = import.meta.env.VITE_APP_API_URL
      try {
        const response = await fetch(`${apiUrl}/activity`)
        if (!response.ok) {
          throw new Error('Failed to fetch activity data')
        }
        activityData.value = await response.json()
      } catch (error) {
        console.error('Error fetching activity data:', error)
        addNotification('error', 'Failed to load activity data')
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      loading.value = true
      await Promise.all([fetchUserData(), fetchSubscriptions(), fetchActivityData()])
      loading.value = false
    })

    const activityColors = ['#2a2a2a', '#4a3f6b', '#5f4f8f', '#7c69b3', '#9883d7']

    const getActivityColor = (value) => {
      return activityColors[value] || activityColors[0]
    }

    const getDayLabel = (weekIndex, dayIndex) => {
      const date = new Date()
      date.setDate(date.getDate() - ((51 - weekIndex) * 7 + (6 - dayIndex)))
      return date.toLocaleDateString()
    }

    return {
      user,
      subscriptions,
      activityData,
      loading,
      activityColors,
      getActivityColor,
      getDayLabel
    }
  }
}
</script>

<style scoped>
.skeleton-loader-div {
  width: 100%; /* Ensure it takes full width */
}

.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the content */
}

.user-page {
  max-width: 1200px;
  width: 100%; /* Ensure it takes full width */
  padding: 2rem;
  color: var(--text);
  background-color: var(--background); /* Optional: Add background color */
  border-radius: 0.5rem; /* Optional: Add border radius */
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.user-avatar {
  width: 100px;
  height: 100px;
  margin-right: 2rem;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--primary);
  color: white;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.user-info h1 {
  font-size: 2.5rem;
  margin: 0;
  color: var(--primary);
}

.user-info p {
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

.user-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--surface);
  padding: 1rem;
  border-radius: 0.5rem;
  flex: 1;
  margin-right: 1rem;
  text-align: center;
}

.stat-card:last-child {
  margin-right: 0;
}

.stat-card h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.stat-card p {
  font-size: 2rem;
  margin: 0;
  color: var(--primary);
}

.activity-section {
  background-color: var(--surface);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.activity-section h2 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.activity-graph {
  display: flex;
  gap: 3px;
}

.activity-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.activity-cell {
  width: 15px;
  height: 15px;
  border-radius: 2px;
}

.activity-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.legend-cells {
  display: flex;
  gap: 3px;
  margin: 0 0.5rem;
}

.legend-cell {
  width: 15px;
  height: 15px;
  border-radius: 2px;
}

.user-subscriptions {
  background-color: var(--surface);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.user-subscriptions h2 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.subscription-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.subscription-card {
  background-color: var(--background);
  border-radius: 0.5rem;
  overflow: hidden;
}

.game-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.subscription-info {
  padding: 1rem;
}

.subscription-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary);
}

.subscription-info p {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
}

.status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: var(--primary);
  color: white;
}

.status-failed {
  background-color: #ef4444;
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-avatar {
    margin-bottom: 1rem;
  }

  .user-stats {
    flex-direction: column;
  }

  .stat-card {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .activity-graph {
    overflow-x: auto;
  }

  .subscription-grid {
    grid-template-columns: 1fr;
  }
}

/* Ensure that the skeleton elements have consistent styling */
.skeleton-line {
  background-color: #e0e0e0; /* Light gray for skeleton lines */
  border-radius: 4px; /* Rounded corners for a smoother look */
}

.skeleton-image {
  background-color: #e0e0e0; /* Light gray for skeleton images */
  height: 150px; /* Set a height for the skeleton image */
  border-radius: 4px; /* Rounded corners */
}

.skeleton-avatar {
  background-color: #e0e0e0; /* Light gray for avatar */
  border-radius: 50%; /* Circular avatar */
  width: 100px; /* Set width for avatar */
  height: 100px; /* Set height for avatar */
}

data-v-c078ba28 {
  width: 100%; /* Ensure it takes full width */
}

</style>