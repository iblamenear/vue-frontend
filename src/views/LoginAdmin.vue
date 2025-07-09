<template>
  <div class="max-w-md mx-auto py-10 px-4">
    <h2 class="text-2xl font-bold text-center mb-6">Login Admin</h2>

    <form @submit.prevent="loginAdmin" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium text-gray-700">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium text-gray-700">Password</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border rounded-md"
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
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password
        });

        const { token, role } = res.data;

        // ✅ Pastikan ini admin
        if (role !== 'admin') {
          this.error = 'Akun ini bukan admin.';
          return;
        }

        // ✅ Simpan token khusus admin
        localStorage.setItem('admin_token', token);

        // ✅ Redirect ke dashboard admin
        this.$router.push('/admin');
      } catch (err) {
        this.error = 'Login gagal. Periksa kembali email dan password.';
        console.error('Login admin error:', err);
      }
    }
  }
};
</script>
