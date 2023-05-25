<template>
  <iframe
    :width="computedWidth"
    :height="computedHeight"
    :src="src"
    :title="title"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      computedWidth: 0,
      computedHeight: 0,
    };
  },

  computed: {
    aspectRatio() {
      return this.height / this.width;
    },
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
  },
  mounted() {
    this.computeWidth();
    this.computeHeight();
  },
};
</script>

<style lang="scss" scoped></style>
