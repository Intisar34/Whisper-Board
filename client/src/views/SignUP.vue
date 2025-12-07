<template>
  <div class="backgroundColor">
    <h1 class="logo"> WhisperBoard </h1>

    <div class="paragraphBox">
      <p class="paragraph">
        A trusted space for students and faculty to discuss courses,
        university life, and careers without revealing their identity.
      </p>
    </div>

    <div class="signUpBox">
      <h1 class="title">Sign up</h1>

      <form>
        <div class="institution">
          <label for="institution">University</label>
          <input id="institution" type="text" v-model="institution" placeholder="University of Gothenburg or Chalmers...">
        </div>

        <div class="email">
          <label for="email">Email Address</label>
          <input id="email" type="email" v-model="email" placeholder="Enter your university email address...">
        </div>

        <div class="passwordRow">
          <div class="password">
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password" placeholder="Enter password...">
          </div>

          <div class="confirmPassword">
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="Enter confirmed password...">
          </div>
        </div>

        <div class="roleSelect">
          <label for="role">Choose your role:</label>
           <div class="roleRow">
            <select id="role" v-model="role" class="roleDropdown">
             <option disabled value="">Please select a role</option>
             <option v-for="r in ['Student', 'Alumni', 'Teacher', 'TA', 'other']" :key="r" :value="r">
              {{ r }}
             </option>
            </select>

           <div class="otherRole" v-if="role === 'other'">
            <label for="otherRole">Please specify:</label>
            <input type="text" id="otherRole" v-model="otherRoleName" placeholder="Enter your role...">
          </div>
        </div>
        </div>

        <button class="createButton" type="submit">Create Account</button>
          <p>--- Already have an account? ---</p>
        <button class="loginButton" type="button">Log In</button>
      </form>

    </div>
  </div>
</template>

<script>

export default {
  name: 'SignUP',

  data() {
    return {
      institution: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      otherRoleName: ''
    }
  }
}

</script>

<style src="../styles/signUp.css"></style>
