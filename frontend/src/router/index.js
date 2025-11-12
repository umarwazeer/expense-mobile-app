// ✅ src/router/index.js

import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(), // no process.env (prevents "process is not defined" error)
    routes,
  })

  // ✅ Global Auth Guard
  Router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      next('/auth/login')
    } else {
      next()
    }
  })

  return Router
})
