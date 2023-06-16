<template>
  <strong class="govuk-tag">
    <slot />
  </strong>
</template>

<script>
export default {
  name: "GovTag"
};
</script>

<style lang="scss" scoped>
@import "@/scss/app.scss";

.govuk-tag {
  &--grey {
    color: $govuk-text-colour;
    background-color: $govuk-canvas-background-colour;
  }
}
</style>
