import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import UserList from './components/UserList.vue';
import UserDetails from './components/UserDetails.vue'; // Import the new UserDetails component
import NotFound from './components/NotFound.vue'; // Optional, for 404 pages

const routes = [
  { path: '/', redirect: '/login' }, // Redirect root to /login
  { path: '/login', component: LoginForm },
  {
    path: '/users',
    component: UserList,
    meta: { requiresAuth: true } // نیاز به احراز هویت
  },
  {
    path: '/user/:id',
    component: UserDetails,
    name: 'UserDetails',
    meta: { requiresAuth: true } // نیاز به احراز هویت
  },
  { path: '/:pathMatch(.*)*', component: NotFound } // Catch-all route for 404
];

const router = createRouter({
  history: createWebHistory(), // Enables history mode (no # in URL)
  routes,
});

// Navigation Guard برای بررسی احراز هویت
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // بررسی لاگین
  if (to.meta.requiresAuth && !isAuthenticated) {
    // اگر کاربر لاگین نکرده باشد، به صفحه لاگین هدایت شود
    next({ path: '/login' });
  } else {
    // در غیر این صورت، به مسیر مورد نظر بروید
    next();
  }
});

export default router;