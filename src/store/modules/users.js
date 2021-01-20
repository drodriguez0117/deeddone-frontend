import createPersistedState from 'vuex-persistedstate'
import { plainAxiosInstance } from '../../backend/axios/index'

export default {
  state: {
    currentUser: {},
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
    },
    unsetCurrentUser (state, errorMessage) {
      state.currentUser = {}
      state.loggedIn = false
      state.errors.push(errorMessage)
    }
  },
  actions: {
    signIn (commit, user) {
      return new Promise((resolve, reject) => {
        plainAxiosInstance.post('/login', {email: user.email, password: user.password})
          .then((response) => {
            this.commit('setCurrentUser', response.data)
            resolve(response)
          })
          .catch((error) => {
            this.commit('unsetCurrentUser', error.message)
            reject(error)
          })
      })
    },
    register (commit, user) {
      return new Promise((resolve, reject) => {
        plainAxiosInstance.post('/register', user)
          .then((response) => {
            if (!response.data.error) {
              this.commit('setCurrentUser', response.data)
              resolve(response)
            } else {
              this.commit('unsetCurrentUser', response.data.error)
              reject(response.data.error)
            }
          })
          .catch((error) => {
            this.commit('unsetCurrentUser', error.message)
            reject(error)
          })
      })
    }
  },
  plugins: [createPersistedState]
}
