<template>
  <div class="split-container">
    <div class="logo-container">
      <img class="logo-image"
           src="../assets/logo.png"
           width="300px">
      <h1 class="logo-text">Visual Research</h1>
    </div>
    <div class="login-container">
      <div class="login-content">
        <h1 class="greeting">Create an Account</h1>
        <p class="description">Visual Search Engine for PubMed data. Focuses on
          assisted exploration by way of representing the data that fosters
          discovery.</p>
        <input type="text"
               v-model="email"
               placeholder="Email address"
               class="input"
               required>
        <br />
        <input type="password"
               v-model="password"
               placeholder="Password"
               class="input"
               required>
        <br />
        <button v-on:click="signup"
                class="button">Register</button>
        <p>
          <router-link to="/login">
            Back
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'login',
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signup () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
        this.$router.replace('/login')
      }).catch((err) => {
        alert(err.message)
      });
    }
  }
}
</script>

<style scoped>
/* #f6c38c */
/* #545454 */
/* #404040 */
/* #e6e6e6 */
/* #6d6d6d */

.split-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.logo-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #404040;
  height: 100%;
  color: #e6e6e6;
  text-align: left;
}

.login-content {
  width: 70%;
  justify-content: flex-start;
  align-items: self-start;
  display: flex;
  flex-direction: column;
}

.login {
  margin-top: 40px;
}
input {
  align-self: center;
  margin: 10px 0;
  width: -webkit-fill-available;
  padding: 15px;
  background-color: transparent;
  border: 1px solid #e6e6e6;
  color: #e6e6e6;
}
button {
  width: -webkit-fill-available;
  padding: 10px 0;
  color: #404040;
  font-weight: 900;
}
a {
  text-decoration: none;
  color: #e6e6e6;
}

.logo-text {
  color: #545454;
}

.logo-image {
  filter: invert(91%) sepia(8%) saturate(2724%) hue-rotate(319deg)
    brightness(97%) contrast(98%);
}
</style>
