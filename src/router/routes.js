import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Listings from '@/components/listings/Listings.vue'

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/',
    name: 'list',
    component: Listings
  },
  {
    path: '/:id',
    name: 'admin_listings',
    component: Listings
  }
]
