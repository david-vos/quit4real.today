// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import WallOfShame from '../components/WallOfShame.vue'; // Your home component
import AddSubscription from '../components/AddSubscription.vue'; // Your new component

const routes = [
    {
        path: '/',
        name: 'Home',
        component: WallOfShame,
    },
    {
        path: '/add-subscription',
        name: 'AddSubscription',
        component: AddSubscription,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
