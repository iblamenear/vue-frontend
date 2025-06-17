import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';
import CartView from '../views/CartView.vue';
import Checkout from '../views/Checkout.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import TransaksiBerhasil from '../views/TransaksiBerhasil.vue';
import TransaksiMenunggu from '../views/TransaksiMenunggu.vue';
import TransaksiGagal from '../views/TransaksiGagal.vue';

const routes = [
  { 
    path: '/', 
    name: 'HomeView', 
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin', 
    name: 'AdminDashboard', 
    component: AdminDashboard,
    meta: { requiresAuth: true } // ⬅️ hanya bisa diakses jika login
  },
  { 
    path: '/login', 
    name: 'LoginView', 
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/cart',
    name: 'CartView',
    component: CartView,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  { path: '/transaksi-berhasil',
    component: TransaksiBerhasil
  },
  { path: '/transaksi-menunggu',
    component: TransaksiMenunggu
  },
  { path: '/transaksi-gagal',
    component: TransaksiGagal
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

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
