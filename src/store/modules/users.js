import createPersistedState from 'vuex-persistedstate'
import { plainAxiosInstance } from '../../backend/axios/index'

export default {
  state: {
    currentUser: {},
    csrf: null,
    loggedIn: false,
    errors: []
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
    setCurrentUser (state, currentUser) {
      state.currentUser = currentUser
      state.loggedIn = true
      state.csrf = currentUser.csrf
    },
    unsetCurrentUser (state, errorMessage) {
      state.currentUser = {}
      state.loggedIn = false
      state.csrf = null
      state.errors.push(errorMessage)
    },
    refresh (state, csrf) {
      state.loggedIn = true
      state.csrf = csrf
    }
  },
  actions: {
    signIn (commit, user) {
      return new Promise((resolve, reject) => {
        plainAxiosInstance.post('/login', {email: user.email, password: user.password})
          .then((response) => this.commit('setCurrentUser', response.data))
          .catch((error) => {
            this.commit('unsetCurrentUser', error.message)
            reject(error)
          })
      })
    }
  },
  plugins: [createPersistedState]
}
