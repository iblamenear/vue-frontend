<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-2xl font-bold text-gray-800">Keranjang Belanja</h1>

    <div v-if="cart.length === 0" class="text-gray-600">
      Keranjang Anda kosong.
    </div>

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
              @input="updateCart"
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
              @input="updateCart"
              class="w-24 px-2 py-1 border rounded-md"
            />
          </div>

          <div>
            <p class="font-semibold text-right text-gray-700">Subtotal:</p>
            <p class="text-right text-indigo-600 font-bold">
              Rp {{ formatPrice((item.price / unitDivisor(item.unit)) * item.berat * item.quantity) }}
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
      return this.cart.reduce((acc, item) => {
        const unitValue = this.unitDivisor(item.unit);
        return acc + ((item.price / unitValue) * item.berat * item.quantity);
      }, 0);
    }
  },
  mounted() {
    const storedCart = localStorage.getItem('cart');
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    this.cart = parsedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      berat: item.berat || 100,
      unit: item.unit || '100g'
    }));
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(Math.round(price));
    },
    updateCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    removeFromCart(id) {
      this.cart = this.cart.filter(item => item._id !== id);
      this.updateCart();
    },
    unitDivisor(unit) {
      switch ((unit || '').toLowerCase()) {
        case 'kg': return 1000;
        case '100g': return 100;
        case 'gram':
        default: return 1;
      }
    },
    goToCheckout() {
      if (this.cart.length === 0) {
        alert("Keranjang kosong!");
        return;
      }
      this.updateCart();
      this.$router.push('/checkout');
    }
  }
};
</script>
