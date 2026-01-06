<template>
  <div class="backgroundColor">
    <img src="/WhisperBoardLogo.png" alt="WhisperBoard" class="logo">

    <div class="paragraphBox">
      <p class="paragraph">
        A trusted space for students and faculty to discuss courses,
        university life, and careers without revealing their identity.
      </p>
    </div>

    <div class="loginBox card p-4 shadow border-0">
      <h1 class="title text-start mb-4">Log in</h1>

      <!-- Success Message -->
      <div v-if="successMessage" class="alert alert-success d-flex align-items-center" role="alert">
        <span class="me-2">✓</span> {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
        <span class="me-2">✕</span> {{ errorMessage }}
      </div>

      <form @submit.prevent="loginUser">
        <div class="mb-3">
          <label for="email" class="form-label">Email Address</label>
          <input id="email" type="email" class="form-control" v-model="email" placeholder="Enter your email address..." required>
        </div>

        <div class="mb-4">
          <label for="password" class="form-label">Password</label>
          <input id="password" type="password" class="form-control" v-model="password" placeholder="Enter your password..." required>
        </div>

        <button class="btn btn-primary w-100 mb-3 fw-bold py-2" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log in' }}
        </button>

        <div class="d-flex align-items-center mb-3">
          <hr class="flex-grow-1">
          <span class="mx-2 text-muted small">Don't have an account?</span>
          <hr class="flex-grow-1">
        </div>

        <button class="btn btn-outline-primary w-100 fw-bold py-2" type="button" @click="goToSignup">Sign Up</button>
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

  created() {
    if (store.user) {
      this.$router.replace('/home/posts')
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
