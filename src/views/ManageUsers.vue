<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-md mb-8">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-indigo-600">Carne'&Co - Kelola User</h1>
        <div class="flex gap-3">
          <button
            @click="$router.push('/admin')"
            class="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
          >
            Kembali ke Dashboard
          </button>
          <button
            @click="logout"
            class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-semibold mb-6">Daftar User & Transaksi</h2>
      <div v-if="users.length > 0" class="space-y-6">
        <div
          v-for="user in users"
          :key="user._id"
          class="border rounded p-4 bg-white shadow-sm"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-lg">
                {{ user.name }} <span class="text-sm text-gray-500">({{ user.email }})</span>
              </h3>
              <p class="text-sm text-gray-600">📞 {{ user.phone || 'Tidak tersedia' }}</p>
              <p class="text-sm text-gray-600">📍 {{ user.address || 'Alamat tidak tersedia' }}</p>
            </div>
            <button
              @click="toggleUserTransactions(user._id)"
              class="text-sm text-indigo-600 hover:underline"
            >
              <span v-if="expandedUserId === user._id">⬆️ Sembunyikan Pesanan</span>
              <span v-else>⬇️ Lihat Pesanan</span>
            </button>
          </div>

          <div v-if="expandedUserId === user._id" class="mt-4 space-y-3">
            <div
              v-for="trx in user.transactions"
              :key="trx._id"
              class="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between"
              :class="trx.statusPengiriman === 'sampai' ? 'bg-green-50' : 'bg-gray-50'"
            >
              <div class="space-y-1">
                <p class="text-sm font-medium">🛒 Total: Rp {{ formatPrice(trx.total) }}</p>
                <p class="text-sm">
                  📦 Status:
                  <span v-if="trx.statusPengiriman === 'sampai'" class="text-green-700">Sampai (selesai)</span>
                  <select
                    v-else
                    v-model="trx.statusPengiriman"
                    @change="updateStatus(trx._id, trx.statusPengiriman)"
                    class="ml-2 border rounded px-2 py-1 text-sm"
                  >
                    <option value="diproses">Diproses</option>
                    <option value="dikirim">Dikirim</option>
                  </select>
                </p>
                <p class="text-sm text-gray-500">🕒 {{ new Date(trx.createdAt).toLocaleString('id-ID') }}</p>

                <!-- Retur Handling -->
                <div v-if="trx.komplain && trx.returDisetujui === undefined" class="mt-2 space-y-2">
                  <p class="text-sm text-red-500">🛑 Komplain Diajukan - Menunggu Persetujuan Admin</p>
                  <div class="flex gap-2">
                    <button
                      @click="setujuiRetur(trx._id)"
                      class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >✅ Setujui Retur</button>
                    <button
                      @click="tolakRetur(trx._id)"
                      class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >❌ Tolak Retur</button>
                  </div>
                </div>
                <div v-else-if="trx.returDisetujui === true" class="mt-2 text-green-600 text-sm">
                  ✅ Retur Telah Disetujui Admin

                  <!-- Pelacakan Retur -->
                  <div class="mt-2">
                    <div class="flex items-center flex-wrap gap-4">
                      <div
                        v-for="(step, index) in returSteps"
                        :key="index"
                        class="flex items-center"
                      >
                        <div
                          class="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                          :class="isStepCompleted(trx.returStatus, step.status) ? 'bg-green-600' : 'bg-gray-400'"
                        >
                          {{ index + 1 }}
                        </div>
                        <span class="ml-2 text-sm">{{ step.label }}</span>
                        <div v-if="index < returSteps.length - 1" class="w-6 h-px bg-gray-400 mx-3"></div>
                      </div>
                    </div>
                    <div v-if="trx.returStatus === 'diperiksa'" class="mt-3">
                      <button
                        @click="markReturAsCompleted(trx._id)"
                        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        ✅ Tandai Retur Selesai & Dana Dikembalikan
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else-if="trx.returDisetujui === false" class="mt-2 text-gray-600 text-sm">
                  ❌ Retur Ditolak Admin
                </div>
              </div>
              <div class="mt-4 md:mt-0 md:text-right text-sm text-indigo-700 font-bold w-full md:w-1/3 text-center md:text-right">
                📄 {{ trx.midtransOrderId || 'Tanpa ID Midtrans' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">Belum ada data user.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManageUsers',
  data() {
    return {
      users: [],
      expandedUserId: null,
      successMessage: '',
      errorMessage: '',
      returSteps: [
        { label: 'Retur Disetujui', status: 'disetujui' },
        { label: 'Barang Dijemput', status: 'kurir_menjemput' },
        { label: 'Diperiksa', status: 'diperiksa' },
        { label: 'Selesai', status: 'selesai' }
      ]
    };
  },
  methods: {
    async fetchUsersWithTransactions() {
      try {
        const token = sessionStorage.getItem('admin_token');
        const res = await axios.get('http://localhost:5000/api/auth/all-users-with-transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.users = res.data;
      } catch (err) {
        console.error('Gagal memuat user:', err);
      }
    },
    async updateStatus(transactionId, status) {
      try {
        const token = sessionStorage.getItem('admin_token');
        await axios.put(`http://localhost:5000/api/transactions/status/${transactionId}`, {
          statusPengiriman: status
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.successMessage = 'Status pengiriman diperbarui.';
      } catch (err) {
        this.errorMessage = 'Gagal update status pengiriman.';
      }
    },
    async setujuiRetur(transactionId) {
      try {
        const token = sessionStorage.getItem('admin_token');
        await axios.patch(
          `http://localhost:5000/api/transactions/approve-return/${transactionId}`,
          {
            returStatus: 'disetujui'
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        this.successMessage = 'Retur disetujui.';
        this.fetchUsersWithTransactions();
      } catch (err) {
        this.errorMessage = 'Gagal menyetujui retur.';
      }
    },
    async tolakRetur(transactionId) {
      try {
        const token = sessionStorage.getItem('admin_token');
        await axios.patch(`http://localhost:5000/api/transactions/reject-return/${transactionId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.successMessage = 'Retur ditolak.';
        this.fetchUsersWithTransactions();
      } catch (err) {
        this.errorMessage = 'Gagal menolak retur.';
      }
    },
    async markReturAsCompleted(transactionId) {
      try {
        const token = sessionStorage.getItem('admin_token');
        await axios.patch(
          `http://localhost:5000/api/transactions/retur-status/${transactionId}`,
          { returStatus: 'selesai' },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        this.successMessage = 'Retur ditandai selesai.';
        this.fetchUsersWithTransactions();
      } catch (err) {
        this.errorMessage = 'Gagal menandai retur selesai.';
      }
    },
    isStepCompleted(currentStatus, stepStatus) {
      const order = ['disetujui', 'kurir_menjemput', 'diperiksa', 'selesai'];
      return order.indexOf(currentStatus) >= order.indexOf(stepStatus);
    },
    toggleUserTransactions(userId) {
      this.expandedUserId = this.expandedUserId === userId ? null : userId;
    },
    formatPrice(val) {
      const number = Number(val);
      if (isNaN(number)) return '0';
      return new Intl.NumberFormat('id-ID').format(Math.round(number));
    },
    checkAuth() {
      const token = sessionStorage.getItem('admin_token');
      if (!token) {
        alert('Anda harus login sebagai admin!');
        this.$router.push('/login-admin');
      }
    },
    logout() {
      sessionStorage.removeItem('admin_token');
      this.$router.push('/login-admin');
    }
  },
  mounted() {
    this.checkAuth();
    this.fetchUsersWithTransactions();
  }
};
</script>

<style scoped>
select {
  min-width: 150px;
}
</style>