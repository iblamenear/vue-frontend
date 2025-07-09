<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-2xl font-bold text-gray-800">Keranjang Belanja</h1>

    <div v-if="cart.length === 0" class="text-gray-600">Keranjang Anda kosong.</div>

    <div v-else class="space-y-4">
      <div
        v-for="item in cart"
        :key="item._id"
        class="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md"
      >
        <div class="flex items-center space-x-4">
          <img :src="item.image" class="w-20 h-20 object-cover rounded" />
          <div>
            <h2 class="text-lg font-semibold">{{ item.name }}</h2>
            <p class="text-sm text-gray-500">
              Rp {{ formatPrice(item.price) }} / {{ item.unit || '100g' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
          <div>
            <label class="block text-sm font-medium text-gray-700">Jumlah</label>
            <input
              type="number"
              min="1"
              v-model.number="item.quantity"
              @input="saveCart"
              class="w-20 px-2 py-1 border rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Berat (gram)</label>
            <input
              type="number"
              min="50"
              step="50"
              v-model.number="item.berat"
              @input="saveCart"
              class="w-24 px-2 py-1 border rounded-md"
            />
          </div>

          <div>
            <p class="font-semibold text-right text-gray-700">Subtotal:</p>
            <p class="text-right text-indigo-600 font-bold">
              Rp {{
                formatPrice(
                  (item.price / unitDivisor(item.unit)) *
                  item.berat * item.quantity
                )
              }}
            </p>
          </div>

          <button @click="removeFromCart(item._id)" class="text-red-500 hover:text-red-700">
            Hapus
          </button>
        </div>
      </div>

      <div class="pt-4 text-right border-t mt-4">
        <p class="mb-2 text-lg font-bold">Total: Rp {{ formatPrice(totalPrice) }}</p>
        <button
          @click="goToCheckout"
          class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartView',
  data() {
    return {
      cart: []
    };
  },
  computed: {
    totalPrice() {
      if (!Array.isArray(this.cart)) return 0;
      return this.cart.reduce((acc, item) => {
        const unit = item.unit || '100g';
        const unitValue = this.unitDivisor(unit);
        return acc + (item.price / unitValue) * item.berat * item.quantity;
      }, 0);
    }
  },
  async mounted() {
    await this.loadCart();
  },
  methods: {
    async loadCart() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        this.cart = data.cart || [];
      } catch (err) {
        console.error('Gagal mengambil keranjang:', err);
      }
    },
    async saveCart() {
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            cart: this.cart.map(item => ({
              _id: item._id,
              quantity: item.quantity,
              berat: item.berat
            }))
          })
        });
        // Jangan timpa this.cart agar tidak hilang datanya
      } catch (err) {
        console.error('Gagal menyimpan keranjang:', err);
      }
    },
    async removeFromCart(productId) {
      this.cart = this.cart.filter(item => item._id !== productId);
      await this.saveCart();
    },
    unitDivisor(unit) {
      switch ((unit || '').toLowerCase()) {
        case 'kg': return 1000;
        case '100g': return 100;
        case 'gram':
        default: return 1;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(Math.round(price));
    },
    goToCheckout() {
      if (this.cart.length === 0) {
        alert('Keranjang kosong!');
        return;
      }
      this.$router.push('/checkout');
    }
  }
};
</script>
