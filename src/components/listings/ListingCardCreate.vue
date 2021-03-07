<template>
  <div class="create" id="app" data-app>
    <v-container>
      <v-layout>
        <v-flex sm9 sm6>
          <v-card width="500px">
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
                <v-row>
                  <v-col>
                    <v-radio-group
                      v-model="listing_type"
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
                  <v-col>
                    <image-viewer
                      v-bind:images="this.images"
                      v-bind:isPreview="true">
                    </image-viewer>
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="title"
                  label="What do you want to give or get?"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="description"
                  label="additional information"
                ></v-text-field>
                <v-row>
                  <v-select v-model="category_id"
                    :items="getDropdownCategories"
                    item-value="id"
                    item-text="name"
                    label="category"
                    outlined></v-select>
                  <v-select v-model="exchange_id"
                    :items="getDropdownExchanges"
                    item-value="id"
                    item-text="name"
                    label="exchange"
                    outlined></v-select>
                </v-row>
                <v-row
                  justify="space-around"
                  align="center"
                >
                  <v-chip-group v-model="expires_at">expires?
                    <v-chip
                      v-for="(n, i) in expired_types"
                      :key="i"
                      :label="true"
                      :value="n"
                      v-on:click="showCalendar"
                      active-class="deep-purple accent-4 white--text"
                      column>
                    {{ n > 0 ? n : 'custom' }}
                    </v-chip>
                  </v-chip-group>
                  <v-date-picker v-model="expires_picker" color="green lighten-1" header-color="primary" v-show="expires_picker_visible"></v-date-picker>
                </v-row>
                <form action="http://localhost:8080/api/v1/admin/listings"
                  enctype="multipart/form-data"
                  method="post">
                  <input type="file" accept="image/*" ref="input" @change=uploadImages() multiple>
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
import BaseImageViewer from '@/components/BaseImageViewer.vue'

export default {
  name: 'create',
  components: {
    BaseImageViewer
  },
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
      listing_type: 'offering',
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

    getCategories () {
      this.fetchCategories()
    },
    getExchanges () {
      this.fetchExchanges()
    },
    showCalendar () {
      this.expires_picker_visible = this.expires_at === 0
    },
    uploadImages () {
      if (this.$refs.input.files && this.$refs.input.files[0]) {
        var fileCount = this.$refs.input.files.length

        if (fileCount > 0) {
          for (var i = 0; i < fileCount; i++) {
            var file = this.$refs.input.files[i]
            this.images.push(URL.createObjectURL(file))
            this.form.append('listing[images][]', file)
          }
        }
      }
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
