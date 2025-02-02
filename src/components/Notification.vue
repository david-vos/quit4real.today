<template>
  <div class="notifications-container">
    <div
        v-for="(notification, index) in notifications"
        :key="index"
        :class="['notification', notification.type]"
        @click="removeNotification(index)"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { notifications } from '../notificationService.js'; // Import reactive state

// No need to define addNotification or removeNotification here.
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.notification {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  animation: fade-in-out 3s forwards;
}

.notification.success {
  background-color: #4caf50;
}

.notification.warning {
  background-color: #ff9800;
}

.notification.error {
  background-color: #f44336;
}

.notification.debug {
  background-color: #2196f3;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  10% {
    opacity: 1;
    transform: translateX(0);
  }
  90% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
