<template>
  <div>
    <div v-if="loading" class="flex justify-center py-8">
      <svg class="w-8 h-8 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="error" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      {{ error }}
    </div>

    <div v-else-if="!products.length" class="py-8 text-center">
      <p class="text-lg text-gray-600">Tidak ada produk tersedia saat ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-for="product in products" :key="product._id" class="overflow-hidden bg-white rounded-lg shadow-md">
        <div class="h-48 overflow-hidden bg-neutral-50">
          <img 
            :src="product.image || '/img/meat-placeholder.jpg'" 
            :alt="product.name"
            class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            @error="handleImageError"
          />
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
          <p class="mb-2 text-sm text-gray-500 line-clamp-2">{{ product.description || 'Tidak ada deskripsi' }}</p>
          <div class="flex items-center justify-between mt-4">
            <span class="text-xl font-bold text-indigo-600">Rp {{ formatPrice(product.price) }}</span>
            <button 
              class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="addToCart(product)"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      cart: []
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        this.products = response.data;
        this.error = null;
      } catch (error) {
        console.error('Gagal fetch produk:', error);
        this.error = 'Gagal memuat produk. Silakan coba lagi nanti.';
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price);
    },
    handleImageError(event) {
      event.target.src = '/img/meat-placeholder.jpg';
    },
    addToCart(product) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Cek apakah produk sudah ada di keranjang berdasarkan _id
      const existingProduct = cart.find(item => item._id === product._id);

      if (!existingProduct) {
      cart.push(product); // kalau belum ada, tambahkan
    } else {
        alert(`${product.name} sudah ada di keranjang`);
      return;
    }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`Produk ${product.name} ditambahkan ke keranjang`);
    }
  }
};
</script>