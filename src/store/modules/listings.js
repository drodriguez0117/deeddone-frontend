// import filter from '../../components/listings/filter-listings'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios/index'

export default {
  namespaced: true,
  state: {
    listings: []
  },
  getters: {
    getFilteredListings: (state) => (id) => {
      if (!id) { return state.listings }
      return state.listings.filter((listing) => listing.user_id === id)
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
      console.log('fetchListings')
      await plainAxiosInstance.get('/listings')
        .then((response) => commit('setListings', response.data))
        .catch(error => {
          commit('clearListings')
          return Promise.reject(error)
        })
    },
    async fetchListingsByUser ({ commit }, id) {
      console.log('fetchListingsByUser: ' + id)
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
