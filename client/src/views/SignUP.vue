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
          <div class=full-name>
            <p> Full Name</p>
              <input type= "String" v-model="fullName"/>
        </div>

     <div class="password-row">
        <div class=password>
            <p> Password</p>
              <input type= "password" v-model="password"/>
        </div>

        <div class=confirm-password>
            <p> Confirm Password</p>
              <input type= "password" v-model="password"/>
        </div>
     </div>

    <div class=email-address>
            <p> Email Address</p>
              <input type= "String" v-model="emailAddress"/>
    </div>
        <button class="create-button" type="submit">Create Account</button>
                --- Already have an account? ---
        <button class="login-button" type="submit"> Log In</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'SignUP'
}

</script>

<style src="../styles/sign-up.css"></style>
