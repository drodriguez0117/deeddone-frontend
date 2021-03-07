<template>
  <div>
    <v-item-group multiple>
      <v-container>
        <v-row>
          <v-col
            v-for="(value, key) in images"
            :key="key"
            cols="key"
            class="d-flex child-flex"
            >
            <v-item>
              <v-img
                :src="isPreview ? getSource(key) : getBackingSource(key)"
                alt="images"
                aspect-ratio="4"
                v-on:click="deleteImage(key)"
              ></v-img>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    images: Array,
    listingId: Number,
    isPreview: Boolean
  },
  methods: {
    ...mapActions('listings', ['deleteImage']),

    // this should all be refactored
    getBackingSource: function (i) {
      return 'http://localhost:3000' + this.images[i].image
    },
    getSource: function (i) {
      return this.images[i]
    },
    deleteImage: function (key) {
      this.destroyImage({ id: this.listingId, image: this.images[key].image })
        .catch((error) => { console.log('ugh, issue deleting: ' + error) })
    }
  }
}
</script>

<style scoped>
</style>
