
import createPersistedState from 'vuex-persistedstate'

export default {
  state: {
    currentUser: {},
    csrf: null,
    loggedIn: false
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
      state.loggedIn = true
      state.csrf = currentUser.csrf
    },
    unsetCurrentUser (state) {
      state.currentUser = {}
      state.loggedIn = false
      state.csrf = null
    },
    refresh (state, csrf) {
      state.loggedIn = true
      state.csrf = csrf
    }
  },
  plugins: [createPersistedState]
}
