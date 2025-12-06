import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import signUP from './views/SignUP.vue'
import Login from './views/Login.vue'

const routes = [
  { path: '/home/posts', name: 'home', component: Home },
  { path: '/signup', name: 'signUP', component: signUP },
  { path: '/login', name: 'login', component: Login }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

