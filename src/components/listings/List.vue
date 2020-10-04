<template>
  <div class="listings">
    <button v-on:click="signOut" v-show="this.user_email">Sign Out</button>
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <h3> {{ user_email }} Listings</h3>
    <ul class="list-group">
      <li class="list-group-item" v-for="listing in listings" :key="listing.id" :listing="listing">
          <label>Title: {{ listing.title }}</label>
          <label>Description: {{ listing.description }}</label>
          <label>Listing Type: {{ listing.listing_type }}</label>
          <label>Created: {{  listing.created_at }}</label>
      </li>
    </ul>
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
          // this.$router.replace('/')
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  }
}
</script>
