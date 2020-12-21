<template>
  <div class="listings">
    <v-btn v-on:click="logout" v-show="this.user_email">Log Out</v-btn>
    <v-alert
      v-if="error"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
        {{ error }}
    </v-alert>
    <h3> {{ user_email }} Listings</h3>
    <v-container>
      <v-row dense>
        <v-col
          cols="3"
          v-for="listing in listings"
          :key="listing.id"
          >
          <v-card
            class="d-flex"
            :elevation="listing - 1"
            max-width="374"
            color="pink"
          >
            <v-card-title
              class="headline"
              v-text="listing.title"
            >
            </v-card-title>
            <v-img
              v-if="listing.images.length > 0"
              v-bind:src="'http://localhost:3000' + listing.images[0].image"
              class="white--text align-end"
              height="200px"
              aspect-ratio="1"
            >
            </v-img>
            <v-card-subtitle
              v-text="listing.description"
              align="left"
            >
            </v-card-subtitle>
            <v-card-text
              class="align-content-stretch"
            >
                {{ listing.listing_type }} {{ moment(listing.created_at).format('MM/DD/YYYY') }}
            </v-card-text>
            <!-- <v-card-text> {{ listing.created_at }} </v-card-text> -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
        this.$http.plain.get('/listings')
          .then(response => {
            this.listings = response.data
            this.user_email = ''
          })
          .catch(error => this.setError(error, 'Cannot get listings'))
      } else {
        this.$http.secured.get('/listings/' + this.$store.getters.currentUserId)
          .then(response => {
            this.listings = response.data
            this.user_email = this.$store.getters.currentUserName
          })
          .catch(error => this.setError(error, 'Something is wrong'))
      }
    },
    logout () {
      this.$http.secured.delete('/login')
        .then(response => {
          this.$store.commit('unsetCurrentUser')
        })
        .catch(error => this.setError(error, 'Cannot log out'))
    }
  }
}
</script>
