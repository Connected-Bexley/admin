<template>
  <div v-if="active">
    <gov-heading size="l">{{ title | ucfirst }}</gov-heading>
    <gov-grid-row>
      <gov-grid-column width="one-half">
        <gov-body>
          <slot name="intro"></slot>
        </gov-body>

        <gov-section-break size="l" />
        <slot></slot>
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped></style>
