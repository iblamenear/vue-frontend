import { reactive } from 'vue';

const cartStore = reactive({
  items: [],

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += product.quantity || 1;
    } else {
      this.items.push({ ...product, quantity: product.quantity || 1 });
    }
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
  },

  clearCart() {
    this.items = [];
  },

  get totalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  get groupedByCategory() {
    return this.items.reduce((groups, item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
      return groups;
    }, {});
  }
});

export default cartStore;
