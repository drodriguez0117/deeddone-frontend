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
                  @submit="validateLogin"
                  @submit.prevent="loginUser">
                  <v-card-title>have a cigar...</v-card-title>
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
                    label="email address"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="password"
                    min="8"
                    required
                  ></v-text-field>
                  <v-btn type="submit" color="primary">Log In</v-btn>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <div>
            <router-link to="/register">Need to Register</router-link>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
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
        this.$store.dispatch('signIn', userCredentials)
          .then(() => this.$router.push('/'))
          .catch((error) => { this.errors.push(error.message) })
      }
    },
    isUserLoggedIn () {
      if (this.$store.state.users.loggedIn) {
        this.$router.push('/')
      }
    },
    validateLogin: function (e) {
      if (this.email && this.password) {
        return true
      }

      this.errors = []

      if (!this.email) {
        this.errors.push('Email required')
      }

      if (!this.password) {
        this.errors.push('Password required')
      }

      e.preventDefault()
    }
  }
}
</script>

<style lang="css">
.form-login {
  width: 70%;
  max-width: 500px;
  padding: 10% 15px;
  margin: 0 auto;
}
</style>
