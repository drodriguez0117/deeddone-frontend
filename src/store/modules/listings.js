// import filter from '../../components/listings/filter-listings'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios/index'

export default {
  namespaced: true,
  state: {
    listing: [],
    listings: [],
    category: {id: null, name: ''},
    categories: []
  },
  getters: {
    getActiveListings: (state) => {
      console.log('listings: ' + this.listings)
      return state.listings
    },
    getFilteredListings: (state) => (id) => {
      if (!id) { return state.listings }
      return state.listings.filter((listing) => listing.user_id === id)
    },
    getListingCategory: (state) => (id) => {
      return state.listings.filter((listing) => listing.id === id)
    }
  },
  mutations: {
    setListings (state, listings) {
      state.listings = listings
    },
    clearListings (state) {
      state.listings = []
    },
    addImages (state, { id, listing }) {
      var listingIndex = state.listings.findIndex(prop => prop.id === id)
      state.listings[listingIndex].images = []
      state.listings[listingIndex].images = listing.images
    },
    removeImage (state, { inputId, response }) {
      var listingIndex = state.listings.findIndex(prop => prop.id === inputId)
      var imageIndex = state.listings[listingIndex].images.findIndex(images => images.image === response)
      state.listings[listingIndex].images.pop(imageIndex)
    }
  },
  actions: {
    async fetchListings ({ commit }) {
      await plainAxiosInstance.get('/listings')
        .then((response) => {
          commit('setListings', response.data)
          return Promise.resolve(response)
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
          return Promise.reject(error)
        })
    },
    async updateListing ({ commit }, { id, formData }) {
      await securedAxiosInstance.put('admin/listings/' + id, formData)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
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
    },
    async addImage ({ commit }, { id, formData }) {
      await securedAxiosInstance.post('admin/listings/' + id + '/listing_images', formData)
        .then((response) => {
          commit('addImages', { id: id, listing: response.data })
          return Promise.resolve()
        })
        .catch((error) => {
          console.log(error)
          return Promise.reject(error)
        })
    },
    async destroyImage ({ commit }, { id, image }) {
      let imageUrl = `${encodeURIComponent(image)}`
      await securedAxiosInstance.delete('admin/listings/' + id + '/listing_images/' + imageUrl)
        .then(() => {
          commit('removeImage', { inputId: id, response: image })
        })
        .catch((error) => { console.log('jsus, do something here: ' + error) })
    },
    async searchListings ({ commit }, query) {
      await plainAxiosInstance.get('/listings/search', {
        params: {
          qry: query,
          filter_path: 'hits.hits._source'
        }
      })
        .then((response) => {
          commit('setListings', response.data)
        })
        .catch((error) => { console.log('search was wasted: ' + error) })
    }
  }
}
