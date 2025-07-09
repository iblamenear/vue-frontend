<template>
  <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-8 mx-auto">
    <!-- LEFT: Info Customer + Alamat + Item -->
    <div class="md:col-span-2 space-y-6">
      <h1 class="text-2xl font-bold text-gray-800">Checkout</h1>

      <!-- Info Pelanggan -->
      <div class="bg-white p-4 rounded shadow space-y-2">
        <h2 class="text-lg font-semibold mb-2">Informasi Pelanggan</h2>
        <p><strong>Nama:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Alamat:</strong> {{ user.address || 'Alamat belum tersedia' }}</p>
        <p><strong>Nomor HP:</strong> {{ user.phone || 'Nomor HP belum tersedia' }}</p>
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
      user: { name: '', email: '', id: '', address: '', phone: '' },
      cart: [],
      shippingCost: 15000
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
    }
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
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data.user;
        this.user = {
          name: data.name,
          email: data.email,
          id: data._id,
          address: data.address || '',
          phone: data.phone || ''
        };

        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
        alert('Gagal mengambil data pengguna. Silakan login ulang.');
        this.$router.push('/login');
      }
    },
    async payNow() {
      if (!this.user.address || !this.user.phone) {
        alert('Alamat dan nomor HP belum tersedia. Silakan lengkapi profil Anda terlebih dahulu.');
        return;
      }

      const orderData = {
        cart: this.cart,
        shippingAddress: this.user.address,
        phoneNumber: this.user.phone,
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
        alert('Gagal memproses pembayaran.');
      }
    }
  },
  async mounted() {
    await this.fetchUserProfile();

    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/cart', {
    headers: {
    Authorization: `Bearer ${token}`
    }
    });
    this.cart = res.data.cart || [];

    const snapScript = document.createElement('script');
    snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    snapScript.setAttribute('data-client-key', 'YOUR_MIDTRANS_CLIENT_KEY'); // Ganti dengan Client Key kamu
    document.body.appendChild(snapScript);
  }
};
</script>
