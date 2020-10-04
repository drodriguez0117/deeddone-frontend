<template>
  <div class="listings">
    <button v-on:click="signOut" v-show="this.user_email">Sign Out</button>
    <v-alert
      v-if="error"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert">
        {{ error }}
    </v-alert>
    <h3> {{ user_email }} Listings</h3>
    <div class="listings-list">
      <v-card
        class="listing-card"
        outlined
        v-for="listing in listings"
        :key="listing.id"
      >
        <v-card-title class="headline d-flex justify-space between"> {{ listing.title }} </v-card-title>
        <v-card-subtitle> {{ listing.description }} </v-card-subtitle>
        <v-card-text> {{ listing.listing_type }} </v-card-text>
        <v-card-text> {{ listing.created_at }} </v-card-text>
      </v-card>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      listings: [],
      error: '',
      user_email: ''
    }
  },
  created () {
    this.getListings()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    getListings () {
      if (!this.$store.getters.currentUserId) {
        this.$http.plain.get('/api/v1/listings')
          .then(response => {
            this.listings = response.data
            this.user_email = ''
          })
          .catch(error => this.setError(error, 'Cannot get listings'))
      } else {
        this.$http.secured.get('/api/v1/listings/' + this.$store.getters.currentUserId)
          .then(response => {
            this.listings = response.data
            this.user_email = this.$store.getters.currentUserName
          })
          .catch(error => this.setError(error, 'Something is wrong'))
      }
    },
    signOut () {
      this.$http.secured.delete('/signin')
        .then(response => {
          this.$store.commit('unsetCurrentUser')
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  }
}
</script>
