import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';
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
import LoginAdmin from '../views/LoginAdmin.vue'; // ✅ Tambahkan ini

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
    meta: { requiresAdmin: true } // ✅ Ganti ini
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
    meta: { guest: true } // ✅ Admin login halaman
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

// ✅ Navigation Guard yang mendukung user & admin token
router.beforeEach((to, from, next) => {
  const isUser = authService.isAuthenticated();
  const isAdmin = !!localStorage.getItem('admin_token'); // ✅ Deteksi admin token

  if (to.meta.requiresAuth && !isUser) {
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/login-admin');
  } else if (to.meta.guest && (isUser || isAdmin)) {
    next('/');
  } else {
    next();
  }
});

export default router;
