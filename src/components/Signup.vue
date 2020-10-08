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
                  @submit.prevent="signup">
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
            <router-link to="/signin">Need to sign in</router-link>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'Signup',
  data () {
    return {
      email: '',
      password: '',
      password_confirmation: '',
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
    signup () {
      this.$http.plain.post('/signup', { email: this.email, password: this.password, password_confirmation: this.password_confirmation })
        .then(response => this.signupSuccessful(response))
        .catch(error => this.signupFailed(error))
    },
    signupSuccessful (response) {
      if (!response.data.csrf) {
        this.sigupFailed(response)
      } else {
        this.$store.commit('setCurrentUser', { currentUser: response.data })
        this.error = ''
        this.$router.replace('/listings')
      }
    },
    signupFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error)
      this.$store.commit('unsetCurrentUser')
    },
    checkSignedIn () {
      if (this.$store.signedIn) {
        this.$router.replace('/listings')
      }
    }
  }
}
</script>

<style lang="css">
  .form-signup {
    width: 70%;
    max-width: 500px;
    padding: 10% 15px;
    margin: 0 auto;
  }
</style>
