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
        <div class="fullName">
          <label for="fullName">Full Name</label>
          <input id="fullName" type="text" v-model="fullName">
        </div>

        <div class="email">
          <label for="email">Email Address</label>
          <input id="email" type="email" v-model="email">
        </div>

        <div class="passwordRow">
          <div class="password">
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password">
          </div>

          <div class="confirmPassword">
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" v-model="confirmPassword">
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
  name: 'SignUP'
}

</script>

<style src="../styles/signUp.css"></style>
