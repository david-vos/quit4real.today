<template>
  <div id="app" data-theme="dark">
    <header class="header">
      <h1 class="title">Wall of Shame</h1>
    </header>
    <main class="main">
      <LeaderboardTable :fails="fails" />
    </main>
  </div>
</template>

<script>
import LeaderboardTable from "./components/LeaderboardTable.vue";
import "./style.css";

export default {
  components: {
    LeaderboardTable,
  },
  data() {
    return {
      fails: [],
    };
  },
  async created() {
    const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
    try {
      const response = await fetch(`${apiUrl}/fail/leaderboard`);
      if (!response.ok) {
        console.error("Failed to fetch leaderboard data");
        return;
      }
      this.fails = await response.json();
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  },
};
</script>

<style>
/* Main layout */
.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}
</style>
