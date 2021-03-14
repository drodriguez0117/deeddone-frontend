<template>
  <div>
    <form class="listing">
      <div>
        <label>{{ listing.listing_type }}</label>
      </div>
      <img
        v-if="listing.images.length > 0"
        v-bind:src="'http://localhost:3000' + listing.images[0].image"
        >
      <div>
        <label v-text="listing.title"></label>
      </div>
      <div>
        <label v-text="listing.description"></label>
      </div>
      <div>
        <label>Exchange Mode: {{ listing.exchange.name }}</label>
      </div>
      <div>
        <label>
          {{ listing.category.name }} {{ moment(listing.created_at).format('MM/DD/YYYY') }} - {{ moment(listing.expires_at).format('MM/DD/YYYY') }}
        </label>
      </div>
      <button
        v-on:click="updateListing"
        v-show="authorizedUser">
        Delete
      </button>
    </form>

    <!-- <v-card
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
    </v-card> -->
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
.listing {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  max-width: 375px;
}
img {
  margin-left: 1px;
  border-radius: 5px;
  max-width: 164px;
  max-height: 164px;
  width: auto;
  height: auto;
}
label {
  text-align: left;
}
</style>
