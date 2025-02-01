<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
// If you need any app-wide logic, you can add it here
</script>

<style>
/* Import the global CSS */
@import './assets/global.css';

/* Any additional app-wide styles can go here */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>