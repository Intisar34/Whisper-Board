import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import HomeForum from './views/HomeForum.vue'
import signUP from './views/SignUP.vue'
import Login from './views/Login.vue'
import Profile from './views/Profile.vue'
import Post from './components/Post.vue'
import Forum from './components/Forum.vue'

const routes = [
  { path: '/', redirect: '/signup' },
  { path: '/home/posts', name: 'home', component: Home },
  { path: '/home/forums', name: 'homeForum', component: HomeForum },
  { path: '/signup', name: 'signUP', component: signUP },
  { path: '/login', name: 'login', component: Login },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/post', name: 'post', component: Post },
  { path: '/forums/:forumId', name: 'forumPage', component: Forum },
  { path: '/posts/:id', name: 'post', component: Post }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
