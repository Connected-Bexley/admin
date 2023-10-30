<template>
  <gov-width-container>
    <gov-back-link :to="{ name: 'events-index' }">Back to events</gov-back-link>
    <gov-main-wrapper>
      <ck-loader v-if="loading" />
      <gov-grid-row v-else>
        <vue-headful :title="`${appName} - Event: ${event.title}`" />

        <gov-grid-column width="full">
          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <gov-heading size="m">
                <gov-caption size="m">{{ event.title }}</gov-caption>
                View event
              </gov-heading>
              <gov-inset-text v-if="updated"
                >event {{ event.title }} has been updated</gov-inset-text
              >
            </gov-grid-column>
            <gov-grid-column
              v-if="auth.canEdit('event', event.organisation)"
              width="one-third"
              class="text-right"
            >
              <gov-button
                :to="{ name: 'events-edit', params: { event: event.id } }"
                >Edit event</gov-button
              >
            </gov-grid-column>
          </gov-grid-row>

          <event-details :event="event" />

          <template v-if="auth.canDelete('event')">
            <gov-section-break size="l" />

            <gov-body
              >Please be certain of the action before deleting an
              event</gov-body
            >

            <ck-delete-button
              resource="event"
              :endpoint="`/organisation-events/${this.event.id}`"
              @deleted="onDelete"
            />
          </template>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import EventDetails from "@/views/events/show/EventDetails";

export default {
  name: "OrganisationEventShow",

  components: {
    EventDetails,
  },

  data() {
    return {
      loading: false,
      event: null,
      updated: false,
    };
  },

  methods: {
    async fetchEvent() {
      this.loading = true;

      // Fetch the event.
      const eventResponse = await http.get(
        `/organisation-events/${this.$route.params.event}`,
        { params: { include: "organisation,location" } }
      );
      this.event = eventResponse.data.data;

      this.loading = false;
    },
    onEdit() {
      alert("Edit");
    },
    onDelete() {
      this.$router.push({ name: "events-index" });
    },
  },
  created() {
    this.updated = this.$route.query.updated || false;
    this.fetchEvent();
  },
};
</script>

<style lang="scss" scoped></style>
