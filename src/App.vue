<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header (navbar) tidak muncul di halaman login, register, admin, login-admin, login-kurir -->
    <header
      v-if="
        $route.path !== '/login' &&
        $route.path !== '/register' &&
        $route.path !== '/admin' &&
        $route.path !== '/login-admin' &&
        $route.path !== '/login-kurir' &&
        $route.path !== '/kurir'
      "
      class="bg-white shadow"
    >
      <div class="container flex items-center justify-between px-4 py-4 mx-auto">
        <router-link to="/" class="text-2xl font-bold text-indigo-600">Carne'&Co</router-link>

        <!-- Desktop Menu -->
        <nav v-if="isAuthenticated" class="hidden space-x-4 md:flex items-center">
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

          <!-- Avatar Dropdown -->
          <div class="relative" v-click-outside="() => showDropdown = false">
            <button @click="toggleDropdown" class="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-300 rounded-full focus:outline-none">
              <img src="/profile.jpg" alt="Profile" class="object-cover w-10 h-10 rounded-full" />
            </button>

            <div v-if="showDropdown" class="absolute right-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-36">
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showDropdown = false"
              >
                Profile
              </router-link>
              <button
                @click="logout"
                class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
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
            to="/cart"
            class="block px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/cart' }"
            @click="showMobileMenu = false"
          >
            🛒 Keranjang
          </router-link>

          <router-link
            to="/profile"
            class="block px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            Profile
          </router-link>

          <button
            @click="logout"
            class="block w-full px-3 py-2 text-left text-gray-700 transition-colors rounded-md hover:bg-gray-100"
          >
            Logout
          </button>
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
            <!-- Footer icons bisa ditambahkan di sini -->
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
      showMobileMenu: false,
      showDropdown: false
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
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      authStore.actions.logout();
      if (this.$route.meta.requiresAuth) {
        this.$router.push('/login');
      }
      this.showDropdown = false;
      this.showMobileMenu = false;
    }
  },
  directives: {
    clickOutside: {
      bind(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      }
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
