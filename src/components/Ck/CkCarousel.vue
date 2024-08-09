<template>
  <div class="ck-carousel">
    <ck-image
      img-class="ck-carousel__image ck-logo"
      v-for="(imageId, index) in imageIds"
      :key="`gallery_image_${imageId}`"
      v-show="currentPage === index"
      :file-id="imageId"
    />

    <gov-button
      @click="currentPage--"
      type="button"
      :disabled="currentPage <= 0"
      >Previous</gov-button
    >
    <gov-button
      @click="currentPage++"
      type="button"
      :disabled="currentPage >= count - 1"
      >Next</gov-button
    >
    <gov-body>Showing item {{ currentPage + 1 }} of {{ count }}</gov-body>
  </div>
</template>

<script>
import CkImage from "@/components/Ck/CkImage.vue";
export default {
  name: "CkCarousel",
  components: { CkImage },
  props: {
    imageIds: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      currentPage: 0
    };
  },

  computed: {
    count() {
      return this.imageIds.length;
    }
  }
};
</script>

<style lang="scss">
.ck-carousel {
  &__image {
    display: block;
    margin-bottom: 1rem;
  }
}
</style>
