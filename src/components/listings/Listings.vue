<template>
  <div class="listings">
    <h3> {{ this.$store.getters['users/getCurrentUserName'] }} Listings</h3>
    <input v-on:click="login" v-show="!this.$store.getters['users/getCurrentUserName']" value="Login">
    <input v-on:click="logout" v-show="this.$store.getters['users/getCurrentUserName']" value="Logout">
    <input type="text" size="50" class="showBorder" v-model="search_term">
    <input type="button" v-on:click="search" value="Search">
    <input v-on:click="createListing" v-show="this.$store.getters['users/getCurrentUserName']" value="Create Listing">
    <div>
      <div class="grid">
        <div v-for="listing in activeListings" v-bind:key="listing.id" >
          <listing-card v-bind:listing="listing"></listing-card>
        </div>
      </div>
    </div>
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
      // return this.$store.getters['listings/getActiveListings']
      return this.$store.getters['listings/getFilteredListings'](this.filteredUserId)
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 20px;
}
.showBorder {
  border: 2px solid red;
  border-radius: 4px;
}
.grid {
  height: 100%;
  margin: 30px 100px;
  padding: 10px 100px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
