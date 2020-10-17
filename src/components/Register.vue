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
                  @submit="checkRegister"
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
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    register () {
      if (!this.errors.length) {
        this.$http.plain.post('/register', { email: this.email, password: this.password, password_confirmation: this.password_confirmation })
          .then(response => this.registerSuccessful(response))
          .catch(error => this.registerFailed(error))
      }
    },
    registerSuccessful (response) {
      if (!response.data.csrf) {
        this.registerFailed(response)
      } else {
        this.$store.commit('setCurrentUser', { currentUser: response.data })
        this.errors = []
        this.$router.replace('/listings')
      }
    },
    registerFailed (error) {
      this.errors.push(error.response && error.response.data && error.response.data.error)
      this.$store.commit('unsetCurrentUser')
    },
    checkLoggedIn () {
      if (this.$store.signedIn) {
        this.$router.replace('/listings')
      }
    },
    checkRegister: function (e) {
      this.errors = []

      if (this.email && this.password && this.password_confirmation && this.password.length >= 8) {
        return true
      }

      if (!this.email) {
        this.errors.push('Email Address is required')
      }

      if (!this.password) {
        this.errors.push('Password is required')
      }

      if (this.password.length < 8) {
        this.errors.push('Minimum password length, keep going')
      }

      if (!this.password_confirmation) {
        this.errors.push('Please confirm your password')
      }
      e.preventDefault()
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
