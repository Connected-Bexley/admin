<template>
  <div>
    <gov-heading size="l">Details</gov-heading>
    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header scope="row" top>Organisation</gov-table-header>
          <gov-table-cell>{{ event.organisation.name }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Title</gov-table-header>
          <gov-table-cell>{{ event.title }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Start</gov-table-header>
          <gov-table-cell>{{ startDateTimeStr }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>End</gov-table-header>
          <gov-table-cell>{{ endDateTimeStr }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Summary</gov-table-header>
          <gov-table-cell>{{ event.intro }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Description</gov-table-header>
          <gov-table-cell v-html="toHtml(event.description)" />
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top
            >Is this event free?</gov-table-header
          >
          <gov-table-cell>{{ isFree }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Fees text</gov-table-header>
          <gov-table-cell>{{
            event.is_free ? "-" : event.fees_text
          }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Fees web address</gov-table-header>
          <gov-table-cell>{{
            event.is_free ? "-" : event.fees_url
          }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Organiser name</gov-table-header>
          <gov-table-cell>{{ event.organiser_name || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Organiser phone</gov-table-header>
          <gov-table-cell>{{ event.organiser_phone || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Organiser email</gov-table-header>
          <gov-table-cell>{{ event.organiser_email || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top
            >Organiser web address</gov-table-header
          >
          <gov-table-cell>{{ event.organiser_url || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Booking title</gov-table-header>
          <gov-table-cell>{{ event.booking_title || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Booking summary</gov-table-header>
          <gov-table-cell>{{ event.booking_summary || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Booking url</gov-table-header>
          <gov-table-cell>{{ event.booking_url || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top
            >Booking button text</gov-table-header
          >
          <gov-table-cell>{{ event.booking_cta || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Show on home page</gov-table-header>
          <gov-table-cell>{{ onHomepage }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">Image</gov-table-header>
          <gov-table-cell>
            <ck-image v-if="event.image" :file-id="event.image.id" />
          </gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top
            >Is this event virtual?</gov-table-header
          >
          <gov-table-cell>{{ isVirtual }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Location</gov-table-header>
          <gov-table-cell v-if="event.is_virtual">-</gov-table-cell>
          <gov-table-cell v-else>
            <location-details :location="event.location" />
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
import CkImage from "@/components/Ck/CkImage.vue";
import LocationDetails from "@/views/locations/show/LocationDetails";

export default {
  name: "OrganisationEventDetails",

  components: {
    CkImage,
    LocationDetails
  },

  props: {
    event: {
      required: true,
      type: Object
    }
  },

  computed: {
    isFree() {
      return this.event.is_free ? "Yes" : "No";
    },
    isVirtual() {
      return this.event.is_virtual ? "Yes" : "No";
    },
    onHomepage() {
      return this.event.homepage ? "Yes" : "No";
    },
    startDateTimeStr() {
      const startDate = new Date(
        `${this.event.start_date} ${this.event.start_time}`
      );
      return `${String(startDate.getDate()).padStart(2, "0")}/${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}/${startDate.getFullYear()} ${String(
        startDate.getHours()
      ).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;
    },
    endDateTimeStr() {
      const endDate = new Date(`${this.event.end_date} ${this.event.end_time}`);
      return `${String(endDate.getDate()).padStart(2, "0")}/${String(
        endDate.getMonth() + 1
      ).padStart(2, "0")}/${endDate.getFullYear()} ${String(
        endDate.getHours()
      ).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    }
  }
};
</script>

<style lang="scss" scoped></style>
