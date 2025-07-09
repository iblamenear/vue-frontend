<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Pesanan Anda</h1>

    <!-- Pesanan Aktif -->
    <div v-if="activeOrders.length > 0">
      <div
        v-for="(order, index) in activeOrders"
        :key="order._id || index"
        class="bg-white rounded-xl shadow p-6 mb-6"
      >
        <div class="mb-4">
          <p class="text-sm text-gray-500">Nomor Pesanan:</p>
          <p class="text-lg font-medium text-gray-800">{{ order.midtransOrderId }}</p>
        </div>

        <!-- Tracking Step -->
        <div class="flex justify-between items-center text-sm text-gray-700 relative">
          <template v-for="(label, i) in steps" :key="i">
            <div class="flex flex-col items-center w-24 text-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300',
                order.step > i
                  ? 'bg-green-500 text-white'
                  : order.step === i + 1
                    ? stepColors[i] + ' text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
              ]">
                {{ icons[i] }}
              </div>
              <p class="text-xs sm:text-sm">{{ label }}</p>
            </div>

            <div
              v-if="i < steps.length - 1"
              :class="[
                'w-1/5 h-1 transition-colors duration-300',
                order.step > i + 1
                  ? 'bg-green-500'
                  : order.step === i + 1
                    ? stepColors[i]
                    : 'bg-gray-300'
              ]"
            ></div>
          </template>
        </div>

        <!-- Detail tambahan -->
        <div class="mt-4 text-sm text-gray-600 space-y-1">
          <p>Total Harga: <span class="font-semibold">Rp {{ formatPrice(order.total) }}</span></p>
          <p>Waktu Pemesanan: {{ formatDateTime(order.createdAt) }}</p>
          <p v-if="order.transactionStatus === 'settlement'">Waktu Pembayaran: {{ formatDateTime(order.updatedAt) }}</p>
          <p>Status Pembayaran: <span class="font-semibold">{{ order.transactionStatus }}</span></p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mb-10">Tidak ada pesanan aktif.</div>

    <!-- Histori Pemesanan Card Wrapper -->
    <div class="bg-white shadow rounded-xl border p-6 mt-12">
      <div class="flex items-center justify-between cursor-pointer mb-4" @click="toggleHistory">
        <h2 class="text-2xl font-bold text-gray-800">Histori Pemesanan</h2>
        <span class="text-sm text-blue-600 hover:underline">
          {{ showHistory ? '⬆️ Sembunyikan Histori' : '⬇️ Lihat Histori' }}
        </span>
      </div>

      <!-- Histori Pemesanan -->
      <div v-if="showHistory">
        <div v-if="completedOrders.length > 0">
          <div
            v-for="(order, index) in completedOrders"
            :key="order._id || index"
            class="bg-green-100 border border-green-400 rounded-xl shadow p-6 mb-6"
          >
            <div class="mb-4">
              <p class="text-sm text-gray-600">Nomor Pesanan:</p>
              <p class="text-lg font-semibold text-green-900">{{ order.midtransOrderId }}</p>
            </div>

            <!-- Tracking Step -->
            <div class="flex justify-between items-center text-sm text-gray-700 relative">
              <template v-for="(label, i) in steps" :key="i">
                <div class="flex flex-col items-center w-24 text-center">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300',
                    order.step > i
                      ? 'bg-green-600 text-white'
                      : order.step === i + 1
                        ? stepColors[i] + ' text-white animate-pulse'
                        : 'bg-gray-200 text-gray-500'
                  ]">
                    {{ icons[i] }}
                  </div>
                  <p class="text-xs sm:text-sm">{{ label }}</p>
                </div>

                <div
                  v-if="i < steps.length - 1"
                  :class="[
                    'w-1/5 h-1 transition-colors duration-300',
                    order.step > i + 1
                      ? 'bg-green-600'
                      : order.step === i + 1
                        ? stepColors[i]
                        : 'bg-gray-300'
                  ]"
                ></div>
              </template>
            </div>

            <!-- Detail tambahan -->
            <div class="mt-4 text-sm text-gray-700 space-y-1">
              <p>Total Harga: <span class="font-bold text-green-800">Rp {{ formatPrice(order.total) }}</span></p>
              <p>Waktu Pemesanan: {{ formatDateTime(order.createdAt) }}</p>
              <p v-if="order.transactionStatus === 'settlement'">Waktu Pembayaran: {{ formatDateTime(order.updatedAt) }}</p>
              <p>Status Pembayaran: <span class="font-semibold text-green-700">{{ order.transactionStatus }}</span></p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">Belum ada histori pemesanan.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderHistory',
  data() {
    return {
      orders: [],
      showHistory: false,
      steps: ['Pesanan Diterima', 'Diproses', 'Dikirim', 'Sampai'],
      icons: ['📦', '🛠️', '🚚', '✅'],
      stepColors: ['bg-yellow-400', 'bg-yellow-400', 'bg-yellow-400', 'bg-gray-400']
    };
  },
  computed: {
    activeOrders() {
      return this.orders.filter(o => o.statusPengiriman !== 'sampai');
    },
    completedOrders() {
      return this.orders.filter(o => o.statusPengiriman === 'sampai');
    }
  },
  methods: {
    toggleHistory() {
      this.showHistory = !this.showHistory;
    },
    async fetchOrders() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/transactions/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        const pengirimanStepMap = {
          pesanan_diterima: 1,
          diproses: 2,
          dikirim: 3,
          sampai: 4
        };

        this.orders = (data.transactions || [])
          .filter(trx => trx.transactionStatus === 'settlement')
          .map(order => {
            const step = pengirimanStepMap[order.statusPengiriman] || 1;
            return {
              ...order,
              step
            };
          });
      } catch (err) {
        console.error('Gagal mengambil data transaksi:', err);
      }
    },
    formatDateTime(datetimeStr) {
      const date = new Date(datetimeStr);
      return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatPrice(val) {
      const number = Number(val);
      if (isNaN(number)) return '0';
      return new Intl.NumberFormat('id-ID').format(Math.round(number));
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
div[class*="w-10"] {
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
