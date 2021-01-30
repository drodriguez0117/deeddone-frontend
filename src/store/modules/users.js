import createPersistedState from 'vuex-persistedstate'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios/index'
// import axios from 'axios'

export default {
  namespaced: true,
  state: {
    currentUser: {},
    loggedIn: false,
    errors: []
  },
  getters: {
    // clearUserName: state => (id) => {
    //   return false
    // },
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
    },
    unsetCurrentUser (state, payload) {
      state.currentUser = {}
      state.loggedIn = false
      state.errors.push(payload)
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
        .then((response) => {
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
      // await axios.delete('http://localhost:3000/login', user)
      //   .then((response) => { return Promise.resolve(response) })
      //   .catch((error) => {
      //     console.log(error)
      //     return Promise.reject(error)
      //   })
    }
  },
  plugins: [createPersistedState]
}
