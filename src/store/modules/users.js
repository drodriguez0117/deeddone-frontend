import createPersistedState from 'vuex-persistedstate'
import { plainAxiosInstance } from '../../backend/axios/index'

export default {
  namespaced: true,
  state: {
    currentUser: {},
    loggedIn: false,
    errors: []
  },
  getters: {
    getCurrentUserId (state) {
      return state.currentUser.id
    },
    getCurrentUserName (state) {
      return state.currentUser.email
    }
  },
  mutations: {
    setCurrentUser (state, currentUser) {
      state.currentUser = currentUser
      state.loggedIn = true
    },
    unsetCurrentUser (state, errorMessage) {
      state.currentUser = {}
      state.loggedIn = false
      state.errors.push(errorMessage)
    }
  },
  actions: {
    async signIn (commit, user) {
      await plainAxiosInstance.post('/login', {email: user.email, password: user.password})
        .then((response) => {
          this.commit('users/setCurrentUser', response.data)
          return Promise.resolve(response)
        })
        .catch((error) => {
          this.commit('users/unsetCurrentUser', error.message)
          return Promise.reject(error)
        })
    },
    async register (commit, user) {
      await plainAxiosInstance.post('/register', user)
        .then((response) => {
          if (!response.data.error) {
            this.commit('users/setCurrentUser', response.data)
            return Promise.resolve(response)
          } else {
            this.commit('users/unsetCurrentUser', response.data.error)
            return Promise.reject(response.data.error)
          }
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    }
  },
  plugins: [createPersistedState]
}
