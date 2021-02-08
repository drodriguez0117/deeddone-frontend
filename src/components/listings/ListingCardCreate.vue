<template>
  <div class="create" id="app" data-app>
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
                  label="What do you want to give or get?"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="description"
                  label="Describe your offer or request"
                ></v-text-field>
                <v-select v-model="category_id"
                  :items="getDropdownCategories"
                  item-value="id"
                  item-text="name"
                  label="category"
                  outlined ></v-select>
                <input type="radio" id="typeOffering" value="offering" v-model="listing_type">
                <label for="typeOffering">Offering</label>
                <input type="radio" id="typeRequest" value="request" v-model="listing_type">
                <label for="typeOffering">Request</label>
                <v-select v-model="exchange_id"
                  :items="getDropdownExchanges"
                  item-value="id"
                  item-text="name"
                  label="exchange"
                  outlined ></v-select>
                <!-- <select v-model="category_id">
                  <option v-for="category in getDropdownCategories" v-bind:key="category.id" :value="category.id">{{ category.name }}</option>
                </select> -->
                <v-row
                  justify="space-around"
                  align="center"
                >
                  <v-radio-group v-model="expires_at">
                  <template v-slot:label>
                    <div><strong>When do you want this listing to expire?</strong></div>
                  </template>
                    <v-radio
                      v-for="n in expired_types"
                      :key="n"
                      :label="`${n > 0 ? n : ''} ${ n == 0 ? 'custom' : n === 1 ? 'day' : 'days'}`"
                      :value="n"
                      v-on:click="showCalendar">
                    </v-radio>
                  </v-radio-group>
                  <v-row justify="center">
                    <v-date-picker v-model="expires_picker" v-show="expires_picker_visible"></v-date-picker>
                  </v-row>
                </v-row>
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
import moment from 'moment'

export default {
  name: 'create',
  created () {
    this.getCategories()
    this.getExchanges()
  },
  data () {
    return {
      title: '',
      description: '',
      images: [],
      category_id: null,
      exchange_id: null,
      listing_type: '',
      form: new FormData(),
      status: '',
      errors: [],
      expires_at: 3,
      expired_types: [1, 3, 7, 14, 30, 90, 0],
      expires_picker: null,
      expires_picker_visible: false
    }
  },
  methods: {
    ...mapGetters({getUserId: 'users/getCurrentUserId'}),
    ...mapActions('categories', ['fetchCategories']),
    ...mapActions('exchanges', ['fetchExchanges']),
    ...mapActions('listings', ['createListing']),

    uploadImage () {
      // this works for a single file
      // let imag = this.$refs.inputImage.files[0]
      // this.form.append('listing[images][]', imag)

      var fileCount = this.$refs.inputImage.files.length

      for (var i = 0; i < fileCount; i++) {
        this.form.append('listing[images][]', this.$refs.inputImage.files[i])
      }
    },
    getCategories () {
      this.fetchCategories()
    },
    getExchanges () {
      this.fetchExchanges()
    },
    createCard () {
      const cardProperties = {
        title: this.title,
        description: this.description,
        listing_type: this.listing_type,
        category_id: this.category_id,
        exchange_id: this.exchange_id,
        expires_at: this.getExpiresDate
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
    },
    showCalendar () {
      console.log('showCalendar: ' + this.expires_at)
      this.expires_picker_visible = this.expires_at === 0
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
      var expiresDate = this.expires_at === 0 ? moment(this.expires_picker).add(1, 'days').diff(moment(), 'days') : this.expires_at
      var days = moment().add(expiresDate, 'days').format('yyyy-MM-DD')
      return days
    }
  }
}
</script>

<style scoped>

</style>
