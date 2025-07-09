<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <!-- Judul Besar -->
      <h1 class="text-center text-3xl font-extrabold text-indigo-600">Carne'&Co</h1>

      <div class="text-center">
        <h2 class="mt-2 text-2xl font-bold text-gray-900">Daftar Akun</h2>
        <p class="mt-1 text-sm text-gray-600">
          Atau
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            login jika sudah memiliki akun
          </router-link>
        </p>
      </div>

      <!-- Alert Error -->
      <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 rounded-md">
        {{ error }}
      </div>

      <!-- Alert Sukses -->
      <div v-if="successMessage" class="p-3 text-sm text-green-700 bg-green-100 rounded-md">
        {{ successMessage }}
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <input
          v-model="name"
          type="text"
          required
          placeholder="Nama Lengkap"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />

        <input
          v-model="email"
          type="email"
          required
          placeholder="Email"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />

        <input
          v-model="phone"
          type="text"
          required
          placeholder="Nomor HP"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />

        <input
          v-model="address"
          type="text"
          required
          placeholder="Alamat Lengkap"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />

        <input
          v-model="password"
          type="password"
          required
          placeholder="Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />

        <button
          type="submit"
          class="flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          :disabled="loading"
        >
          <span v-if="loading" class="mr-2 animate-spin">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </span>
          {{ loading ? 'Memproses...' : 'Daftar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import authStore from '../store/authStore';

export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      loading: false,
      error: '',
      successMessage: ''
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      try {
        const userData = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          address: this.address,
          password: this.password
        };

        await authStore.actions.register(userData);
        this.successMessage = 'Registrasi berhasil! Mengarahkan ke halaman login...';

        // Tunggu sebentar lalu arahkan ke halaman login
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        this.error = error.message || 'Registrasi gagal. Silakan coba lagi.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #6366f1; /* indigo-500 */
  box-shadow: 0 0 0 1px #6366f1;
}
</style>
