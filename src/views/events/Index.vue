<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - List Events`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>

    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Events</gov-heading>

          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <ck-table-filters @search="onSearch">
                <gov-form-group>
                  <gov-label for="filter[organisation]">Organisation</gov-label>
                  <gov-input
                    v-model="filters.organisation"
                    id="filter[organisation]"
                    name="filter[organisation]"
                    type="search"
                  />
                </gov-form-group>
              </ck-table-filters>
            </gov-grid-column>
            <gov-grid-column
              v-if="auth.isOrganisationAdmin()"
              width="one-third"
            >
              <gov-button @click="onAddEvent" type="submit" success expand
                >Add event</gov-button
              >
            </gov-grid-column>
          </gov-grid-row>
          <ck-resource-listing-table
            ref="eventsTable"
            uri="/organisation-events"
            :params="params"
            default-sort="start_date"
            :columns="[
              {
                heading: 'Title',
                sort: 'title',
                render: (event) => event.title,
              },
              {
                heading: 'Start',
                sort: 'start_date',
                render: (event) => startDateTimeStr(event),
              },
              {
                heading: 'End',
                sort: 'end_date',
                render: (event) => endDateTimeStr(event),
              },
              {
                heading: 'Summary',
                sort: 'intro',
                render: (event) => event.intro,
              },
              {
                heading: 'Free',
                sort: 'is_free',
                render: (event) => (event.is_free ? 'Yes' : 'No'),
              },
            ]"
            :view-route="
              (event) => {
                return {
                  name: 'events-show',
                  params: { event: event.id },
                };
              }
            "
          />
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import CkResourceListingTable from "@/components/Ck/CkResourceListingTable.vue";
import CkTableFilters from "@/components/Ck/CkTableFilters.vue";

export default {
  name: "OrganisationEventIndex",

  components: { CkResourceListingTable, CkTableFilters },
  data() {
    return {
      filters: {
        organisation: "",
      },
    };
  },
  computed: {
    params() {
      let params = {
        include: "organisation",
        "filter[has_permission]": true,
      };

      if (this.filters.organisation !== "") {
        params["filter[organisation]"] = this.filters.organisation;
      }

      return params;
    },
  },
  methods: {
    onSearch() {
      this.$refs.eventsTable.currentPage = 1;
      this.$refs.eventsTable.fetchResources();
    },
    onAddEvent() {
      this.$router.push({ name: "events-create" });
    },
    startDateTimeStr(event) {
      const startDate = new Date(`${event.start_date} ${event.start_time}`);
      console.debug("Start Date:", startDate);
      return `${String(startDate.getDate()).padStart(2, "0")}/${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}/${startDate.getFullYear()} ${String(
        startDate.getHours()
      ).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;
    },
    endDateTimeStr(event) {
      const endDate = new Date(`${event.end_date} ${event.end_time}`);
      console.debug("End Date:", endDate);
      return `${String(endDate.getDate()).padStart(2, "0")}/${String(
        endDate.getMonth() + 1
      ).padStart(2, "0")}/${endDate.getFullYear()} ${String(
        endDate.getHours()
      ).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
