<template>
  <nav class="sidebar" :class="{ 'open': isOpen }">
    <h2 class="nav-title">Navigation</h2>
    <router-link to="/" class="nav-link" exact-active-class="active">Wall of Shame</router-link>
    <router-link to="/subscriptions" class="nav-link" active-class="active">Subscriptions</router-link>
    <router-link to="/user" class="nav-link" active-class="active">Profile</router-link>
    <button @click="$emit('add-subscription')" class="add-button">
      <PlusIcon class="icon" />
      Add Subscription
    </button>
  </nav>
</template>

<script setup>
import { PlusIcon } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add-subscription', 'toggle-sidebar'])
</script>

<style scoped>
.sidebar {
  width: 10%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--surface);
  border-right: 1px solid var(--border);
  padding: 2rem;
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.nav-title {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.nav-link {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text);
  text-decoration: none;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.add-button:hover {
  background-color: var(--primary-hover);
}

@media (max-width: 767px) {
  .sidebar {
    transform: translateX(-100%);
    z-index: 1000;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>