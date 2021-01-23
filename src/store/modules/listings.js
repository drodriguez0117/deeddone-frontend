import filter from '../../components/listings/filter-listings'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios/index'

export default {
  namespaced: true,
  state: {
    listings: []
  },
  getters: {
    getUserListings (state, id) {
      return filter.getUserListings(state.listings, id)
    },
    getListings (state, isActive) {
      if (isActive) {
        return (listings) => state.listings
      }
    }
  },
  mutations: {
    setListings (state, listings) {
      state.listings = listings
    },
    clearListings (state) {
      state.listings = []
    }
  },
  actions: {
    async fetchListings ({ commit }) {
      await plainAxiosInstance.get('/listings')
        .then((response) => commit('setListings', response.data))
        .catch(error => {
          commit('clearListings')
          return Promise.reject(error)
        })
    },
    async fetchListingsByUser ({commit}, id) {
      await securedAxiosInstance.get('/listings/' + id)
        .then(response => {
          commit('setListings', response.data)
          return Promise.resolve(response)
        })
        .catch(error => {
          commit('clearListings')
          return Promise.reject(error)
        })
    }
  }
}
