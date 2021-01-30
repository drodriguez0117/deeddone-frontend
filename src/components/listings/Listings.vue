<template>
  <div class="listings">
    <v-btn v-on:click="createCard" v-show="this.$store.getters['users/getCurrentUserName']">Log Out</v-btn>
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
    <v-btn v-on:click="setUserId" v-show="this.$store.getters['users/getCurrentUserName']">Only My Listings</v-btn>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Listings',
  created () {
    this.getListings()
  },
  data () {
    return {
      filteredUserId: null,
      error: ''
    }
  },
  methods: {
    ...mapGetters({getUserId: 'users/getCurrentUserId'}),
    ...mapActions('listings', ['fetchListings', 'createListing']),
    ...mapActions('users', ['signOut']),

    clickMe () {
      console.log('here you go...')
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    getListings () {
      this.fetchListings()
    },
    logout () {
      console.log('logout')
      var es = this.signOut(this.$store.state.users.currentUser)

      if (es) {
        this.filteredUserId = null
      }

      // this.$http.secured.delete('/login')
      //   .then(response => {
      //     // console.log('after logout response')
      //     // this.signOut(null)
      //     this.filteredUserId = null
      //   })
      //   .catch(error => this.setError(error, 'Cannot log out'))
    },
    setUserId () {
      this.filteredUserId = this.getUserId()
    },
    createCard () {
      const cardProperties = {
        listing: {
          title: 'test title',
          description: 'only come out at night',
          listing_type: 'offering',
          category_id: 1
        }
      }
      console.log(cardProperties)
      this.createListing(cardProperties)
      // this.$http.secured.post('admin/listings', cardProperties)
      //   .then((response) => {
      //     console.log(response.status)
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
    }
  },
  computed: {
    visibleListings: function () {
      return this.$store.getters['listings/getFilteredListings'](this.filteredUserId)
    }
  }
}
</script>
