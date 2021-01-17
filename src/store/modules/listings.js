import filter from '../../components/listings/filter-listings'
// import axios from '../../backend/axios/index'
// import axios from 'axios'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios/index'

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
    async fetchListings ({ commit }) {
      await plainAxiosInstance.get('/listings')
        .then((response) => commit('setListings', response.data))
    },
    /*       this.$http.plain.get('/listings')
        .then((response) => {
          commit('setListings', response.data)
          this.$store.dispatch('unsetCurrentUser')
        })
        .catch(error => this.setError(error, 'Cannot get listings'))
    }, */
    async fetchListingsByUser ({commit}, id) {
      await securedAxiosInstance.get('/listings/' + id)
        .then(response => {
          commit('setListings', response.data)
          this.state.listings = response.data
          this.user_email = this.$store.getters.currentUserName
        })
        .catch(error => this.setError(error, 'Something is wrong'))
    }
  }
}
