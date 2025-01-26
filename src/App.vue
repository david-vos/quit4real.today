<template>
  <div id="app" data-theme="dark">
    <header class="header">
      <h1 class="title">Wall of Shame</h1>
    </header>
    <div class="layout">
      <Sidebar />
      <main class="main">
        <router-view /> <!-- This will render the current route's component -->
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue"; // Import the Sidebar component
import "./style.css";

export default {
  components: {
    Sidebar, // Register the Sidebar component
  },
};
</script>

<style>
/* Main layout */
.layout {
  display: flex;
}

.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}
</style>
