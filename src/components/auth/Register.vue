<template>
  <div>
    <form novalidate class="form-register" @submit.prevent="validateRegistration">
      <label><b>Welcome, Sign up!</b></label>
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
      <div>
        <input
          type="text"
          class="showBorder"
          v-model="password_confirmation"
          min="8"
          required
          placeholder="password confirmation">
      </div>
      <button
        type="submit"
        v-on:click="register"
        class="showBorder">Sign Up</button>
      <div
        v-if="errors.length"
        type="error"
        prominent>
        <ul>
          <li v-for="(error, index) in errors" v-bind:key="index">{{ error }}</li>
        </ul>
      </div>
    </form>
    <div>
      <router-link to="/login">Need to log in?</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: '',
      password_confirmation: '',
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
    register () {
      if (!this.errors.length && this.validateRegistration()) {
        const newUser = {
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        }
        this.$store.dispatch('users/register', newUser)
          .then(() => this.$router.push('/'))
          .catch((error) => { this.errors.push(error) })
      }
    },
    isUserLoggedIn () {
      if (this.$store.state.users.loggedIn) {
        this.$router.push('/')
      }
    },
    validateRegistration (e) {
      this.errors = []

      if (!this.email) {
        this.errors.push('Email Address is required')
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Valid Email required')
      }

      if (!this.password) {
        this.errors.push('Password is required')
      }

      if (this.password.length < 8) {
        this.errors.push('Minimum password length: 8')
      }

      if (!this.password_confirmation) {
        this.errors.push('Please confirm your password')
      }

      if (this.password !== this.password_confirmation) {
        this.errors.push('Password Confirmation does not match Password')
      }

      if (this.email && this.password && this.password_confirmation) {
        return true
      }
      // e.preventDefault()
      return false
    },
    validEmail: function (email) {
      var reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return reg.test(email)
    }
  }
}
</script>

<style lang="css">
.form-register {
  height: 350px;
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
