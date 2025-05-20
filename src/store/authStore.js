import { reactive, readonly } from 'vue';
import authService from '../services/authService';

// State
const state = reactive({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  error: null,
  loading: false
});

// Actions
const actions = {
  async register(userData) {
    state.loading = true;
    state.error = null;
    try {
      const response = await authService.register(userData);
      state.user = response.user;
      state.isAuthenticated = true;
      state.loading = false;
      return response;
    } catch (error) {
      state.error = error.message || 'Registrasi gagal';
      state.loading = false;
      throw error;
    }
  },

  async login(email, password) {
    state.loading = true;
    state.error = null;
    try {
      const response = await authService.login(email, password);
      state.user = response.user;
      state.isAuthenticated = true;
      state.loading = false;
      return response;
    } catch (error) {
      state.error = error.message || 'Login gagal';
      state.loading = false;
      throw error;
    }
  },

  logout() {
    authService.logout();
    state.user = null;
    state.isAuthenticated = false;
  },

  clearError() {
    state.error = null;
  }
};

export default { state: readonly(state), actions };