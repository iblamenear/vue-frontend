<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Profil Pengguna</h1>

    <!-- Info User -->
    <div class="bg-white rounded-xl shadow p-6 mb-8">
      <div class="grid gap-4">
        <div>
          <label class="text-sm text-gray-500">Nama</label>
          <p class="text-lg font-medium text-gray-800">{{ user.name }}</p>
        </div>
        <div>
          <label class="text-sm text-gray-500">Email</label>
          <p class="text-lg font-medium text-gray-800">{{ user.email }}</p>
        </div>

        <!-- Alamat -->
        <div>
          <label class="text-sm text-gray-500">Alamat</label>
          <p class="text-lg font-medium text-gray-800" v-if="!editingAddress">{{ user.address }}</p>

          <div v-if="editingAddress" class="flex gap-2 items-center mt-2">
            <input
              v-model="newAddress"
              type="text"
              class="border rounded px-3 py-1 w-full"
              placeholder="Masukkan alamat baru"
            />
            <button @click="saveAddress" class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Simpan</button>
            <button @click="cancelEdit('address')" class="text-red-500 hover:underline text-sm">Batal</button>
          </div>

          <button v-if="!editingAddress" @click="startEdit('address')" class="text-blue-600 mt-2 text-sm hover:underline">
            Ubah Alamat
          </button>
        </div>

        <!-- Nomor HP -->
        <div>
          <label class="text-sm text-gray-500">Nomor HP</label>
          <p class="text-lg font-medium text-gray-800" v-if="!editingPhone">{{ user.phone }}</p>

          <div v-if="editingPhone" class="flex gap-2 items-center mt-2">
            <input
              v-model="newPhone"
              type="text"
              class="border rounded px-3 py-1 w-full"
              placeholder="Masukkan nomor HP baru"
            />
            <button @click="savePhone" class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Simpan</button>
            <button @click="cancelEdit('phone')" class="text-red-500 hover:underline text-sm">Batal</button>
          </div>

          <button v-if="!editingPhone" @click="startEdit('phone')" class="text-blue-600 mt-2 text-sm hover:underline">
            Ubah Nomor HP
          </button>
        </div>
      </div>
    </div>

    <!-- Navigasi ke Halaman Pesanan -->
    <div class="text-right">
      <router-link to="/order" class="text-blue-600 hover:underline text-sm">
        Lihat Pesanan & Histori Pesanan →
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      user: {
        name: '',
        email: '',
        address: '',
        phone: ''
      },
      editingAddress: false,
      editingPhone: false,
      newAddress: '',
      newPhone: ''
    };
  },
  methods: {
    async fetchUser() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        this.user = data.user || {};
        this.newAddress = this.user.address;
        this.newPhone = this.user.phone;
      } catch (error) {
        console.error('Gagal memuat profil:', error);
      }
    },
    startEdit(field) {
      if (field === 'address') this.editingAddress = true;
      if (field === 'phone') this.editingPhone = true;
    },
    cancelEdit(field) {
      if (field === 'address') {
        this.newAddress = this.user.address;
        this.editingAddress = false;
      }
      if (field === 'phone') {
        this.newPhone = this.user.phone;
        this.editingPhone = false;
      }
    },
    async saveAddress() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/update-address', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ address: this.newAddress })
        });

        if (!response.ok) throw new Error('Gagal memperbarui alamat');

        this.user.address = this.newAddress;
        this.editingAddress = false;
      } catch (error) {
        alert('Terjadi kesalahan saat menyimpan alamat.');
        console.error(error);
      }
    },
    async savePhone() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/update-address', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ phone: this.newPhone })
        });

        if (!response.ok) throw new Error('Gagal memperbarui nomor HP');

        this.user.phone = this.newPhone;
        this.editingPhone = false;
      } catch (error) {
        alert('Terjadi kesalahan saat menyimpan nomor HP.');
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchUser();
  }
};
</script>

<style scoped>
input {
  transition: border 0.2s ease;
}
</style>
