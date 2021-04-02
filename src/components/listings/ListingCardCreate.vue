<template>
  <div class="create" id="app" data-app>
    <div>
      <label>create listing...</label>
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
          <input type="radio" v-model="listing_type" id="offering" name="Offering" value="offering">
          <label for="offering">Offering</label>
          <input type="radio" v-model="listing_type" id="request" name="Request" value="request">
          <label for="request">Request</label>
        </div>
        <base-image-viewer
          v-bind:images="this.images"
          v-bind:isPreview="true">
        </base-image-viewer>
        <div>
          <input
            type="text"
            class="showBorder"
            v-model="title"
            required
            placeholder="what is it?">
        </div>
        <div>
          <input
            type="text"
            class="showBorder"
            v-model="description"
            placeholder="additional information">
        </div>
        <div>
          <label>Category:</label>
          <select v-model="category_id" class="showBorder">
            <option
              v-for="category in getDropdownCategories"
              :key="category.id"
              :value="category.id">{{ category.name }}</option>
          </select>
          <label>Exchange:</label>
          <select v-model="exchange_id" class="showBorder">
            <option
              v-for="exchange in getDropdownExchanges"
              :key="exchange.id"
              :value="exchange.id">{{ exchange.name }}</option>
          </select>
        </div>
        <div>
          <input type="button"
            v-for="(key, index) in expired_types"
            :key="index"
            v-bind:value="getExpiredValue(key)"
            v-on:click="showCalendar(index)">
              <!-- {{ key > 0 ? key : 'custom' }} -->
        </div>
        <input type="date" v-model="expires_picker" v-show="expires_picker_visible">
        <!-- <div id="container">
          <label>expires?</label>
          <div class="showBorder" v-for="(key, index) in expired_types" :key="index">
            <input type="button" :id="index" v-on:click="showCalendar(index)">
              {{ key > 0 ? key : 'custom' }}
          </div>
          <input type="date" v-model="expires_picker" v-show="expires_picker_visible">
          </div> -->
        <div>
          <form
            @submit.prevent
            enctype="multipart/form-data"
            action="http://localhost:8080/listings"
            method="post">
            <input type="file" accept="image/*" ref="input" @change=uploadImages() multiple>
            <button v-on:click="createCard" v-show="this.$store.getters['users/getCurrentUserName']">Create that shit!</button>
          </form>
        </div>
      </div>
    </div>
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
    showCalendar (index) {
      this.expires_at = this.expired_types[index]
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
    },
    getExpiredValue (key) {
      return key > 0 ? key : 'custom'
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
button {
  margin: 5px;
}
input[type=text] {
  width: 400px;
  margin: 5px 0px;
}
.showBorder {
  border: 2px solid red;
  border-radius: 4px;
  padding: 5px;
}
div#container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 10px;
}
</style>
