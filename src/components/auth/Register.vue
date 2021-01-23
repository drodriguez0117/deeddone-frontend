<template>
  <v-app>
    <v-container>
      <v-layout>
        <v-flex xs8 sm3>
          <v-card>
            <v-card-text hover class="pt-1">
              <div>
                <v-form
                  ref="form"
                  lazy-validation
                  @submit="validateRegistration"
                  @submit.prevent="register">
                  <v-card-title>Welcome, Sign up!</v-card-title>
                  <v-alert
                    v-if="errors.length"
                    type="error"
                    prominent
                  >
                    <b>Please correct the following error(s):</b>
                    <ul>
                      <li
                        v-for="error in errors"
                        :key="error"
                      >
                        {{ error }}
                      </li>
                    </ul>
                  </v-alert>
                  <v-text-field
                    v-model="email"
                    label="Email Address"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    min="8"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password_confirmation"
                    label="Password Confirmation"
                    min="8"
                    required
                  ></v-text-field>
                  <v-btn type="submit" color="primary">Sign Up</v-btn>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <div>
            <router-link to="/login">Need to log in</router-link>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
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
      if (!this.errors.length) {
        const newUser = {
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        }
        this.$store.dispatch('users/register', newUser)
          .then((response) => this.$router.push('/'))
          .catch((error) => { this.errors.push(error) })
      }
    },
    isUserLoggedIn () {
      if (this.$store.state.users.loggedIn) {
        this.$router.push('/listings')
      }
    },
    validateRegistration: function (e) {
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
      e.preventDefault()
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
    width: 70%;
    max-width: 500px;
    padding: 10% 15px;
    margin: 0 auto;
  }
</style>
