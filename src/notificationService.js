import { reactive } from 'vue';

export const notifications = reactive([]);

export function addNotification(type, message, duration = 3000) {
    notifications.push({ type, message });

    // Automatically remove the notification after the specified duration
    setTimeout(() => {
        notifications.shift();
    }, duration);
}

export function removeNotification(index) {
    notifications.splice(index, 1);
}
