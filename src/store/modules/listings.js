import filter from '../../components/listings/filter-listings'

export default {
  state: {
    listings: []
  },
  getters: {
    getUserListings (state, id) {
      // return state.listings
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
    }
  },
  actions: {
    fetchListings ({ commit }) {
      this.$http.plain.get('/listings')
        .then((response) => {
          commit('setListings', response.data)
          this.$store.dispatch('unsetCurrentUser')
        })
        .catch(error => this.setError(error, 'Cannot get listings'))
    },
    fetchListingsByUser ({commit}, id) {
      this.$http.secured.get('/listings/' + id)
        .then(response => {
          commit('setListings', response.data)
          this.state.listings = response.data
          this.user_email = this.$store.getters.currentUserName
        })
        .catch(error => this.setError(error, 'Something is wrong'))
    }
  }
}
