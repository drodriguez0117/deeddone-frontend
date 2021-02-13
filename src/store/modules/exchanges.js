import { securedAxiosInstance } from '../../backend/axios/index'

export default {
  namespaced: true,
  state: {
    exchanges: []
  },
  getters: {
    getExchanges (state) {
      return state.exchanges
    },
    getUserToken (state, getters, rootState, rootGetters) {
      return rootGetters['users/getToken']
    }
  },
  mutations: {
    setExchanges (state, exchanges) {
      state.exchanges = exchanges
    },
    clearExchanges (state) {
      state.exchanges = []
    }
  },
  actions: {
    async fetchExchanges ({ commit }) {
      await securedAxiosInstance.get('admin/exchanges', {
        headers: {
          'Authorization': `Bearer ${this.getters.getUserToken}`
        }
      })
        .then((response) => {
          commit('setExchanges', response.data)
        })
        .catch(error => {
          commit('clearExchanges')
          return Promise.reject(error)
        })
    }
  }
}
