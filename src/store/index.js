import Vue from 'vue'
import Vuex from 'vuex'

import userModule from './modules/users'
import listingModule from './modules/listings'
import categoryModule from './modules/categories'
import exchangeModule from './modules/exchanges'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    users: userModule,
    listings: listingModule,
    categories: categoryModule,
    exchanges: exchangeModule
  },
  state: {
  },
  getters: {
  },
  mutations: {
  }
})
