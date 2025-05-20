<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900">404 - Halaman Tidak Ditemukan</h1>
        <p class="mt-2 text-gray-600">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
      </div>
      <div class="flex justify-center mt-6">
        <router-link
          to="/"
          class="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Kembali ke Beranda
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>