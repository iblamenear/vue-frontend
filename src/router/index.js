import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { 
    path: '/', 
    name: 'HomeView', 
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'LoginView', 
    component: Login,
    meta: { guest: true }
  },
  { 
    path: '/register', 
    name: 'RegisterView', 
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Jika route memerlukan auth dan user belum login, redirect ke login
    next('/login');
  } else if (to.meta.guest && isAuthenticated) {
    // Jika route untuk guest dan user sudah login, redirect ke home
    next('/');
  } else {
    // Jika tidak ada kondisi khusus, lanjutkan navigasi
    next();
  }
});

export default router;