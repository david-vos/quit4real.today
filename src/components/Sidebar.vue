<template>
  <div class="sidebar">
    <h2>Navigation</h2>
    <ul>
      <li>
        <router-link to="/">Wall of Shame</router-link><br><br>
      </li>
      <li>
        <router-link class="AddButton" to="/add-subscription">Add Subscription</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: var(--header-bg-color);
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  height: 100vh;
}

.sidebar h2 {
  color: var(--highlight-color);
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.AddButton {
  color: white;
  padding: 10px;
  border-radius: 8px;
  background-color: var(--highlight-color);
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  color: var(--text-color);
  text-decoration: none;
}

.sidebar a:hover {
  color: var(--highlight-color);
}
</style>
