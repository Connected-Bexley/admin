<template>
  <iframe
    :width="computedWidth"
    :height="computedHeight"
    :src="videoSrc"
    :title="title"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    @load="computeSize"
  ></iframe>
</template>

<script>
export default {
  name: "CkVideoIframe",
  props: {
    width: {
      type: [String, Number],
      default: 560
    },
    height: {
      type: [String, Number],
      default: 315
    },
    src: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      computedWidth: 0,
      computedHeight: 0
    };
  },

  computed: {
    aspectRatio() {
      return this.height / this.width;
    },
    videoSrc() {
      const src = String(this.src);
      if (src.startsWith("https://www.youtube.com")) {
        return src.replace("watch?v=", "embed/");
      } else if (src.startsWith("https://vimeo.com")) {
        return src.replace("vimeo.com", "player.vimeo.com/video");
      }
      return this.src;
    }
  },
  methods: {
    computeWidth() {
      const style = getComputedStyle(this.$parent.$el);
      const leftPad = parseInt(style.paddingLeft) || 0;
      const rightPad = parseInt(style.paddingRight) || 0;
      this.computedWidth = this.$parent.$el.clientWidth - leftPad - rightPad;
    },
    computeHeight() {
      const style = getComputedStyle(this.$parent.$el);
      const topPad = parseInt(style.paddingTop) || 0;
      const bottomPad = parseInt(style.paddingBottom) || 0;
      this.computedHeight =
        this.computedWidth * this.aspectRatio - topPad - bottomPad;
    },
    computeSize() {
      this.computeWidth();
      this.computeHeight();
    }
  },
  mounted() {
    this.computeSize();
  }
};
</script>

<style lang="scss" scoped></style>
