import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import WallOfShame from './components/WallOfShame.vue'
import Subscriptions from './components/Subscriptions.vue'

const routes = [
    { path: '/', component: WallOfShame },
    { path: '/subscriptions', component: Subscriptions }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')