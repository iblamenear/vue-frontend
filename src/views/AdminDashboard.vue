<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-2xl font-bold text-gray-800">Tambah Produk Baru</h1>

    <form @submit.prevent="submitProduct" class="max-w-xl space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Nama Produk</label>
        <input 
          v-model="form.name" 
          type="text" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Harga (Rp)</label>
        <input 
          v-model.number="form.price" 
          type="number" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p class="mt-1 text-sm text-gray-500">Harga per 100 gram</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">URL Gambar</label>
        <input 
          v-model="form.image" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea 
          v-model="form.description" 
          rows="4" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <button 
        type="submit" 
        class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Tambah Produk
      </button>

      <p v-if="successMessage" class="mt-4 text-green-600 font-medium">{{ successMessage }}</p>
      <p v-if="errorMessage" class="mt-4 text-red-600 font-medium">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      form: {
        name: '',
        price: null,
        unit: '100g', // tetap dikirim ke backend walau tidak ditampilkan
        image: '',
        description: ''
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async submitProduct() {
      try {
        const res = await axios.post('http://localhost:5000/api/products', this.form);
        this.successMessage = `Produk "${res.data.name}" berhasil ditambahkan!`;
        this.errorMessage = '';
        this.form = { name: '', price: null, unit: '100g', image: '', description: '' };
      } catch (err) {
        console.error('Gagal menambahkan produk:', err);
        this.successMessage = '';
        this.errorMessage = 'Gagal menambahkan produk. Coba lagi nanti.';
      }
    }
  }
};
</script>
