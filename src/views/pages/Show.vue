<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Show Page ${page.title}`" />

    <gov-back-link :to="{ name: 'pages-index' }">Back to pages</gov-back-link>
    <gov-main-wrapper></gov-main-wrapper>
  </gov-width-container>
</template>

<script>
export default {
  name: "ShowPage",

  props: {
    page: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped></style>
