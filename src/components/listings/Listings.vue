<template>
  <div class="listings">
    <h3> {{ this.$store.getters['users/getCurrentUserName'] }} Listings</h3>
    <form action="http://localhost:8080/api/v1/admin/listings"
      enctype="multipart/form-data"
      method="post">
      <input type="file" accept="image/*" ref="inputImage" @change=uploadImage() multiple>
      <v-btn v-on:click="login" v-show="!this.$store.getters['users/getCurrentUserName']">Login</v-btn>
      <v-btn v-on:click="logout" v-show="this.$store.getters['users/getCurrentUserName']">Logout</v-btn>
    </form>
    <h3> {{ status }} </h3>
    <v-alert
      v-if="error"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
        {{ error }}
    </v-alert>
    <v-btn v-on:click="clickMe" v-show="this.$store.getters['users/getCurrentUserName']">Create New Card</v-btn>
    <v-container>
      <v-row dense>
        <v-col cols="3" v-for="listing in visibleListings" v-bind:key="listing.id">
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
      this.$router.push('/listings/create')
    },
    login () {
      this.$router.push('/login')
    },
    logout () {
      this.signOut()
    },
    uploadImage () {
      // this works for a single file
      // let imag = this.$refs.inputImage.files[0]
      // this.form.append('listing[images][]', imag)

      var fileCount = this.$refs.inputImage.files.length

      for (var i = 0; i < fileCount; i++) {
        this.form.append('listing[images][]', this.$refs.inputImage.files[i])
      }
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    getListings () {
      this.fetchListings()
    },
    // logout () {
    //   console.log('logout')
    //   var es = this.signOut(this.$store.state.users.currentUser)

    //   if (es) {
    //     this.filteredUserId = null
    //   }
    // },
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
          this.status = 'card created!'
          this.form = new FormData()
          this.fetchListings()
        })
        .catch((error) => {
          this.setError(error)
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
