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
    <v-btn v-on:click="getUserListings">Only My Listings</v-btn>
    <v-container>
      <v-row dense>
        <v-col
          cols="3"
          v-for="listing in visibleListings"
          v-bind:key="listing.id"
          >
          <v-card
            class="d-flex"
            :elevation="listing - 1"
            max-width="374"
          >
            <v-img
              v-if="listing.images.length > 0"
              v-bind:src="'http://localhost:3000' + listing.images[0].image"
              height="200px"
              aspect-ratio="1"
              @click="clickMe"
            >
              <v-app-bar
                flat
                color="rgba(0, 0, 0, 0)"
              >
                <v-toolbar-title class="white-text">
                  <span class="white-text">{{ listing.listing_type }}</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-app-bar>
            </v-img>
            <v-card-subtitle
              v-text="listing.title"
              align="left"
            >
            </v-card-subtitle>
            <v-card-text
              v-text="listing.description"
              align="left"
            >
            </v-card-text>
            <v-card-text>
                {{ listing.category.name }} {{ moment(listing.created_at).format('MM/DD/YYYY') }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <br />
  </div>
</template>

<script>
export default {
  name: 'Listings',
  created () {
    this.getListings()
  },
  data () {
    return {
      listings: [],
      error: '',
      user_email: ''
    }
  },
  methods: {
    clickMe () {
      this.user_email = 'You clicked me'
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    getListings () {
      if (!this.$store.getters.currentUserId) {
        this.$store.dispatch('fetchListings')
      /*         this.$http.plain.get('/listings')
          .then(response => {
            this.listings = response.data
            this.user_email = ''
          })
          .catch(error => this.setError(error, 'Cannot get listings')) */
      }
    },
    getUserListings () {
      if (this.$store.getters.currentUserId) {
        this.$store.dispatch('fetchListingsByUser', this.$store.getters.currentUserId)
      /*         this.$http.secured.get('/listings/' + this.$store.getters.currentUserId)
          .then(response => {
            this.listings = response.data
            this.user_email = this.$store.getters.currentUserName
          })
          .catch(error => this.setError(error, 'Something is wrong')) */
      }
    },
    logout () {
      this.$http.secured.delete('/login')
        .then(response => {
          this.$store.commit('unsetCurrentUser')
        })
        .catch(error => this.setError(error, 'Cannot log out'))
    }
  },
  computed: {
    visibleListings () {
      return this.$store.getters.getListings(true)
    }
  }
}
</script>
