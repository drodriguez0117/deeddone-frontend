import { axios } from 'vue/types/umd'
import createPersistedState from 'vuex-persistedstate'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios/index'

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
      console.log('getCurrentUserId: ' + state.currentUser.id)
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
      state.token = currentUser.token
      localStorage.setItem('user', JSON.stringify(currentUser))
      // axios.defaults.headers.common['Authorization'] = `Bearer ${currentUser.token}`
    },
    unsetCurrentUser (state, payload) {
      state.currentUser = {}
      state.loggedIn = false
      state.errors.push(payload)
      state.token = null
    }
  },
  actions: {
    async signIn ({ commit }, user) {
      await plainAxiosInstance.post('/login', {email: user.email, password: user.password})
        .then((response) => {
          console.log('in signin')
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
    async signOut ({ commit }, user) {
      await securedAxiosInstance.delete('/login')
        .then((response) => { return Promise.resolve(response) })
        .catch((error) => {
          console.log(error)
          return Promise.reject(error)
        })
    }
  },
  plugins: [createPersistedState]
}
