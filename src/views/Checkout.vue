<template>
  <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-8 mx-auto">
    <!-- LEFT: Info Customer + Alamat + Item -->
    <div class="md:col-span-2 space-y-6">
      <h1 class="text-2xl font-bold text-gray-800">Checkout</h1>

      <!-- Info Pelanggan -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">Informasi Pelanggan</h2>
        <p><strong>Nama:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>

      <!-- Form Alamat Pengiriman -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">Alamat Pengiriman</h2>
        <input v-model="shippingAddress" type="text" placeholder="Alamat lengkap" class="w-full mb-3 px-3 py-2 border rounded" />
        <input v-model="phoneNumber" type="text" placeholder="Nomor HP" class="w-full px-3 py-2 border rounded" />
      </div>

      <!-- Item dalam Keranjang -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">Pesanan Anda</h2>
        <div v-for="item in cart" :key="item._id" class="border-b py-2">
          <p>{{ item.name }} - {{ item.berat }}g x {{ item.quantity }}</p>
          <p class="text-sm text-gray-500">Rp {{ formatPrice(item.price) }} / {{ item.unit || '100g' }}</p>
          <p class="text-right font-medium text-indigo-600">
            Subtotal: Rp {{ formatPrice((item.price / unitDivisor(item.unit)) * item.berat * item.quantity) }}
          </p>
        </div>
      </div>
    </div>

    <!-- RIGHT: Ringkasan + Bayar -->
    <div class="bg-white p-4 rounded shadow h-fit">
      <h2 class="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>
      <div class="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>Rp {{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span>Ongkos Kirim</span>
        <span>Rp {{ formatPrice(shippingCost) }}</span>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>Rp {{ formatPrice(total) }}</span>
      </div>

      <button @click="payNow" class="w-full mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Bayar Sekarang
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CheckoutPage',
  data() {
    return {
      user: { name: '', email: '', id: '' },
      shippingAddress: '',
      phoneNumber: '',
      cart: [],
      shippingCost: 15000,
    };
  },
  computed: {
    subtotal() {
      return this.cart.reduce((acc, item) => {
        const unitValue = this.unitDivisor(item.unit || '100g');
        return acc + ((item.price / unitValue) * item.berat * item.quantity);
      }, 0);
    },
    total() {
      return this.subtotal + this.shippingCost;
    },
  },
  methods: {
    formatPrice(value) {
      return new Intl.NumberFormat('id-ID').format(Math.round(value));
    },
    unitDivisor(unit) {
      switch ((unit || '').toLowerCase()) {
        case 'kg': return 1000;
        case '100g': return 100;
        case 'gram':
        default: return 1;
      }
    },
    async payNow() {
      if (!this.shippingAddress || !this.phoneNumber) {
        alert('Mohon isi alamat dan nomor HP.');
        return;
      }
      const orderData = {
        cart: this.cart,
        shippingAddress: this.shippingAddress,
        phoneNumber: this.phoneNumber,
        total: this.total,
        user: {
          _id: this.user.id,
          name: this.user.name,
          email: this.user.email
        }
      };
      try {
        const res = await axios.post('http://localhost:5000/api/midtrans/create-transaction', orderData);
        const token = res.data.token;
        window.snap.pay(token, {
          onSuccess: (result) => {
            console.log('✔️ Pembayaran sukses:', result);
            window.location.href = '/transaksi-berhasil';
          },
          onPending: (result) => {
            console.log('⏳ Pembayaran pending:', result);
            window.location.href = '/transaksi-menunggu';
          },
          onError: (result) => {
            console.error('❌ Pembayaran gagal:', result);
            window.location.href = '/transaksi-gagal';
          },
          onClose: () => {
            alert('❌ Kamu menutup popup tanpa menyelesaikan pembayaran.');
          }
        });
      } catch (err) {
        console.error('Gagal membuat transaksi Midtrans:', err);
      }
    }
  },
  async mounted() {
    const userData = JSON.parse(localStorage.getItem('user')) || { name: '', email: '', id: '' };
    this.user = {
      name: userData.name,
      email: userData.email,
      id: userData.id || userData._id || '' // kompatibel dengan struktur respons backend
    };

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    this.cart = storedCart;

    const snapScript = document.createElement('script');
    snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    snapScript.setAttribute('data-client-key', 'YOUR_MIDTRANS_CLIENT_KEY'); // Ganti dengan client key kamu
    document.body.appendChild(snapScript);
  }
};
</script>