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
        <div v-if="order.returDisetujui" class="flex justify-between items-center text-sm text-gray-700 relative">
          <template v-for="(label, i) in returSteps" :key="'retur-' + i">
            <div class="flex flex-col items-center w-24 text-center">
              <div :class="[ 
                'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300',
                order.step > i
                  ? 'bg-green-500 text-white'
                  : order.step === i + 1
                    ? stepColors[i] + ' text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
              ]">
                {{ returIcons[i] }}
              </div>
              <p class="text-xs sm:text-sm">{{ label }}</p>
            </div>
            <div
              v-if="i < returSteps.length - 1"
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

        <div v-else class="flex justify-between items-center text-sm text-gray-700 relative">
          <template v-for="(label, i) in normalSteps" :key="'normal-' + i">
            <div class="flex flex-col items-center w-24 text-center">
              <div :class="[ 
                'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300',
                order.step > i
                  ? 'bg-green-500 text-white'
                  : order.step === i + 1
                    ? stepColors[i] + ' text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
              ]">
                {{ normalIcons[i] }}
              </div>
              <p class="text-xs sm:text-sm">{{ label }}</p>
            </div>
            <div
              v-if="i < normalSteps.length - 1"
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

        <!-- Detail & Aksi -->
        <div class="flex justify-between items-center mt-4">
          <div class="text-sm text-gray-600 space-y-0">
            <p>Total Harga: <span class="font-semibold">Rp {{ formatPrice(order.total) }}</span></p>
            <p>Waktu Pemesanan: {{ formatDateTime(order.createdAt) }}</p>
            <p v-if="order.transactionStatus === 'settlement'">Waktu Pembayaran: {{ formatDateTime(order.updatedAt) }}</p>
            <p>Status Pembayaran: <span class="font-semibold">{{ order.transactionStatus }}</span></p>
            <p v-if="order.returDisetujui" class="text-green-600 font-semibold text-sm">
              ✅ Permintaan retur disetujui oleh admin.
            </p>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex flex-col gap-2 items-end justify-center min-w-[150px]">
            <template v-if="order.statusPengiriman === 'sampai' && !order.selesaiOlehUser && !order.komplain">
              <button
                @click="markAsCompleted(order._id)"
                class="px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
              >
                ✅ Pesanan Selesai
              </button>
            </template>

            <template v-if="order.komplain && order.returDisetujui !== true">
              <button
                disabled
                class="px-5 py-2 bg-gray-400 text-white rounded-full cursor-not-allowed"
              >
                ❗ Komplain Diproses
              </button>
            </template>

            <template v-if="!order.komplain && !order.returDisetujui && order.statusPengiriman === 'sampai'">
              <button
                @click="ajukanKomplain(order._id, order.midtransOrderId)"
                class="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                ❌ Ajukan Komplain
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mb-10">Tidak ada pesanan aktif.</div>

    <!-- Histori Pemesanan -->
    <div class="bg-white shadow rounded-xl border p-6 mt-12">
      <div class="flex items-center justify-between cursor-pointer mb-4" @click="toggleHistory">
        <h2 class="text-2xl font-bold text-gray-800">Histori Pemesanan</h2>
        <span class="text-sm text-blue-600 hover:underline">
          {{ showHistory ? '⬆️ Sembunyikan Histori' : '⬇️ Lihat Histori' }}
        </span>
      </div>

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
              <template v-if="order.returDisetujui">
                <template v-for="(label, i) in returSteps" :key="'retur-history-' + i">
                  <div class="flex flex-col items-center w-24 text-center">
                    <div :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300',
                      order.step > i
                        ? 'bg-green-600 text-white'
                        : order.step === i + 1
                          ? stepColors[i] + ' text-white animate-pulse'
                          : 'bg-gray-200 text-gray-500'
                    ]">
                      {{ returIcons[i] }}
                    </div>
                    <p class="text-xs sm:text-sm">{{ label }}</p>
                  </div>
                  <div
                    v-if="i < returSteps.length - 1"
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
              </template>

              <template v-else>
                <template v-for="(label, i) in normalSteps" :key="'normal-history-' + i">
                  <div class="flex flex-col items-center w-24 text-center">
                    <div :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300',
                      order.step > i
                        ? 'bg-green-600 text-white'
                        : order.step === i + 1
                          ? stepColors[i] + ' text-white animate-pulse'
                          : 'bg-gray-200 text-gray-500'
                    ]">
                      {{ normalIcons[i] }}
                    </div>
                    <p class="text-xs sm:text-sm">{{ label }}</p>
                  </div>
                  <div
                    v-if="i < normalSteps.length - 1"
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
              </template>
            </div>

            <div class="mt-4 text-sm text-gray-700 space-y-0">
              <p>Total Harga: <span class="font-bold text-green-800">Rp {{ formatPrice(order.total) }}</span></p>
              <p>Waktu Pemesanan: {{ formatDateTime(order.createdAt) }}</p>
              <p v-if="order.transactionStatus === 'settlement'">Waktu Pembayaran: {{ formatDateTime(order.updatedAt) }}</p>
              <p>Status Pembayaran: <span class="font-semibold text-green-700">{{ order.transactionStatus }}</span></p>
              <p v-if="order.returDisetujui && order.returStatus === 'selesai'" class="text-green-700 font-medium">
                  ✅ Retur selesai dan pengembalian dana telah dilakukan.
              </p>
              <p v-if="order.komplain && order.returDisetujui === false" class="text-red-600 font-semibold">
                ❌ Komplain ditolak oleh admin. Pesanan dianggap Selesai.
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">Belum ada histori pemesanan.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeOrders = ref([]);
const completedOrders = ref([]);
const showHistory = ref(false);

const stepColors = ['bg-yellow-500', 'bg-blue-500', 'bg-indigo-500', 'bg-green-500'];
const normalSteps = ['Pesanan Diterima', 'Pesanan Disiapkan', 'Pesanan Dikirim', 'Pesanan Sampai'];
const normalIcons = ['✔️', '📦', '🚚', '✅'];
const returSteps = ['Retur Disetujui', 'Kurir Menjemput', 'Diperiksa', 'Selesai'];
const returIcons = ['✔️', '📦', '🔍', '✅'];

function toggleHistory() {
  showHistory.value = !showHistory.value;
}

function formatPrice(value) {
  return value.toLocaleString('id-ID');
}

function formatDateTime(date) {
  return new Date(date).toLocaleString('id-ID', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

async function markAsCompleted(orderId) {
  const token = localStorage.getItem('token');
  const confirmSelesai = confirm('Tandai pesanan ini sebagai selesai?');
  if (!confirmSelesai) return;

  await fetch(`http://localhost:5000/api/transactions/mark-complete/${orderId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  location.reload();
}

async function ajukanKomplain(orderId, midtransOrderId) {
  const konfirmasi = confirm('Apakah Anda yakin ingin mengajukan komplain? Anda akan diarahkan ke WhatsApp.');
  if (!konfirmasi) return;

  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5000/api/transactions/mark-complain/${orderId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  window.open(`https://wa.me/6282124397545?text=Halo%20Admin,%20saya%20ingin%20mengajukan%20komplain%20untuk%20pesanan%20${midtransOrderId}`, '_blank');
  location.reload();
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/transactions/history', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const pengirimanStepMap = {
    pesanan_diterima: 1,
    diproses: 2,
    dikirim: 3,
    sampai: 4
  };

  const allOrders = (data.transactions || []).filter(o => o.transactionStatus === 'settlement')
    .map(o => {
      const step = (() => {
        if (o.returDisetujui) {
          const returStepMap = {
            disetujui: 1,
            kurir_menjemput: 2,
            diperiksa: 3,
            selesai: 4
          };
          return returStepMap[o.returStatus] || 1;
        } else {
          return pengirimanStepMap[o.statusPengiriman] || 1;
        }
      })();
      return {
        ...o,
        step,
        selesaiOlehUser: o.selesaiOlehUser ?? false,
        komplain: o.komplain ?? false
      };
    });

  activeOrders.value = allOrders.filter(o =>
    (o.statusPengiriman !== 'sampai' || !o.selesaiOlehUser) &&
    !(o.komplain && o.returDisetujui === false) &&
    !(o.returDisetujui && o.returStatus === 'selesai')
  );

  completedOrders.value = allOrders.filter(o =>
    (o.statusPengiriman === 'sampai' && o.selesaiOlehUser) ||
    (o.komplain && o.returDisetujui === false) ||
    (o.returDisetujui && o.returStatus === 'selesai')
  );
});
</script>
