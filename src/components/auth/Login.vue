<template>
  <div>
    <form novalidate class="form-login" @submit="validateLogin">
      <label><b>have a cigar...</b></label>
      <div>
        <input
          type="text"
          class="showBorder"
          v-model="email"
          required
          placeholder="email address">
      </div>
      <div>
        <input
          type="text"
          class="showBorder"
          v-model="password"
          min="8"
          required
          placeholder="password">
      </div>
      <button
        type="submit"
        v-on:click="loginUser"
        class="showBorder">Log In</button>
      <div
        v-if="errors.length"
        type="error"
        prominent>
        <ul>
          <li
            v-for="error in errors"
            :key="error">
            {{ error }}
          </li>
        </ul>
      </div>
    </form>
    <div>
      <router-link to="/register">Not an active member? Register</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      errors: []
    }
  },
  created () {
    this.isUserLoggedIn()
  },
  updated () {
    this.isUserLoggedIn()
  },
  methods: {
    loginUser () {
      if (!this.errors.length) {
        const userCredentials = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('users/signIn', userCredentials)
          .then(() => {
            this.errors = []
            this.$router.push('/')
          })
          .catch((error) => {
            this.setSignInError(error)
          })
      }
    },
    isUserLoggedIn () {
      if (this.$store.state.users.loggedIn) {
        this.$router.push('/')
      }
    },
    validateLogin: function (event) {
      this.errors = []

      if (!this.email && !this.password) {
        event.preventDefault()
        return false
      }

      if (this.email && this.password) {
        this.loginUser()
        return true
      }

      if (!this.email) {
        this.errors.push('Email required')
      }

      if (!this.password) {
        this.errors.push('Password required')
      }

      event.preventDefault()
    },
    setSignInError (error) {
      this.errors = []

      if (!error.response) {
        this.errors.push(error.message)
      } else {
        this.errors.push('Login failed.  Please check email and password')
      }
    }
  }
}
</script>

<style lang="css">
.form-login {
  height: 300px;
  width: 300px;
  padding: 15px;
  margin: 0 auto;
  border: 2px solid;
}
.showBorder {
  border: 2px solid red;
  border-radius: 4px;
  padding: 5px;
}
input {
  padding: 10px;
  margin: 10px;
}
ul {
  list-style-type: none;
}
</style>
