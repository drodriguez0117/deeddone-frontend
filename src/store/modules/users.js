import createPersistedState from 'vuex-persistedstate'
import { plainAxiosInstance } from '../../backend/axios/index'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    currentUser: {},
    loggedIn: false,
    errors: [],
    token: null
  },
  getters: {
    getCurrentUserId (state) {
      return state.currentUser.id
    },
    getCurrentUserName (state) {
      return state.currentUser.email
    },
    getToken (state) {
      return state.token
    }
  },
  mutations: {
    setCurrentUser (state, payload) {
      state.currentUser = payload
      state.loggedIn = true
      state.token = payload.token
      localStorage.setItem('user', JSON.stringify(payload))
      localStorage.setItem('jwt', payload.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
    },
    unsetCurrentUser (state, payload) {
      state.currentUser = {}
      state.loggedIn = false
      state.errors.push(payload)
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('jwt')
    }
  },
  actions: {
    async signIn ({ commit }, user) {
      await plainAxiosInstance.post('/login', {email: user.email, password: user.password})
        .then((response) => {
          commit('setCurrentUser', response.data)
          return Promise.resolve(response)
        })
        .catch((error) => {
          commit('unsetCurrentUser', error.message)
          return Promise.reject(error)
        })
    },
    async register ({ commit }, user) {
      await plainAxiosInstance.post('/register', user)
        .then(({ response }) => {
          if (!response.data.error) {
            commit('setCurrentUser', response.data)
            return Promise.resolve(response)
          } else {
            commit('unsetCurrentUser', response.data.error)
            return Promise.reject(response.data.error)
          }
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    signOut ({ commit }) {
      commit('unsetCurrentUser', null)
      // await securedAxiosInstance.delete('/login')
      //   .then((response) => { return Promise.resolve(response) })
      //   .catch((error) => {
      //     return Promise.reject(error)
      //   })
    }
  },
  plugins: [createPersistedState]
}
