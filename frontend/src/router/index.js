// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes
});

// GLOBAL AUTH GUARD
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/auth/login');
  }

  next();
});

export default router;
