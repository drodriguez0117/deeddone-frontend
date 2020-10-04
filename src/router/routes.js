import Signin from '@/components/Signin.vue'
import Signup from '@/components/Signup.vue'
import List from '@/components/listings/List.vue'

export default [
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/',
    name: 'list',
    component: List
  },
  {
    path: '/:id',
    name: 'user_listings',
    component: List
  }
]
