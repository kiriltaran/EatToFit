const setProducts = (state, payload) => {
  state.products = payload;
};
const createProduct = (state, payload) => {
  state.products.push(payload);
};
const inMenuToggle = (state, payload) => {
  state.products.forEach((el, index) => {
    if (el.id === payload) {
      state.products[index].inMenu = !state.products[index].inMenu;
    }
  });
};
const setUser = (state, payload) => {
  state.user = payload;
  console.log(state.user);
};
const setLoading = (state, payload) => {
  state.loading = payload;
};
const setError = (state, payload) => {
  state.error = payload;
};
const clearError = state => {
  state.error = null;
};
const clearProducts = state => {
  state.products = [];
};

export {
  setProducts,
  createProduct,
  inMenuToggle,
  setUser,
  setLoading,
  setError,
  clearError,
  clearProducts,
};