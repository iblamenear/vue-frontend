<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-center text-indigo-600 mb-2">Carne'&Co</h1>
      <h2 class="text-xl font-semibold text-center text-gray-800 mb-6">Login Admin</h2>

      <form @submit.prevent="loginAdmin" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Login sebagai Admin
        </button>

        <p v-if="error" class="text-red-600 mt-2 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginAdmin',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async loginAdmin() {
      this.error = '';
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login-admin', {
          email: this.email,
          password: this.password
        });

        const { token, role } = res.data;

        if (role !== 'admin') {
          this.error = 'Akun ini bukan admin.';
          return;
        }

        sessionStorage.setItem('admin_token', token);
        this.$router.push('/admin');
      } catch (err) {
        this.error = 'Login gagal. Periksa kembali email dan password.';
        console.error('Login admin error:', err);
      }
    }
  },
  mounted() {
    const adminToken = sessionStorage.getItem('admin_token');
    if (adminToken) {
      this.$router.push('/admin');
    }
  }
};
</script>
