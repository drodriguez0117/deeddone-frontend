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
                  @submit="checkLogin"
                  @submit.prevent="login">
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
      errors: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    login () {
      if (!this.errors.length) {
        this.$http.plain.post('/login', { email: this.email, password: this.password })
          .then(response => this.loginSuccessful(response))
          .catch(errors => this.loginFailed(errors))
      }
    },
    loginSuccessful (response) {
      if (!response.data.csrf) {
        this.loginFailed(response)
      } else {
        this.$store.commit('setCurrentUser', { currentUser: response.data })
        this.errors = []
        this.$router.push({path: '/' + response.data.id})
      }
    },
    loginFailed (error) {
      this.errors.push((error.response && error.response.data && error.response.data.error) || '')
      this.$store.commit('unsetCurrentUser')
    },
    checkSignedIn () {
      if (this.$store.state.signedIn) {
        this.$router.replace('/')
      }
    },
    checkLogin: function (e) {
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
