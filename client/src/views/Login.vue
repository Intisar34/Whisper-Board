<template>
  <div class="backgroundColor">
    <img src="/WhisperBoardLogo.png" alt="WhisperBoard" class="logo">

    <div class="paragraphBox">
      <p class="paragraph">
        A trusted space for students and faculty to discuss courses,
        university life, and careers without revealing their identity.
      </p>
    </div>

    <div class="loginBox">
      <h1 class="title">Log in</h1>

      <!-- Success Message -->
      <div v-if="successMessage" class="messageBox successMessage">
        <span>✓</span> {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="messageBox errorMessage">
        <span>✕</span> {{ errorMessage }}
      </div>

      <form @submit.prevent="loginUser">
        <div class="email">
          <label for="email">Email Address</label>
          <input id="email" type="email" v-model="email" placeholder="Enter your email address...">
        </div>

        <div class="password">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" placeholder="Enter your password...">
        </div>

        <button class="loginButton" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log in' }}
        </button>

        <p>--- Don't have an account? ---</p>

        <button class="signupButton" type="button" @click="goToSignup">Sign Up</button>
      </form>
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
      password: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false
    }
  },

  methods: {
    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },

    async loginUser() {
      this.clearMessages()

      if (!this.email || !this.password) {
        this.errorMessage = 'Both email and password are required!'
        return
      }

      this.isLoading = true

      try {
        const response = await Api.post('users/login', {
          email: this.email,
          password: this.password
        })

        // Stores in the global store
        store.setUser(response.data.data)

        this.successMessage = 'Login successful! Redirecting...'

        setTimeout(() => {
          this.$router.push('/home/posts')
        }, 1000)
      } catch (err) {
        if (err.response) {
          this.errorMessage = err.response.data.error
        } else if (err.request) {
          this.errorMessage = 'No response from server. Please try again later.'
        } else {
          this.errorMessage = err.message
        }
      } finally {
        this.isLoading = false
      }
    },

    goToSignup() {
      this.$router.push('/signup')
    }
  }
}
</script>

<style src="../styles/Login.css"></style>
