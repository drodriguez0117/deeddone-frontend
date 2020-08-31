<template>
  <div class="listings">
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <h3>Listings</h3>
    <ul class="list-group">
      <li class="list-group-item" v-for="listing in listings" :key="listing.id" :listing="listing">
          <label>Title: {{ listing.title }}</label>
          <label>Description: {{ listing.description }}</label>
          <label>Listing Type: {{ listing.listing_type_id }}</label>
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
      error: ''
    }
  },
  created () {
    if (!localStorage.signedIn) {
      this.$router.replace('/')
    } else {
      this.$http.secured.get('/api/v1/listings')
        .then(response => { this.listings = response.data })
        .catch(error => this.setError(error, 'Something is wrong'))
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    signOut () {
      this.$http.secured.delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.signedIn
          this.$router.replace('/')
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  }
}
</script>
