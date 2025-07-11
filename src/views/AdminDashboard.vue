<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Admin -->
    <nav class="bg-white shadow-md mb-8">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-indigo-600">Carne'&Co - Admin</h1>
        <div class="flex gap-3">
          <button
            @click="$router.push('/manage-users')"
            class="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
          >
            Kelola User
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

    <!-- Konten Produk -->
    <div class="container px-4 py-8 mx-auto">
      <div class="grid md:grid-cols-2 gap-10">
        <!-- Form Tambah / Edit Produk -->
        <div>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            {{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}
          </h2>
          <form @submit.prevent="isEditing ? updateProduct() : submitProduct()" class="space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Nama Produk</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-md"
                placeholder="Contoh: Daging Sapi Premium"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Harga (Rp)</label>
              <input
                v-model.number="form.price"
                type="number"
                required
                class="w-full px-4 py-2 border rounded-md"
                placeholder="Contoh: 30000"
              />
              <p class="mt-1 text-sm text-gray-500">Harga per 100 gram</p>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">URL Gambar</label>
              <input
                v-model="form.image"
                type="text"
                class="w-full px-4 py-2 border rounded-md"
                placeholder="https://..."
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-2 border rounded-md"
                placeholder="Deskripsi singkat produk"
              ></textarea>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Kategori</label>
              <select
                v-model="form.category"
                required
                class="w-full px-4 py-2 border rounded-md"
              >
                <option disabled value="">-- Pilih Kategori --</option>
                <option>Daging</option>
                <option>Ayam & Bebek</option>
                <option>Seafood</option>
                <option>Produk Olahan</option>
              </select>
            </div>

            <div class="flex gap-3">
              <button type="submit" class="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">
                {{ isEditing ? 'Update Produk' : 'Tambah Produk' }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
            </div>

            <p v-if="successMessage" class="mt-4 text-green-600 font-medium">{{ successMessage }}</p>
            <p v-if="errorMessage" class="mt-4 text-red-600 font-medium">{{ errorMessage }}</p>
          </form>
        </div>

        <!-- Daftar Produk -->
        <div>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Daftar Produk</h2>

          <!-- Search Bar -->
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk..."
              class="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <!-- Scrollable Container -->
          <div class="max-h-[400px] overflow-y-auto pr-2">
            <div v-if="filteredProducts.length > 0" class="space-y-4">
              <div
                v-for="product in filteredProducts"
                :key="product._id"
                class="border p-4 rounded shadow-sm flex justify-between items-center bg-white"
              >
                <div>
                  <h3 class="font-bold text-lg">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500">
                    Rp {{ formatPrice(product.price) }} / {{ product.unit || '100g' }} - {{ product.category }}
                  </p>
                </div>
                <div class="flex gap-3">
                  <button @click="editProduct(product)" class="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button @click="deleteProduct(product._id)" class="text-red-600 hover:underline">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500">Tidak ada produk yang cocok.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      products: [],
      form: {
        name: '',
        price: null,
        unit: '100g',
        image: '',
        description: '',
        category: ''
      },
      isEditing: false,
      editId: null,
      successMessage: '',
      errorMessage: '',
      searchQuery: ''
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const token = sessionStorage.getItem('admin_token');
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.products = res.data;
      } catch (err) {
        console.error('Gagal memuat produk:', err);
      }
    },
    async submitProduct() {
      if (!this.form.category) {
    this.errorMessage = 'Kategori harus dipilih.';
    this.successMessage = '';
    return;
  
    } try {
        const token = sessionStorage.getItem('admin_token');
        const res = await axios.post('http://localhost:5000/api/products', this.form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.successMessage = `Produk "${res.data.name}" berhasil ditambahkan!`;
        this.errorMessage = '';
        this.resetForm();
        this.fetchProducts();
      } catch (err) {
        this.successMessage = '';
        this.errorMessage = 'Gagal menambahkan produk.';
      }
    },
    editProduct(product) {
      this.form = { ...product };
      this.editId = product._id;
      this.isEditing = true;
    },
    async updateProduct() {
      try {
        const token = sessionStorage.getItem('admin_token');
        await axios.put(`http://localhost:5000/api/products/${this.editId}`, this.form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.successMessage = 'Produk berhasil diperbarui.';
        this.errorMessage = '';
        this.resetForm();
        this.fetchProducts();
      } catch (err) {
        this.successMessage = '';
        this.errorMessage = 'Gagal memperbarui produk.';
      }
    },
    async deleteProduct(id) {
      if (confirm('Yakin ingin menghapus produk ini?')) {
        try {
          const token = sessionStorage.getItem('admin_token');
          await axios.delete(`http://localhost:5000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.successMessage = 'Produk berhasil dihapus.';
          this.fetchProducts();
        } catch (err) {
          this.errorMessage = 'Gagal menghapus produk.';
        }
      }
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.form = {
        name: '',
        price: null,
        unit: '100g',
        image: '',
        description: '',
        category: ''
      };
      this.isEditing = false;
      this.editId = null;
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
    this.fetchProducts();
  }
};
</script>
