<template>
    <div class="loginpage">
        <div class="background">

            <h1 class="logo"> WhisperBoard </h1>

            <div class="loginbox">
                <h2> Log in </h2>

                <div class=username>
                    <p> Email </p>
                        <input type = "text" v-model="email" placeholder="Enter your email"/>
                </div>

                <div class=password>
                    <p> Password </p>
                        <input type = "password" v-model="password" placeholder="Enter your password"/>
                </div>

                <button class=button1 @click = "loginUser"> Log in </button>
                <button class=button2 @click = "goToSignup"> Forgot password? </button>
             </div>
        </div>
    </div>
</template>

<script>

import { Api } from '@/Api'
import { store } from '../store'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    async loginUser() {
      if (!this.email || !this.password) {
        alert('Both email and password is required!')
        return
      };

      try {
        const response = await Api.post('users/login', {
          email: this.email,
          password: this.password
        })

        // Stores in the global store
        store.setUser(response.data.data)

        this.$router.push('/home/posts')
      } catch (err) {
        if (err.response) {
          alert(`Login failed: ${err.response.data.error}`)
        }
      }
    }
  }
}

</script>

<style src='../styles/Login.css'></style>
