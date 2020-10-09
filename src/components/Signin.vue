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
                  @submit="checkSignin"
                  @submit.prevent="signin">
                  <v-card-title>have a cigar...</v-card-title>
                  <div>
                    <v-alert
                      v-if="errors.length"
                      color="red"
                      dark
                      icon="mdi-school"
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
                  </div>
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
                  <v-btn type="submit" color="primary">Sign In</v-btn>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <div>
            <router-link to="/signup">Need to sign up</router-link>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'Signin',
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
    signin () {
      if (!this.errors.length) {
        this.$http.plain.post('/signin', { email: this.email, password: this.password })
          .then(response => this.signinSuccessful(response))
          .catch(errors => this.signinFailed(errors))
      }
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
      } else {
        this.$store.commit('setCurrentUser', { currentUser: response.data })
        this.errors = []
        this.$router.push({path: '/' + response.data.id})
      }
    },
    signinFailed (error) {
      this.errors = (error.response && error.response.data && error.response.data.error) || ''
      this.$store.commit('unsetCurrentUser')
    },
    checkSignedIn () {
      if (this.$store.state.signedIn) {
        this.$router.replace('/')
      }
    },
    checkSignin: function (e) {
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
.form-signin {
  width: 70%;
  max-width: 500px;
  padding: 10% 15px;
  margin: 0 auto;
}
</style>
