<template>
  <v-app>
    <v-container>
      <v-layout>
        <v-flex xs8 sm3>
          <v-card>
            <v-card-text hover class="pt-4">
              <div>
                <v-form
                  ref="form"
                  lazy-validation
                  @submit.prevent="signin">
                  <div>
                    <v-alert
                      v-if="error"
                      color="blue-grey"
                      dark
                      dense
                      icon="mdi-school"
                      prominent
                    >
                    {{ error }}
                    </v-alert>
                  </div>
                  <div>
                    <v-alert
                      v-if="error"
                      prominent
                      type="error"
                    >
                      <v-row align="center">
                        <v-col class="grow">
                          {{ error }}
                        </v-col>
                      </v-row>
                    </v-alert>
                  </div>
                  <div>
                    <v-alert
                      v-if="error"
                      text
                      prominent
                      icon="mdi-cloud-alert">
                        {{ error }}
                    </v-alert>
                  </div>
                  <v-text-field
                    v-model="email"
                    label="Enter your email address"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Enter your password"
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
      error: ''
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
      this.$http.plain.post('/signin', { email: this.email, password: this.password })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
      } else {
        this.$store.commit('setCurrentUser', { currentUser: response.data })
        this.error = ''
        this.$router.push({path: '/' + response.data.id})
      }
    },
    signinFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
      this.$store.commit('unsetCurrentUser')
    },
    checkSignedIn () {
      if (this.$store.state.signedIn) {
        this.$router.replace('/')
      }
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
