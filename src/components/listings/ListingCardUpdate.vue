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
                    <form action="http://localhost:8080/api/v1/admin/listings"
                      enctype="multipart/form-data"
                      method="post">
                      <input type="file" accept="image/*" ref="input" @change="uploadImages()" multiple>
                    </form>
                  </v-col>
                </v-row>
                <!-- preview images -->
                <v-item-group multiple>
                  <v-container>
                    <v-row>
                      <v-col
                        v-for="(n, i) in images"
                        :key="i"
                        cols="i"
                        class="d-flex child-flex"
                        >
                        <v-item>
                          <v-img
                            v-bind:src="getPreviewSource(i)"
                            alt="images"
                            aspect-ratio="4"
                          >
                          </v-img>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-item-group>
                <!-- source images -->
                <v-item-group multiple>
                  <v-container>
                    <v-row>
                      <v-col
                        v-for="(n, i) in listing.images"
                        :key="i"
                        cols="i"
                        class="d-flex child-flex"
                        >
                        <v-item>
                          <v-img
                            v-bind:src="getImageSource(i)"
                            alt="listing.images[i].image"
                            aspect-ratio="4"
                          >
                          </v-img>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-item-group>
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

export default {
  name: 'update',
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

    uploadImages () {
      if (this.$refs.input.files && this.$refs.input.files[0]) {
        var fileCount = this.$refs.input.files.length

        if (fileCount > 0) {
          for (var i = 0; i < fileCount; i++) {
            // let reader = new FileReader()
            // reader.onload = e => console.log(e.target.result)
            // console.log(reader.readAsDataURL(this.$refs.input.files[i]))
            var file = this.$refs.input.files[i]
            this.images.push(URL.createObjectURL(file))
          }
        }
      }
    },
    getCategories () {
      this.fetchCategories()
    },
    getExchanges () {
      this.fetchExchanges()
    },
    updateCard () {
      const cardProperties = {
        title: this.listing.title,
        description: this.listing.description,
        listing_type: this.listing.listing_type,
        category_id: this.listing.category_id,
        exchange_id: this.listing.exchange_id,
        expires_at: this.getExpiresDate
      }

      Object.entries(cardProperties).forEach(
        ([key, value]) => this.form.append('listing[' + key + ']', value)
      )

      // this.updateListing(this.form)
      //   .then((response) => {
      //     this.status = 'card created!'
      //     this.form = new FormData()
      //   })
      //   .catch((error) => {
      //     this.setError(error)
      //   })
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error)
    },
    showCalendar () {
      this.expires_picker_visible = this.expires_at === 0
    },
    getImageSource: function (i) {
      return 'http://localhost:3000' + this.listing.images[i].image
    },
    getPreviewSource: function (i) {
      return this.images[i]
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
