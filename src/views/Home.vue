<template>
  <div class="container px-4 py-8 mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Selamat Datang di Carne'&Co</h1>
      <p class="text-lg text-gray-600">Toko daging segar berkualitas tinggi</p>
    </div>

    <!-- Search + Dropdown -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="relative w-full sm:w-2/3">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari produk..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <select
        v-model="selectedCategory"
        class="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Semua Kategori</option>
        <option>Daging</option>
        <option>Ayam & Bebek</option>
        <option>Seafood</option>
        <option>Produk Olahan</option>
      </select>
    </div>

    <!-- Kirim prop searchQuery dan selectedCategory ke ProductList -->
    <ProductList :searchQuery="searchQuery" :category="selectedCategory" />
  </div>
</template>

<script>
import ProductList from '../components/ProductList.vue';
import authStore from '../store/authStore';

export default {
  name: 'HomeView',
  components: { ProductList },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      user: null
    };
  },
  mounted() {
    this.user = authStore.state.user;
  }
};
</script>
