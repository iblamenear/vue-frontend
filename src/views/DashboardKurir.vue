<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow mb-6">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-green-600">Carne'&Co - Kurir</h1>
        <button
          @click="logout"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>

    <!-- Konten -->
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Semua Pengiriman</h2>

      <div v-if="transactions.length > 0" class="space-y-4">
        <div
          v-for="trx in transactions"
          :key="trx._id"
          class="bg-white border rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="w-full md:w-2/3 space-y-1">
            <div class="flex justify-between">
              <p class="text-sm text-gray-700 font-semibold">
                🧾 Order ID: <span class="text-indigo-600">{{ trx.midtransOrderId || 'Tanpa ID' }}</span>
              </p>
            </div>
            <p class="text-sm text-gray-700">👤 Nama: <strong>{{ trx.userId?.name }}</strong></p>
            <p class="text-sm text-gray-700">📞 No HP: {{ trx.userId?.phone }}</p>
            <p class="text-sm text-gray-700">🏠 Alamat: {{ trx.userId?.address }}</p>
            <p class="text-sm text-gray-600">
              🕒 {{ new Date(trx.createdAt).toLocaleString('id-ID') }}
            </p>

            <div v-if="trx.returDisetujui" class="text-sm mt-1">
              <span class="font-medium text-green-600">✅ Retur Disetujui</span>
            </div>
          </div>

          <div class="mt-4 md:mt-0 space-y-2">
            <button
              v-if="trx.statusPengiriman === 'dikirim'"
              @click="markAsDelivered(trx._id)"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Pesanan telah Sampai
            </button>

            <button
              v-if="trx.returStatus === 'disetujui'"
              @click="tandaiSudahDijemput(trx._id)"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🚚 Tandai Sudah Dijemput
            </button>

            <button
              v-if="trx.returStatus === 'kurir_menjemput'"
              @click="updateReturProgress(trx._id, 'diperiksa')"
              class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              🧾 Tandai Sudah Diterima Admin
            </button>

            <p
              v-if="!trx.returStatus && trx.statusPengiriman !== 'dikirim'"
              class="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded text-center"
            >
              Menunggu admin kirim
            </p>
          </div>
        </div>
      </div>

      <p v-else class="text-gray-500">Belum ada pengiriman yang tersedia saat ini.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardKurir',
  data() {
    return {
      transactions: []
    };
  },
  methods: {
    async fetchTransactions() {
      try {
        const token = sessionStorage.getItem('courier_token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/transactions/for-courier', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.transactions = res.data;
      } catch (err) {
        console.error('Gagal memuat transaksi:', err);
        alert('Gagal mengambil data transaksi.');
      }
    },
    async markAsDelivered(id) {
      if (confirm('Tandai pengiriman ini sebagai selesai?')) {
        try {
          const token = sessionStorage.getItem('courier_token');
          await axios.put(
            `http://localhost:5000/api/transactions/status/${id}`,
            { statusPengiriman: 'sampai' },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          this.fetchTransactions();
        } catch (err) {
          console.error('Gagal update status:', err);
        }
      }
    },
    async tandaiSudahDijemput(id) {
      if (confirm('Tandai barang retur ini sudah dijemput?')) {
        try {
          const token = sessionStorage.getItem('courier_token');
          await axios.patch(
            `http://localhost:5000/api/transactions/retur-status/${id}`,
            { returStatus: 'kurir_menjemput' },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          this.fetchTransactions();
        } catch (err) {
          console.error('Gagal update status retur:', err);
        }
      }
    },
    async updateReturProgress(id, nextStatus) {
  if (confirm(`Ubah status retur menjadi ${nextStatus}?`)) {
    try {
      const token = sessionStorage.getItem('courier_token');
      await axios.patch(
        `http://localhost:5000/api/transactions/retur-status/${id}`,
        { returStatus: nextStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // ❌ Jangan fetch ulang semua transaksi, cukup hapus dari array
      this.transactions = this.transactions.filter(trx => trx._id !== id);
    } catch (err) {
      console.error('Gagal update status retur:', err);
    }
  }
},
    logout() {
      sessionStorage.removeItem('courier_token');
      this.$router.push('/login-kurir');
    }
  },
  async mounted() {
    const token = sessionStorage.getItem('courier_token');
    if (!token) {
      alert('Anda harus login sebagai kurir!');
      this.$router.push('/login-kurir');
    } else {
      await this.fetchTransactions();
    }
  }
};
</script>

<style scoped>
</style>
