<template>
  <div class="table-container">
    <table>
      <thead>
      <tr>
        <th>Player</th>
        <th>Game</th>
        <th>Play Count</th>
        <th>Last Played</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="player in fails" :key="player.id">
        <td>{{ player.steam_id }}</td>
        <td>{{ player.game_id }}</td>
        <td>{{ player.played_time }}</td>
        <td>{{ formatDate(player.failed_at) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    fails: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleString(undefined, options);
    },
  },
};
</script>

<style scoped>
/* No scoped styles needed as global styles handle everything */
</style>
