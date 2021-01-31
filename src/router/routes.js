import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
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
    name: 'listings',
    component: Listings
  },
  {
    path: '/:id',
    name: 'admin_listings',
    component: Listings
  }
]
