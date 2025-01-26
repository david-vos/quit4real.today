<template>
  <div class="add-subscription-container">
    <h2>Add Subscription</h2>
    <form @submit.prevent="submitSubscription">
      <div class="form-group">
        <label for="display_name">Display Name:</label>
        <input
            type="text"
            id="display_name"
            v-model="subscription.display_name"
            required
        />
      </div>
      <div class="form-group">
        <label for="platform_user_id">Platform User ID:</label>
        <input
            type="text"
            id="platform_user_id"
            v-model="subscription.platform_user_id"
            required
        />
      </div>
      <div class="form-group">
        <label for="platform_game_id">Platform Game ID:</label>
        <input
            type="text"
            id="platform_game_id"
            v-model="subscription.platform_game_id"
            required
        />
      </div>
      <div class="form-group">
        <label for="platform_id">Platform:</label>
        <select
            id="platform_id"
            v-model="subscription.platform_id"
            required
        >
          <option value="" disabled>Select a platform</option>
          <option value="steam">Steam</option>
        </select>
        <p class="info-message">More platforms coming soon.</p>
      </div>
      <button type="submit">Add Subscription</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subscription: {
        display_name: '',
        platform_user_id: '',
        platform_game_id: '',
        platform_id: 'steam', // Default to steam
      },
    };
  },
  methods: {
    async submitSubscription() {
      try {
        const response = await fetch('http://localhost:8080/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.subscription),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Subscription added:', data);
// Optionally, redirect or show a success message
      } catch (error) {
        console.error('Error adding subscription:', error);
      }
    },
  },
};
</script>

<style scoped>
.add-subscription-container {
  margin: 20px auto;
  padding: 6%;
  background-color: var(--table-row-color);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

h2 {
  text-align: center;
  color: var(--highlight-color);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
}

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--highlight-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e66a00; /* Slightly darker on hover */
}

.info-message {
  font-size: 0.9rem;
  color: #b7b7b7; /* Light gray for the info message */
}
</style>