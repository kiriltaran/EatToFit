import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import bus from '../main';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    products: [],
    menu: [],
    user: null,
    loading: false,
    error: null,
  },
  mutations: {
    setProducts(state, payload) {
      state.products = payload;
    },
    createProduct(state, payload) {
      state.products.push(payload);
    },
    inMenuToggle(state, payload) {
      state.products.forEach((el, index) => {
        if (el.id === payload) {
          state.products[index].inMenu = !state.products[index].inMenu;
        }
      });
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    loadProducts({ commit }) {
      commit('setLoading', true);
      firebase
        .database()
        .ref('products')
        .once('value')
        .then(data => {
          const products = [];
          const obj = data.val();
          for (let key in obj) {
            products.push({
              id: key,
              title: obj[key].title,
              cal: obj[key].cal,
              inMenu: false,
            });
          }
          commit('setProducts', products);
          commit('setLoading', false);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    createProduct({ commit, getters }, payload) {
      commit('setLoading', true);
      const product = {
        title: payload.title,
        cal: payload.cal,
        // creatorId: getters.user.id,
      };
      firebase
        .database()
        .ref('products')
        .push(product)
        .then(data => {
          const { key } = data;
          commit('createProduct', {
            ...product,
            id: key,
          });
          commit('setLoading', false);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    inMenuToggle({ commit }, payload) {
      commit('inMenuToggle', payload);
    },
    signUpUser({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          user
            .updateProfile({
              displayName: payload.name,
            })
            .then(() => {
              const newUser = {
                id: user.uid,
                displayName: user.displayName,
              };
              commit('setLoading', false);
              commit('setUser', newUser);
              bus.$emit('show-auth', false);
            })
            .catch(error => {
              commit('setLoading', false);
              commit('setError', error);
              console.log(error);
            });
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },
    signInUser({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          const newUser = {
            id: user.uid,
            displayName: user.displayName,
          };
          commit('setLoading', false);
          commit('setUser', newUser);
          bus.$emit('show-auth', false);
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', {
        id: payload.id,
        displayName: payload.displayName,
        photoURL: payload.photoURL,
      });
    },
    signInByGithub({ commit }) {
      commit('setLoading', true);
      commit('clearError');
      const provider = new firebase.auth.GithubAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          console.log(result);
          const newUser = {
            id: result.user.uid,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          };
          commit('setLoading', false);
          commit('setUser', newUser);
          bus.$emit('show-auth', false);
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },
    signInByTwitter({ commit }) {
      commit('setLoading', true);
      commit('clearError');
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          const newUser = {
            id: result.user.uid,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          };
          commit('setLoading', false);
          commit('setUser', newUser);
          bus.$emit('show-auth', false);
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },
    logout({ commit }) {
      firebase.auth().signOut();
      commit('setUser', null);
    },
    clearError({ commit }) {
      commit('clearError');
    },
  },
  getters: {
    products(state) {
      return state.products;
    },
    menu(state) {
      return state.products.filter(product => product.inMenu === true);
    },
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
  },
});

export default store;
