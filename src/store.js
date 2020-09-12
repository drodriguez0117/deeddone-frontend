import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentUser: {},
    csrf: null,
    listings: []
  },
  getters: {
    currentUserId (state) {
      return state.currentUser && state.currentUser.Id
    }
  },
  mutations: {
    setCurrentUser (state, { currentUser, csrf }) {
      state.currentUser = currentUser
      state.signedIn = true
      state.csrf = csrf
    },
    unsetCurrentUser (state) {
      state.currentUser = {}
      state.csrf = null
      state.signedIn = false
    },
    refresh (state, csrf) {
      state.signedIn = true
      state.csrf = csrf
    }
  },
  plugins: [createPersistedState]
})
