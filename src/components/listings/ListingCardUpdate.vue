<template>
  <div class="update" id="app" data-app>
    <div>
      <router-link :to="{ name: 'listings' }">home</router-link>
      <label>update listing...</label>
      <!-- errors -->
      <div
        v-if="errors.length"
        type="error"
        prominent>
        <ul>
          <li
            v-for="error in errors"
            :key="error">
            {{ error }}
          </li>
        </ul>
      </div>
      <div>
        <!-- listing type -->
        <div>
          <input type="radio" v-model="listing.listing_type" id="offering" name="Offering" value="offering">
          <label for="offering">Offering</label>
          <input type="radio" v-model="listing.listing_type" id="request" name="Request" value="request">
          <label for="request">Request</label>
        </div>
        <!-- upload images -->
        <div>
          <form
            @submit.prevent
            enctype="multipart/form-data"
            action="http://localhost:8080/listings"
            method="put">
            <input type="file" accept="image/*" ref="input" @change=createImages() multiple>
          </form>
        </div>
        <!-- preview images -->
        <base-image-viewer
          v-if="this.images"
          v-bind:images="this.images"
          v-bind:isPreview="true"></base-image-viewer>
        <!-- source images -->
        <base-image-viewer
          v-if="listing.images.length > 0"
          v-bind:images="listing.images"
          v-bind:listingId="listing.id"
          v-bind:isPreview="false"></base-image-viewer>
        <!-- title -->
        <div>
          <input
            type="text"
            class="showBorder"
            v-model="listing.title"
            required
            placeholder="what is it?">
        </div>
        <!-- description -->
        <div>
          <input
            type="text"
            class="showBorder"
            v-model="listing.description"
            placeholder="additional information">
        </div>
        <!-- category and exchange -->
        <div>
          <label>Category:</label>
          <select v-model="listing.category.id" class="showBorder">
            <option
              v-for="category in getDropdownCategories"
              :key="category.id"
              :value="category.id">{{ category.name }}</option>
          </select>
          <label>Exchange:</label>
          <select v-model="listing.exchange.id" class="showBorder">
            <option
              v-for="exchange in getDropdownExchanges"
              :key="exchange.id"
              :value="exchange.id">{{ exchange.name }}</option>
          </select>
        </div>
        <input type="date" v-model="listing.expires_at">
        <button v-on:click="updateCard" v-show="this.$store.getters['users/getCurrentUserName']" class="showBorder">UPDATE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'

import BaseImageViewer from '../BaseImageViewer.vue'

export default {
  name: 'update',
  components: {
    BaseImageViewer
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
              .then(() => {
                this.images = []
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
      console.log(this.listing)
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
.showBorder {
  border: 2px solid red;
  border-radius: 4px;
  padding: 5px;
}

</style>
