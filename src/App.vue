<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="container flex items-center justify-between px-4 py-4 mx-auto">
        <router-link to="/" class="text-2xl font-bold text-indigo-600">Carne'&Co</router-link>

        <!-- Desktop Menu -->
        <nav class="hidden space-x-4 md:flex">
          <router-link 
            to="/" 
            class="px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/' }"
          >
            Beranda
          </router-link>

          <router-link 
            to="/cart" 
            class="relative px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/cart' }"
          >
            🛒 Keranjang
          </router-link>

          <template v-if="isAuthenticated">
            <button 
              @click="logout" 
              class="px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link 
              to="/login" 
              class="px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
              :class="{ 'bg-gray-100': $route.path === '/login' }"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="px-3 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Daftar
            </router-link>
          </template>
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="text-gray-600 focus:outline-none">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link 
            to="/" 
            class="block px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/' }"
            @click="showMobileMenu = false"
          >
            Beranda
          </router-link>

          <router-link 
            to="/keranjang" 
            class="block px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/keranjang' }"
            @click="showMobileMenu = false"
          >
            🛒 Keranjang
          </router-link>

          <template v-if="isAuthenticated">
            <button 
              @click="logout" 
              class="block w-full px-3 py-2 text-left text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link 
              to="/login" 
              class="block px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
              :class="{ 'bg-gray-100': $route.path === '/login' }"
              @click="showMobileMenu = false"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="block px-3 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
              @click="showMobileMenu = false"
            >
              Daftar
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="py-6 bg-white">
      <div class="container px-4 mx-auto">
        <div class="flex flex-col items-center md:flex-row md:justify-between">
          <p class="text-sm text-gray-600">&copy; {{ new Date().getFullYear() }} Carne'&Co. All rights reserved.</p>
          <div class="flex mt-4 space-x-6 md:mt-0">
            <!-- Footer icons... (dibiarkan seperti sebelumnya) -->
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import authStore from './store/authStore';

export default {
  name: 'App',
  data() {
    return {
      showMobileMenu: false
    };
  },
  computed: {
    isAuthenticated() {
      return authStore.state.isAuthenticated;
    }
  },
  methods: {
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    logout() {
      authStore.actions.logout();
      if (this.$route.meta.requiresAuth) {
        this.$router.push('/login');
      }
      this.showMobileMenu = false;
    }
  }
};
</script>

<style>
@import './assets/tailwind.css';

body {
  font-family: 'Inter', sans-serif;
}

.router-link-active {
  font-weight: 600;
}
</style>
