<template>
  <nav class="sidebar">
    <h2 class="nav-title">Navigation</h2>
    <router-link to="/" class="nav-link active">Wall of Shame</router-link>
    <button @click="$emit('add-subscription')" class="add-button">
      <PlusIcon class="icon" />
      Add Subscription
    </button>
  </nav>
</template>

<script setup>
import { PlusIcon } from 'lucide-vue-next'
</script>

<style>
.sidebar {
  width: 250px;
  padding: 2rem;
  background-color: var(--surface);
  border-right: 1px solid var(--border);
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

.nav-link:hover, .nav-link.active {
  background-color: var(--surface-hover);
}
</style>