<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
      <h2 class="text-2xl font-bold text-center text-green-700 mb-6">Login Kurir</h2>

      <form @submit.prevent="loginKurir" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>

      <p v-if="errorMessage" class="text-sm text-red-500 mt-4 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginKurir',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async loginKurir() {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login-courier', {
          email: this.email,
          password: this.password
        });

        const token = res.data.token;
        if (!token) {
          this.errorMessage = 'Token tidak ditemukan di response.';
          return;
        }

        sessionStorage.setItem('courier_token', token);
        this.$router.push('/kurir');
      } catch (err) {
        console.error('Login gagal:', err);
        this.errorMessage = err.response?.data?.message || 'Login gagal. Coba lagi.';
      }
    }
  },
  mounted() {
    const token = sessionStorage.getItem('courier_token');
    if (token) {
      this.$router.push('/kurir');
    }
  }
};
</script>

<style scoped>
body {
  background-color: #f7fafc;
}
</style>
