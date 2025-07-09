<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <!-- Judul utama -->
      <h1 class="text-center text-3xl font-extrabold text-indigo-600">Carne'&Co</h1>

      <div class="text-center">
        <h2 class="mt-2 text-3xl font-extrabold text-gray-900">Login</h2>
        <p class="mt-2 text-sm text-gray-600">
          Atau
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            daftar untuk akun baru
          </router-link>
        </p>
      </div>

      <div v-if="error" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {{ error }}
      </div>

      <!-- FORM LOGIN -->
      <form class="space-y-6" v-if="!showResetForm" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              required
              class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-t-md sm:text-sm"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              required
              class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-b-md sm:text-sm"
            />
          </div>
        </div>

        <div class="flex justify-between text-sm">
          <span></span>
          <button type="button" class="text-indigo-600 hover:underline" @click="showResetForm = true">
            Lupa Password?
          </button>
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          :disabled="loading"
        >
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>

      <!-- FORM RESET PASSWORD -->
      <div v-if="showResetForm">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Reset Password</h3>
        <p class="text-sm text-gray-600 mb-2">Masukkan email terlebih dahulu:</p>

        <div class="flex gap-2">
          <input
            v-model="resetEmail"
            type="email"
            placeholder="Email"
            class="w-full px-3 py-2 border rounded"
          />
          <button @click="checkEmail" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            Check
          </button>
        </div>

        <div v-if="emailValid" class="mt-4">
          <input
            v-model="newPassword"
            type="password"
            placeholder="Password Baru"
            class="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            @click="resetPassword"
            class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Simpan Password Baru
          </button>
        </div>

        <p v-if="resetMessage" class="mt-2 text-sm text-green-600">{{ resetMessage }}</p>
        <p v-if="resetError" class="mt-2 text-sm text-red-600">{{ resetError }}</p>

        <button @click="cancelReset" class="mt-4 text-red-500 hover:underline text-sm w-full">
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: '',

      // Reset Password
      showResetForm: false,
      resetEmail: '',
      newPassword: '',
      emailValid: false,
      resetMessage: '',
      resetError: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      try {
        const res = await fetch('http://localhost:5000/api/auth/login-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login gagal');

        localStorage.setItem('token', data.token);
        window.location.href = '/'; // ✅ Refresh untuk update navbar
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async checkEmail() {
      try {
        const res = await fetch('http://localhost:5000/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.resetEmail })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        this.emailValid = true;
        this.resetError = '';
      } catch (err) {
        this.emailValid = false;
        this.resetError = err.message || 'Email tidak ditemukan';
      }
    },
    async resetPassword() {
      try {
        const res = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.resetEmail,
            newPassword: this.newPassword
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        this.resetMessage = 'Password berhasil diubah. Silakan login kembali.';
        this.emailValid = false;
        this.newPassword = '';
        this.resetEmail = '';
      } catch (err) {
        this.resetError = err.message || 'Gagal reset password';
      }
    },
    cancelReset() {
      this.showResetForm = false;
      this.resetEmail = '';
      this.emailValid = false;
      this.newPassword = '';
      this.resetMessage = '';
      this.resetError = '';
    }
  }
};
</script>
