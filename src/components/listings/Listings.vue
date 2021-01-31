<template>
  <div class="listings">
    <form action="http://localhost:8080/api/v1/admin/listings"
      enctype="multipart/form-data"
      method="post">
      <p>Image :</p><input type="file" accept="image/*" ref="inputImage" @change=uploadImage()>
      <v-btn v-on:click="createCard" v-show="this.$store.getters['users/getCurrentUserName']">Create that shit!</v-btn>
    </form>
    <h3> {{ this.status }} </h3>
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
      error: '',
      status: 'This should be a status from create',
      images: [],
      form: new FormData()
    }
  },
  methods: {
    ...mapGetters({getUserId: 'users/getCurrentUserId'}),
    ...mapActions('listings', ['fetchListings', 'createListing']),
    ...mapActions('users', ['signOut']),

    clickMe () {
      console.log('here you go...')
    },
    uploadImage () {
      let images = this.$refs.inputImage.files[0]
      this.form.append('listing[images][]', images)
      // for (let image in images) {
      //   this.form.append('listing[images][]', image[0])
      // }
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
    },
    setUserId () {
      this.filteredUserId = this.getUserId()
    },
    createCard () {
      const cardProperties = {
        title: 'test title',
        description: 'only come out at night',
        listing_type: 'offering',
        category_id: 1
      }

      Object.entries(cardProperties).forEach(
        ([key, value]) => this.form.append('listing[' + key + ']', value)
      )

      this.createListing(this.form)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          this.error = error
          console.log(error)
        })
    }
  },
  computed: {
    visibleListings: function () {
      return this.$store.getters['listings/getFilteredListings'](this.filteredUserId)
    }
  }
}
</script>
