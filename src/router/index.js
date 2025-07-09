import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';
import CartView from '../views/CartView.vue';
import Checkout from '../views/Checkout.vue';
import UserProfile from '../views/UserProfile.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import TransaksiBerhasil from '../views/TransaksiBerhasil.vue';
import TransaksiMenunggu from '../views/TransaksiMenunggu.vue';
import TransaksiGagal from '../views/TransaksiGagal.vue';
import OrderHistory from '../views/OrderHistory.vue';
import LoginAdmin from '../views/LoginAdmin.vue';
import DashboardKurir from '../views/DashboardKurir.vue';
import LoginKurir from '../views/LoginKurir.vue';

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    name: 'HomeView',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAdmin: true }
  },
  {
    path: '/login',
    name: 'LoginView',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/login-admin',
    name: 'LoginAdmin',
    component: LoginAdmin,
    meta: { guest: true }
  },
  {
    path: '/kurir',
    name: 'DashboardKurir',
    component: DashboardKurir,
    meta: { requiresCourier: true }
  },
  {
    path: '/login-kurir',
    name: 'LoginKurir',
    component: LoginKurir,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: Register,
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
  {
    path: '/order',
    name: 'OrderHistory',
    component: OrderHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  { path: '/transaksi-berhasil', component: TransaksiBerhasil },
  { path: '/transaksi-menunggu', component: TransaksiMenunggu },
  { path: '/transaksi-gagal', component: TransaksiGagal },
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

router.beforeEach((to, from, next) => {
  const isUser = !!localStorage.getItem('token');
  const isAdmin = !!sessionStorage.getItem('admin_token');
  const isCourier = !!sessionStorage.getItem('courier_token');

  // Akses admin (harus admin)
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/login-admin');
  }

  // Akses user (harus user)
  if (to.meta.requiresAuth && !isUser) {
    return next('/login');
  }

  // Akses kurir (harus kurir)
  if (to.meta.requiresCourier && !isCourier) {
    console.log('Anda harus login sebagai kurir!');
    return next('/login-kurir');
  }

  // Guest routes (login/register)
  if (to.meta.guest) {
    if (to.path === '/login' && isUser) return next('/home');
    if (to.path === '/login-admin' && isAdmin) return next('/admin');
    if (to.path === '/login-kurir' && isCourier) return next('/kurir');
  }

  return next();
});

export default router;
