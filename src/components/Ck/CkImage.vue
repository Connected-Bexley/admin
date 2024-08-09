<template>
  <figure>
    <img
      v-if="image.src || null"
      :src="image.src"
      :alt="image.alt_text"
      :class="imgClass"
    />
    <figcaption v-if="showAlt && image.alt_text">
      <gov-hint>{{ image.alt_text }}</gov-hint>
    </figcaption>
  </figure>
</template>

<script>
import http from "@/http";
export default {
  name: "CkImage",
  props: {
    fileId: {
      type: String,
      required: true
    },
    showAlt: {
      type: Boolean,
      default: true
    },
    imgClass: {
      type: String,
      default: "ck-logo"
    }
  },
  data() {
    return {
      image: {
        src: null,
        alt_text: ""
      }
    };
  },
  async created() {
    if (this.fileId) {
      const { data: file } = await http.get(`files/${this.fileId}`);
      this.image = file.data;
    }
  }
};
</script>

<style lang="scss" scoped>
figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
figure > img {
  object-fit: contain;
}
</style>
