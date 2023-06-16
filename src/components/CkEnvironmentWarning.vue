<template>
  <div class="warning" v-if="environment == 'staging'">
    <gov-width-container>
      <gov-warning-text title="IMPORTANT">
        Please DO NOT make any changes to this site. This is a TEST environment
        used for demo purposes only. Any changes made here will not be reflected
        on the LIVE site viewed by the public.
        <gov-link :href="adminUrl">Click HERE </gov-link>
        to access the LIVE environment.
      </gov-warning-text>
    </gov-width-container>
  </div>
</template>

<script>
export default {
  name: "EnvironmentWarning",

  computed: {
    environment() {
      return process.env.VUE_APP_ENV;
    },
    adminUrl() {
      return String(process.env.VUE_APP_URI).replace("staging.", "");
    }
  }
};
</script>

<style lang="scss" scoped>
.warning {
  background-color: #f9b34a;
}
.govuk-warning-text {
  margin-bottom: 0;
}
</style>
