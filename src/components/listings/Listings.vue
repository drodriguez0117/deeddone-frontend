<template>
  <div class="listings">
    <v-btn v-on:click="logout" v-show="this.$store.getters['users/getCurrentUserName']">Log Out</v-btn>
    <v-alert
      v-if="error"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
        {{ error }}
    </v-alert>
    <h3> {{ this.$store.getters['users/getCurrentUserName'] }} Listings</h3>
    <v-btn v-on:click="getUserListings" v-show="this.$store.getters['users/getCurrentUserName']">Only My Listings</v-btn>
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
      error: ''
    }
  },
  methods: {
    clickMe () {
      console.log('here you go...')
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    getListings () {
      if (!this.$store.getters['users/getCurrentUserId']) {
        this.$store.dispatch('listings/fetchListings')
      }
    },
    getUserListings () {
      if (this.$store.getters['users/getCurrentUserId']) {
        this.error = this.$store.dispatch('listings/fetchListingsByUser', this.$store.getters['users/getCurrentUserId'])
        if (this.error) {
          this.setError(this.error, 'Issue retrieving listings for user')
        }
      }
    },
    logout () {
      this.$http.secured.delete('/login')
        .then(response => {
          this.$store.commit('users/unsetCurrentUser')
        })
        .catch(error => this.setError(error, 'Cannot log out'))
    }
  },
  computed: {
    visibleListings () {
      return this.$store.getters['listings/getListings'](true)
    }
  }
}
</script>
