<template>
  <div class="background-color">
    <h1 class="logo"> WhisperBoard </h1>

    <div class="paragraph-box">
      <p class="paragraph">
        A trusted space for students and faculty to discuss courses,
        university life, and careers without revealing their identity.
      </p>
    </div>

    <div class="sign-up-box">
      <h1 class="title">Sign up</h1>

      <form>
        <div class="full-name">
          <label for="fullName">Full Name</label>
          <input id="fullName" type="text" v-model="fullName">
        </div>

        <div class="email-address">
          <label for="emailAddress">Email Address</label>
          <input id="emailAddress" type="email" v-model="emailAddress">
        </div>

        <div class="password-row">
          <div class="password">
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password">
          </div>

          <div class="confirm-password">
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" v-model="confirmPassword">
          </div>
        </div>
        <button class="create-button" type="submit">Create Account</button>
          <p>--- Already have an account? ---</p>
        <button class="login-button" type="button">Log In</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUP'
}

</script>

<style src="../styles/sign-up.css"></style>
