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
      <v-card-subtitle v-text="listing.description" align="left">      </v-card-subtitle>
      <v-card-text align="left">Exchange Mode: {{ listing.exchange.name }}</v-card-text>
      <v-card-text align="left">
          {{ listing.category.name }} {{ moment(listing.created_at).format('MM/DD/YYYY') }} - {{ moment(listing.expires_at).format('MM/DD/YYYY') }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    listing: Object
  },
  data () {
    return {
    }
  }
}

</script>

<style scoped>
h4 {
  color: green;
}
</style>
