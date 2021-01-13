import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Listing from '@/components/listings/Listings.vue'
import { expect } from 'chai'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Listings', () => {
  it('should show Listings text', () => {
    const Constructor = Vue.extend(Listing)
    const ListComponent = new Constructor().$mount()
    expect(ListComponent.$el.textContent).to.contain('Listings')
  })
  it('should display username with Listings text', () => {
    const store = new Vuex.Store({
      getters: {
        currentUserId: () => 23,
        currentUserName: () => 'melvin@domain.com'
      }
    })
    const wrapper = shallowMount(Listing, {store, localVue})
    // wrapper.setData({ user_email: 'melvin@domain.com' })

    expect(wrapper.vm.user_email).toBe('melvin@domain.com')
  })
})
