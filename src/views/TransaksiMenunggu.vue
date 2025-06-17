<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-yellow-50 text-center px-4">
    <div class="max-w-md">
      <h1 class="text-3xl font-bold text-yellow-600 mb-4">⏳ Pembayaran Menunggu</h1>
      <p class="text-gray-700 mb-8">Kami sedang menunggu konfirmasi dari sistem pembayaran. Kamu bisa cek kembali nanti.</p>

      <div class="flex justify-center gap-4">
        <router-link to="/" class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">Beranda</router-link>
        <router-link to="/profil/pesanan" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">Lihat Pesanan</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransaksiMenunggu'
}
</script>
