import { securedAxiosInstance } from '../../backend/axios/index'

export default {
  namespaced: true,
  state: {
    categories: []
  },
  getters: {
    getCategories (state) {
      return state.categories
    },
    getUserToken (state, getters, rootState, rootGetters) {
      return rootGetters['users/getToken']
    }
  },
  mutations: {
    setCategories (state, categories) {
      state.categories = categories
    },
    clearCategories (state) {
      state.categories = []
    }
  },
  actions: {
    async fetchCategories ({ commit }) {
      await securedAxiosInstance.get('admin/categories', {
        headers: {
          'Authorization': `Bearer ${this.getters.getUserToken}`
        }
      })
        .then((response) => {
          commit('setCategories', response.data)
        })
        .catch(error => {
          commit('clearCategories')
          return Promise.reject(error)
        })
    }
  }
}
