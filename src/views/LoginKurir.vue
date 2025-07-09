<template>
  <div class="max-w-md mx-auto py-10 px-4">
    <h2 class="text-2xl font-bold text-center mb-6">Login Kurir</h2>

    <form @submit.prevent="loginKurir" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium text-gray-700">Email</label>
        <input v-model="email" type="email" required class="w-full px-4 py-2 border rounded-md" />
      </div>

      <div>
        <label class="block mb-1 font-medium text-gray-700">Password</label>
        <input v-model="password" type="password" required class="w-full px-4 py-2 border rounded-md" />
      </div>

      <button type="submit" class="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">
        Login sebagai Kurir
      </button>

      <p v-if="error" class="text-red-600 mt-2 text-center">{{ error }}</p>
    </form>
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
      error: ''
    };
  },
  methods: {
    async loginKurir() {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password
        });

        if (res.data.role !== 'courier') {
          this.error = 'Akun ini bukan kurir.';
          return;
        }

        localStorage.setItem('courier_token', res.data.token);
        this.error = '';
        this.$router.push('/kurir'); // sesuaikan dengan route dashboard kurir
      } catch (err) {
        this.error = 'Login gagal. Periksa kembali email dan password.';
        console.error('Login kurir error:', err);
      }
    }
  }
};
</script>
