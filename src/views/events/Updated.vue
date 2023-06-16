<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful :title="`${appName} - Event Updated: ${event.title}`" />

      <gov-back-link :to="{ name: 'events-show', params: { event: event.id } }"
        >Back to event</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="one-half">
            <gov-heading size="xl">Update request submitted</gov-heading>
            <gov-body>
              Your update request for this event has been received. It will need
              to be approved by an admin before the changes will be applied.
            </gov-body>

            <gov-button
              :to="{
                name: 'events-show',
                params: { event: this.$route.params.event }
              }"
              >Back to event</gov-button
            >
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import http from "@/http";

export default {
  name: "OrganisationEventUpdatedView",

  data() {
    return {
      loading: false,
      event: null
    };
  },
  methods: {
    async fetchEvent() {
      this.loading = true;
      const response = await http.get(
        `/organisation-events/${this.$route.params.event}`
      );
      this.event = response.data.data;
      this.loading = false;
    }
  },
  created() {
    this.fetchEvent();
  }
};
</script>

<style lang="scss" scoped></style>
