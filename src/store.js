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
      return state.currentUser.id
    },
    currentUserName (state) {
      return state.currentUser.email
    }
  },
  mutations: {
    setCurrentUser (state, { currentUser }) {
      state.currentUser = currentUser
      state.signedIn = true
      state.csrf = currentUser.csrf
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
