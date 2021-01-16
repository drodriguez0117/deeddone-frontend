import Vue from 'vue'
import Vuex from 'vuex'

import userModule from './modules/users'
import listingModule from './modules/listings'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    users: userModule,
    listings: listingModule
  },
  state: {
  },
  getters: {
  },
  mutations: {
  }
})
