<template>
  <div class="skeleton-loader">
    <div class="user-header">
      <div class="user-avatar">
        <div class="skeleton-avatar"></div>
      </div>
      <div class="user-info">
        <div class="skeleton-line" style="width: 60%;"></div>
        <div class="skeleton-line" style="width: 80%;"></div>
      </div>
    </div>

    <div class="user-stats">
      <div class="stat-card">
        <div class="skeleton-line" style="width: 100%; height: 1.5rem;"></div>
      </div>
      <div class="stat-card">
        <div class="skeleton-line" style="width: 100%; height: 1.5rem;"></div>
      </div>
      <div class="stat-card">
        <div class="skeleton-line" style="width: 100%; height: 1.5rem;"></div>
      </div>
    </div>

    <div class="activity-section">
      <h2><div class="skeleton-line" style="width: 30%; height: 1.5rem;"></div></h2>
      <div class="activity-graph">
        <div class="activity-column" v-for="index in 7" :key="index">
          <div class="activity-cell skeleton-cell" v-for="cell in 5" :key="cell"></div>
        </div>
      </div>
    </div>

    <div class="user-subscriptions">
      <h2><div class="skeleton-line" style="width: 30%; height: 1.5rem;"></div></h2>
      <div class="subscription-grid">
        <div class="subscription-card" v-for="index in 3" :key="index">
          <div class="skeleton-image"></div>
          <div class="subscription-info">
            <div class="skeleton-line" style="width: 70%;"></div>
            <div class="skeleton-line" style="width: 50%;"></div>
            <div class="skeleton-line" style="width: 30%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-loader {
  width: 100%;
  padding: 2rem;
  background-color: var(--background);
  border-radius: 0.5rem;
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

.skeleton-avatar {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  border-radius: 50%;
}

.user-info {
  flex: 1;
}

.skeleton-line {
  height: 1rem;
  background-color: #e0e0e0;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
}

.user-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.stat-card {
  flex: 1;
  margin-right: 1rem;
  background-color: var(--surface);
  padding: 1rem;
  border-radius: 0.5rem;
}

.stat-card:last-child {
  margin-right: 0;
}

.activity-section {
  background-color: var(--surface);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
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
  background-color: #e0e0e0; /* Skeleton color */
}

.user-subscriptions {
  background-color: var(--surface);
  border-radius: 0.5rem;
  padding: 1.5rem;
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

.skeleton-image {
  width: 100%;
  height: 150px;
  background-color: #e0e0e0;
}
</style> 