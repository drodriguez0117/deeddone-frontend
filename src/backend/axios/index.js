import axios from 'axios'
import { store } from './../../store'

const API_URL = 'http://localhost:3000'

const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// might want to restrict: method !== 'GET'
securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS') {
    config.headers = {
      ...config.headers,
      'Authorization': 'Bearer ' + store.state.users.token
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, async error => {
  if (error.response && error.response.config && error.response.status === 401) {
    try {
      plainAxiosInstance.get('/login')
        .then(response => store.commit('users/setCurrentUser', { currentUser: response }))

      return plainAxiosInstance.request()
    } catch (error) {
      store.commit('users/unsetCurrentUser')
      location.replace('/login')
      return Promise.reject(error)
    }
  } else {
    return Promise.reject(error)
  }
})

export { securedAxiosInstance, plainAxiosInstance }
