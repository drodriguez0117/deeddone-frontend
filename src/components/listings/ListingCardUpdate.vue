<template>
  <div class="create" id="app" data-app>
    <v-container>
      <v-layout>
        <v-flex sm9 sm6>
          <v-card width="700px">
            <v-card-text hover class="pt-1">
              <div>
                <router-link :to="{ name: 'listings' }">home</router-link>
                <v-card-title>update listing...</v-card-title>
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
                <v-row>
                  <!-- listing type -->
                  <v-col>
                    <v-radio-group
                      v-model="listing.listing_type"
                      row>
                      <v-radio
                        label="Offering"
                        value="offering"
                      ></v-radio>
                      <v-radio
                        label="Request"
                        value="request"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <!-- upload images -->
                  <v-col>
                    <form action="http://localhost:8080/api/v1/admin/listings/image_listings"
                      enctype="multipart/form-data"
                      method="post">
                      <input type="file" accept="image/*" ref="input" @change="createImages()" multiple>
                    </form>
                  </v-col>
                </v-row>
                <!-- preview images -->
                <image-viewer
                  v-if="this.images"
                  v-bind:images="this.images"
                  v-bind:isPreview="true"></image-viewer>
                <!-- source images -->
                <image-viewer
                  v-if="listing.images.length > 0"
                  v-bind:images="listing.images"
                  v-bind:listingId="listing.id"
                  v-bind:isPreview="false"></image-viewer>
                <!-- title -->
                <v-text-field
                  v-model="listing.title"
                  label="What do you want to give or get?"
                  required
                ></v-text-field>
                <!-- description -->
                <v-text-field
                  v-model="listing.description"
                  label="additional information"
                ></v-text-field>
                <v-row>
                  <!-- category -->
                  <v-col>
                    <v-select v-model="listing.category.id"
                      :items="getDropdownCategories"
                      item-value="id"
                      item-text="name"
                      label="category"
                      outlined></v-select>
                  </v-col>
                  <!-- exchange -->
                  <v-col>
                  <v-select v-model="listing.exchange.id"
                    :items="getDropdownExchanges"
                    item-value="id"
                    item-text="name"
                    label="exchange"
                    outlined></v-select>
                  </v-col>
                </v-row>
                <!-- vuetify date-picker dialog/menu  -->
                <v-row
                  justify="space-around"
                  align="center"
                  >
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Expires"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-btn v-on:click="updateCard" v-show="this.$store.getters['users/getCurrentUserName']">Update!</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'

import ImageViewer from '@/components/ImageViewer.vue'

export default {
  name: 'update',
  components: {
    ImageViewer
  },
  props: ['listing'],
  created () {
    this.getCategories()
    this.getExchanges()
  },
  data () {
    return {
      errors: [],
      images: [],
      expires_picker: null,
      expires_picker_visible: false,
      expired_types: [1, 3, 7, 14, 30, 90, 0],
      form: new FormData(),
      // expires_at
      date: this.listing.expires_at,
      menu: false,
      modal: false,
      menu2: false,
      previewImage: null
    }
  },
  methods: {
    ...mapActions('categories', ['fetchCategories']),
    ...mapActions('exchanges', ['fetchExchanges']),
    ...mapActions('listings', ['updateListing', 'addImage']),

    getCategories () {
      this.fetchCategories()
    },
    getExchanges () {
      this.fetchExchanges()
    },
    showCalendar () {
      this.expires_picker_visible = this.expires_at === 0
    },
    createImages () {
      if (this.$refs.input.files && this.$refs.input.files[0]) {
        var fileCount = this.$refs.input.files.length

        if (fileCount > 0) {
          for (var i = 0; i < fileCount; i++) {
            this.form = new FormData()
            let file = this.$refs.input.files[i]
            this.images.push(URL.createObjectURL(file))
            this.listing.images.push(URL.createObjectURL(file))
            this.form.append('images[]', file)

            this.addImage({ id: this.listing.id, formData: this.form })
              .then((response) => {
                this.status = 'image added!'
                this.form = new FormData()
              })
              .catch((error) => {
                console.log(error)
                this.setError(error)
              })
          }
        }
      }
    },
    uploadImages () {
      if (this.$refs.input.files && this.$refs.input.files[0]) {
        var fileCount = this.$refs.input.files.length

        if (fileCount > 0) {
          // if the source image is a category default picture, clear it out
          if (this.listing.images.length === 1) {
            var categoryImage = this.listing.category.default_image_path
            var image = this.listing.images[0].image

            if (image.slice(image.lastIndexOf('/') + 1, image.length) === categoryImage) {
              this.listing.images = []
            }
          }

          if (this.listing.images.length !== 0) {
            for (var g = 0; g < this.listing.images.length; g++) {
              let img = this.listing.images[0]
              console.log('image stfy: ' + JSON.stringify(img))
              console.log('image count: ' + this.images.length)
              // this.form.append('listing[images][]', this.listing.images[g].image)
              let file = this.listing.images[g].image

              let storageUrl = 'http://localhost:8080' + this.listing.images[g].image
              console.log('storage url: ' + storageUrl)

              var blob = file.substr(28, file.lastIndexOf('/') - 1)
              console.log('blob: ' + blob)

              var filename = blob.slice(blob.lastIndexOf('/') + 1, blob.length)
              console.log('filename: ' + filename)
              var x = new Blob([blob], { type: 'image/jpeg' })

              this.form.append('listing[images][]', x, filename)
            }
          }

          for (var i = 0; i < fileCount; i++) {
            let file = this.$refs.input.files[i]
            this.images.push(URL.createObjectURL(file))
            this.listing.images.push(URL.createObjectURL(file))
            this.form.append('listing[images][]', file)
          }
        }
      }
    },
    updateCard () {
      console.log('how many: ' + this.images.length)
      const cardProperties = {
        title: this.listing.title,
        description: this.listing.description,
        listing_type: this.listing.listing_type,
        category_id: this.listing.category.id,
        exchange_id: this.listing.exchange.id,
        expires_at: this.getExpiresDate
      }
      // for (var i = 0; i < this.images.length; i++) {
      //   this.form.append('listing[images][]', JSON.stringify(this.images[i]))
      // }

      Object.entries(cardProperties).forEach(
        ([key, value]) => this.form.append('listing[' + key + ']', value)
      )

      for (var key in this.form) {
        console.log(key, this.form[key])
      }

      this.updateListing({ id: this.listing.id, formData: this.form })
        .then((response) => {
          this.status = 'card updated!'
          this.form = new FormData()
        })
        .catch((error) => {
          console.log(error)
          this.setError(error)
        })
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    }
  },
  computed: {
    getDropdownCategories: function () {
      return this.$store.getters['categories/getCategories']
    },
    getDropdownExchanges: function () {
      return this.$store.getters['exchanges/getExchanges']
    },
    getExpiresDate: function () {
      var expiresDate = this.listing.expires_at === 0 ? moment(this.expires_picker).add(1, 'days').diff(moment(), 'days') : this.expires_at
      var days = moment().add(expiresDate, 'days').format('yyyy-MM-DD')
      return days
    }
  }
}
</script>

<style scoped>

</style>
