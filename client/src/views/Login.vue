<template>
    <div class="loginpage">
        <div class="background">

            <h1 class="logo"> WhisperBoard </h1>

            <div class="loginbox">
                <h2> Log in </h2>

                <div class=username>
                    <p> Username </p>
                        <input type = "string" v-model="username"/>
                </div>

                <div class=password>
                    <p> Password </p>
                        <input type = "password" v-model="password"/>
                </div>

                <button class=button1 type = "submit"> Log in </button>
                <button class=button2 type = "submit"> Forgot password? </button>
             </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style src='../styles/Login.css'></style>
