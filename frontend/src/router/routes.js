const routes = [
  // 🔹 Authentication Pages (no MainLayout)
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/Authentication/loginPage.vue') },
      { path: 'signup', component: () => import('pages/Authentication/loginPage.vue') }, // use separate signup page if needed
    ],
  },

  // 🔹 Main App (after login)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/home.vue') },
      { path: 'report', component: () => import('pages/Report.vue') },
      { path: 'stats', component: () => import('pages/stats.vue') },
      { path: 'table', component: () => import('pages/AddUser.vue') },
      { path: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'setting', component: () => import('pages/setting.vue') },
      { path: 'account', component: () => import('pages/account.vue') },
    ],
  },

  // 🔹 Error Page
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
