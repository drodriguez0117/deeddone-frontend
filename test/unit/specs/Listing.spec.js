import Vue from 'vue'
import Listing from '@/components/listings/List.vue'
import { expect } from 'chai'

describe('List', () => {
  it('should show Listings text', () => {
    const Constructor = Vue.extend(Listing)
    const ListComponent = new Constructor().$mount()
    expect(ListComponent.$el.textContent).to.contain('Listings')
  })
})
