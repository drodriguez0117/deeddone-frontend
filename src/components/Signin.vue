<template>
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
      label="Fill in your  email Address"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
    ></v-text-field>
    <v-btn type="submit">Sign In</v-btn>
    <div>
      <router-link to="/signup">Sign Up</router-link>
    </div>
  </v-form>
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
