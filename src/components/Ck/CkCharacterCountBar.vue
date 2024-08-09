<template>
  <div class="ck-character-bar-container" :title="`${count} / ${maxLength}`">
    <div
      class="ck-character-bar"
      :style="{ backgroundColor: barColour, width: barWidthStyle }"
    ></div>
    <gov-error-message
      v-if="barWidth >= 100"
      v-text="'Character count exceeded'"
      for="chracter-count"
    />
  </div>
</template>

<script>
export default {
  name: "CkCharacterCountBar",

  props: {
    count: {
      type: Number,
      required: true
    },

    maxLength: {
      type: Number,
      required: true
    }
  },

  computed: {
    barColour() {
      return this.barWidth < 90
        ? "green"
        : this.barWidth < 100
        ? "orange"
        : "red";
    },
    barWidth() {
      const width = Math.floor((this.count / this.maxLength) * 100);
      return width < 100 ? width : 100;
    },
    barWidthStyle() {
      return `${this.barWidth}%`;
    }
  }
};
</script>

<style lang="scss">
@import "../../scss/app.scss";

.ck-character-bar-container {
  @extend .govuk-body;

  margin: 0;
  background-color: $govuk-border-colour;
}
.ck-character-bar {
  padding-top: 0.5rem;
}
</style>
