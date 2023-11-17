<template>
  <gov-width-container>
    <gov-back-link :to="{ name: 'locations-index' }"
      >Back to locations</gov-back-link
    >
    <gov-main-wrapper>
      <ck-loader v-if="loading" />
      <gov-grid-row v-else>
        <vue-headful
          :title="`${appName} - Location: ${location.address_line_1}`"
        />

        <gov-grid-column width="two-thirds">
          <gov-heading size="m">View location</gov-heading>

          <gov-inset-text v-if="updated"
            >Location {{ location.address_line_1 }} has been
            updated</gov-inset-text
          >

          <location-details :location="location" />

          <template v-if="auth.canDelete('location')">
            <gov-body
              >Please be certain of the action before deleting a
              location</gov-body
            >

            <gov-section-break size="l" />

            <ck-delete-button
              resource="location"
              :endpoint="`/locations/${this.location.id}`"
              @deleted="onDelete"
            />
          </template>
        </gov-grid-column>
        <gov-grid-column
          v-if="auth.canEdit('location')"
          width="one-third"
          class="text-right"
        >
          <gov-button
            :to="{ name: 'locations-edit', params: { location: location.id } }"
            >Edit location</gov-button
          >
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import LocationDetails from "@/views/locations/show/LocationDetails";
import http from "@/http";

export default {
  name: "ShowLocation",
  components: { LocationDetails },
  data() {
    return {
      loading: false,
      location: null,
      updated: false
    };
  },
  methods: {
    async fetchLocation() {
      this.loading = true;

      const response = await http.get(
        `/locations/${this.$route.params.location}`
      );
      this.location = response.data.data;

      this.loading = false;
    },
    onDelete() {
      this.$router.push({ name: "locations-index" });
    }
  },
  created() {
    this.updated = this.$route.query.updated || false;
    this.fetchLocation();
  }
};
</script>
