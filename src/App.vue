<template>
  <div id="app" :class="{ 'sidebar-open': isSidebarOpen }">
    <Sidebar @add-subscription="toggleAddSubscriptionModal" :is-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
    <div class="main-content">
      <button class="menu-toggle" @click="toggleSidebar">
        <MenuIcon v-if="!isSidebarOpen" />
        <XIcon v-else />
      </button>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { MenuIcon, XIcon } from 'lucide-vue-next'

const showAddSubscriptionModal = ref(false)
const isSidebarOpen = ref(false)

function toggleAddSubscriptionModal() {
  showAddSubscriptionModal.value = !showAddSubscriptionModal.value
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style>
@import './assets/global.css';

.main-content {
  flex: 1;
  padding: 1rem;
  transition: margin-left 0.3s ease;
}

.menu-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-toggle:hover {
  background-color: var(--primary-hover);
}

@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }

  .main-content {
    margin-left: 7%;
  }

  #app.sidebar-open .main-content {
    margin-left: 7%;
  }
}

</style>