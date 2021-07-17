<template>
  <div class="listings">
    <h3> {{ this.$store.getters['users/getCurrentUserName'] }} Listings</h3>
    <v-text-field v-model="search_term"></v-text-field>
    <v-btn v-on:click="search">Search</v-btn>
    <form action="http://localhost:8080/api/v1/admin/listings"
      enctype="multipart/form-data"
      method="post">
      <v-btn v-on:click="login" v-show="!this.$store.getters['users/getCurrentUserName']">Login</v-btn>
      <v-btn v-on:click="logout" v-show="this.$store.getters['users/getCurrentUserName']">Logout</v-btn>
    </form>
    <v-alert
      v-if="error"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
        {{ error }}
    </v-alert>
    <v-btn v-on:click="createListing" v-show="this.$store.getters['users/getCurrentUserName']">Create New Card</v-btn>
    <v-container>
      <v-row dense>
        <v-col cols="3" v-for="listing in activeListings" v-bind:key="listing.id">
          <listing-card v-bind:listing="listing"></listing-card>
        </v-col>
      </v-row>
    </v-container>
    <br />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListingCard from '@/components/listings/ListingCard.vue'

export default {
  name: 'Listings',
  components: {
    ListingCard
  },
  created () {
    this.getListings()
  },
  data () {
    return {
      filteredUserId: null,
      error: '',
      search_term: '',
      images: [],
      form: new FormData()
    }
  },
  methods: {
    ...mapGetters({getUserId: 'users/getCurrentUserId'}),
    ...mapActions('listings', ['fetchListings', 'createListing', 'searchListings']),
    ...mapActions('users', ['signOut']),

    createListing () {
      this.$router.push('/listings/create')
    },
    login () {
      this.$router.push('/login')
    },
    logout () {
      this.signOut()
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    getListings () {
      this.fetchListings()
    },
    setUserId () {
      this.filteredUserId = this.getUserId()
    },
    search () {
      this.searchListings(this.search_term)
    }
  },
  computed: {
    activeListings: function () {
      return this.$store.getters['listings/getFilteredListings'](this.filteredUserId)
    }
  }
}
</script>
