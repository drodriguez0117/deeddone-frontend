import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import List from '@/components/listings/List.vue'

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
    component: List
  },
  {
    path: '/:id',
    name: 'admin_listings',
    component: List
  }
]
