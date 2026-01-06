<template>
  <div class="backgroundColor">
    <img src="/WhisperBoardLogo.png" alt="WhisperBoard" class="logo">

    <div class="paragraphBox">
      <p class="paragraph">
        A trusted space for students and faculty to discuss courses,
        university life, and careers without revealing their identity.
      </p>
    </div>

    <div class="signUpBox card p-4 shadow border-0">
      <h1 class="title text-start mb-4">Sign up</h1>

      <!-- Success Message -->
      <div v-if="successMessage" class="alert alert-success d-flex align-items-center" role="alert">
        <span class="me-2">✓</span> {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
        <span class="me-2">✕</span> {{ errorMessage }}
      </div>

      <form v-on:submit.prevent="createUser">
        <div class="mb-3">
          <label for="institution" class="form-label">University</label>
          <input id="institution" type="text" class="form-control" v-model="institution" placeholder="University of Gothenburg or Chalmers..." required>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email Address</label>
          <input id="email" type="email" class="form-control" v-model="email" placeholder="Enter your university email address..." required>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label for="password" class="form-label">Password</label>
            <input id="password" type="password" class="form-control" v-model="password" placeholder="Enter password..." required>
          </div>

          <div class="col-md-6">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input id="confirmPassword" type="password" class="form-control" v-model="confirmPassword" placeholder="Confirm..." required>
          </div>
        </div>

        <div class="mb-4">
          <label for="role" class="form-label">Choose your role:</label>
          <select id="role" v-model="role" class="form-select mb-2" required>
            <option disabled value="">Please select a role</option>
            <option v-for="r in ['Student', 'Alumni', 'Teacher', 'TA', 'other']" :key="r" :value="r">
              {{ r }}
            </option>
          </select>

          <div v-if="role === 'other'">
            <input type="text" id="otherRole" class="form-control mt-2" v-model="otherRoleName" placeholder="Please specify your role..." required>
          </div>
        </div>

        <button class="btn btn-primary w-100 mb-3 fw-bold py-2" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <div class="d-flex align-items-center mb-3">
            <hr class="flex-grow-1">
            <span class="mx-2 text-muted small">Already have an account?</span>
            <hr class="flex-grow-1">
        </div>
        <button class="btn btn-outline-primary w-100 fw-bold py-2" type="button" @click="goToLogin">Log In</button>
      </form>

    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '@/store'

export default {
  name: 'SignUP',

  data() {
    return {
      institution: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      otherRoleName: '',
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

    createUser() {
      this.clearMessages()

      // Password match validation
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match. Please try again.'
        return
      }

      this.isLoading = true

      Api.post('/users', {
        institution: this.institution,
        email: this.email,
        password: this.password,
        role: this.role === 'other' ? 'other' : this.role,
        otherRoleName: this.role === 'other' ? this.otherRoleName : null
      })
        .then(response => {
          console.log('User Created:', response.data.data.user)
          this.successMessage = `Account successfully created! Your username is: ${response.data.data.user.username}. Redirecting to login...`

          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.goToLogin()
          }, 2000)
        })
        .catch(error => {
          if (error.response) {
            this.errorMessage = error.response.data.error
          } else if (error.request) {
            this.errorMessage = 'No response from server. Please try again later.'
          } else {
            this.errorMessage = error.message
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    goToLogin() {
      this.$router.push('/login')
    }
  }
}

</script>

<style src="../styles/signUp.css"></style>
