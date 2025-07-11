<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-green-50 text-center px-4">
    <div class="max-w-md">
      <h1 class="text-3xl font-bold text-green-600 mb-4">🎉 Pembayaran Berhasil</h1>
      <p class="text-gray-700 mb-8">Terima kasih! Transaksi kamu telah berhasil diproses.</p>

      <div class="flex justify-center gap-4">
        <router-link to="/" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Beranda</router-link>
        <router-link to="/order" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">Lihat Pesanan</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransaksiBerhasil'
}
</script>
