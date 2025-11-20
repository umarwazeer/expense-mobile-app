// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import pinia from './stores';
import i18n from './i18n';

const app = createApp(App);

// Register plugins
app.use(pinia);
app.use(router);
app.use(i18n);

app.mount('#app');
