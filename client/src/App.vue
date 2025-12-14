<template>
  <div id="app">
    <div id="nav">
      <router-link to="/home/posts">Home</router-link>
      <router-link to="/signup">Signup</router-link>
      <router-link v-if="store.user" to="/login" @click="logout">Logout</router-link>
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<script>
import { store } from './store'

export default {
  data() {
    return {
      store
    }
  },
  mounted() {
    store.initialize()
  },
  methods: {
    logout() {
      store.clearUser()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
