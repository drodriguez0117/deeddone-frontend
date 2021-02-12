<template>
  <div id='listing-card'>
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
      >
        <v-app-bar flat color="rgba(0, 0, 0, 0)">
          <v-toolbar-title class="white-text">
            <span class="white-text">{{ listing.listing_type }}</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-app-bar>
      </v-img>
      <v-card-title v-text="listing.title" align="left"></v-card-title>
      <v-card-subtitle v-text="listing.description" align="left"></v-card-subtitle>
      <v-card-text align="left">Exchange Mode: {{ listing.exchange.name }}</v-card-text>
      <v-card-text align="left">
          {{ listing.category.name }} {{ moment(listing.created_at).format('MM/DD/YYYY') }} - {{ moment(listing.expires_at).format('MM/DD/YYYY') }}
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="deep-purple accent-4"
          v-on:click="deleteListing"
          v-show="authorizedUser"
        >
          Delete
        </v-btn>
        <v-btn
          text
          color="deep-purple accent-4"
          v-on:click="updateListing"
          v-show="authorizedUser"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    listing: Object
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    ...mapActions('listings', ['destroyListing', 'updateListingId']),

    deleteListing () {
      console.log('deleteListing' + this.listing.id)
      this.destroyListing(this.listing.id)
        .then((response) => {
          console.log(response)
          this.message = 'nice delete'
          console.log(this.message)
        })
    },
    updateListing () {
      this.$router.push({ name: 'update', params: { listing: this.listing } })
    }
  },
  computed: {
    ...mapGetters({getUserId: 'users/getCurrentUserId'}),

    authorizedUser: function () {
      const userId = this.getUserId
      return userId > 0 && this.listing.user_id === userId
    }
  }
}

</script>

<style scoped>
h4 {
  color: green;
}
</style>
