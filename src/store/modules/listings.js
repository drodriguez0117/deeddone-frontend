// import filter from '../../components/listings/filter-listings'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios/index'

export default {
  namespaced: true,
  state: {
    listings: [],
    category: {id: null, name: ''},
    categories: []
  },
  getters: {
    getFilteredListings: (state) => (id) => {
      if (!id) { return state.listings }
      return state.listings.filter((listing) => listing.user_id === id)
    }
  },
  mutations: {
    setListings (state, listings) {
      console.log('setListings')
      state.listings = listings
    },
    clearListings (state) {
      console.log('clearListings')
      state.listings = []
    }
  },
  actions: {
    async fetchListings ({ commit }) {
      await plainAxiosInstance.get('/listings')
        .then((response) => {
          commit('setListings', response.data)
        })
        .catch(error => {
          commit('clearListings')
          return Promise.reject(error)
        })
    },
    async fetchListingsByUser ({ commit }, id) {
      await securedAxiosInstance.get('/listings/' + id)
        .then(response => {
          commit('setListings', response.data)
          return Promise.resolve(response)
        })
        .catch(error => {
          commit('clearListings')
          return Promise.reject(error)
        })
    },
    async createListing ({ commit }, formData) {
      await securedAxiosInstance.post('admin/listings', formData)
        .then(response => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          console.log(error)
          return Promise.reject(error)
        })
    },
    async destroyListing ({ commit }, id) {
      await securedAxiosInstance.delete('admin/listings/' + id)
        .then(response => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          console.log(error)
          return Promise.reject(error)
        })
    }
  }
}
