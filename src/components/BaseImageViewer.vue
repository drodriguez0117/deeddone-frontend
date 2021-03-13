<template>
  <div class="images">
    <img
      v-for="(value, key) in images"
      v-bind:key="key"
      :src="isPreview ? getSource(key) : getBackingSource(key)"
      alt="images"
      v-on:click="deleteImage(key)"
    >
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
    ...mapActions('listings', ['destroyImage']),

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
img {
  margin-left: 1px;
  border-radius: 5px;
  max-width: 164px;
  max-height: 164px;
  width: auto;
  height: auto;
}
</style>
