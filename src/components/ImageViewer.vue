<template>
  <div>
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
                v-bind:src="isPreview ? getPreviewSource(i) : getImageSource(i)"
                alt="images"
                aspect-ratio="4"
              ></v-img>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
export default {
  props: {
    images: Array,
    isPreview: Boolean
  },
  methods: {
    getImageSource: function (i) {
      return 'http://localhost:3000' + this.images[i].image
    },
    getPreviewSource: function (i) {
      return this.images[i]
    }
  }
}
</script>

<style scoped>
</style>
