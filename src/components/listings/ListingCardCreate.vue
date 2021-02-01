<template>
  <div class="create">
    <v-container>
      <v-layout>
        <v-flex sm9 sm6>
          <v-card>
            <v-card-text hover class="pt-1">
              <div>
                <v-card-title>create listing...</v-card-title>
                <v-alert
                  v-if="errors.length"
                  type="error"
                  prominent
                >
                  <b>Please correct the following error(s):</b>
                  <ul>
                    <li
                      v-for="error in errors"
                      :key="error"
                    >
                      {{ error }}
                    </li>
                  </ul>
                </v-alert>
                <v-text-field
                  v-model="title"
                  label="title"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="description"
                  label="description"
                ></v-text-field>
                <input type="radio" id="typeOffering" value="offering" v-model="listing_type">
                <label for="typeOffering">Offering</label>
                <input type="radio" id="typeRequest" value="request" v-model="listing_type">
                <label for="typeOffering">Request</label>
                <div>
                  <select v-model="category_id">
                    <option value="">Select Category</option>
                    <option value="0">Indoors</option>
                    <option value="1">Outdoors</option>
                  </select>
                </div>
                <form action="http://localhost:8080/api/v1/admin/listings"
                  enctype="multipart/form-data"
                  method="post">
                  <input type="file" accept="image/*" ref="inputImage" @change=uploadImage() multiple>
                  <v-btn v-on:click="createCard" v-show="this.$store.getters['users/getCurrentUserName']">Create that shit!</v-btn>
                </form>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'create',
  data () {
    return {
      title: '',
      description: '',
      images: [],
      category_id: null,
      listing_type: '',
      form: new FormData(),
      status: '',
      errors: []
    }
  },
  methods: {
    ...mapGetters({getUserId: 'users/getCurrentUserId'}),
    ...mapActions('listings', ['fetchListings', 'createListing']),

    uploadImage () {
      // this works for a single file
      // let imag = this.$refs.inputImage.files[0]
      // this.form.append('listing[images][]', imag)

      var fileCount = this.$refs.inputImage.files.length

      for (var i = 0; i < fileCount; i++) {
        this.form.append('listing[images][]', this.$refs.inputImage.files[i])
      }
    },
    createCard () {
      const cardProperties = {
        title: this.title,
        description: this.description,
        listing_type: this.listing_type,
        category_id: this.category_id
      }

      Object.entries(cardProperties).forEach(
        ([key, value]) => this.form.append('listing[' + key + ']', value)
      )

      this.createListing(this.form)
        .then((response) => {
          this.status = 'card created!'
          this.form = new FormData()
        })
        .catch((error) => {
          this.setError(error)
        })
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    }
  }
}
</script>

<style scoped>

</style>
