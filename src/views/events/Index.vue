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
                  <gov-label for="filter[title]">Event title</gov-label>
                  <gov-input
                    v-model="filters.title"
                    id="filter[title]"
                    name="filter[title]"
                    type="search"
                  />
                </gov-form-group>

                <template slot="extra-filters">
                  <gov-form-group>
                    <ck-select-input
                      v-model="filters.organisation_id"
                      id="filter[organisation_id]"
                      name="filter[organisation_id]"
                      label="Organisation"
                      :options="organisations"
                      :error="null"
                    />

                    <ck-date-picker
                      id="filter[start_date]"
                      :value="filters.start_date"
                      :max="filters.end_date"
                      :error="null"
                      @input="filters.start_date = $event"
                      label="Starts after"
                    />

                    <ck-date-picker
                      id="filter[end_date]"
                      :value="filters.end_date"
                      :min="earliestEndDate"
                      :error="null"
                      @input="filters.end_date = $event"
                      label="Ends before"
                    />
                  </gov-form-group>
                  <gov-button @click="resetFilters" type="button"
                    >Reset filters</gov-button
                  >
                </template>
              </ck-table-filters>
            </gov-grid-column>
            <gov-grid-column v-if="auth.canAdd('event')" width="one-third">
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
                render: event => event.title
              },
              {
                heading: 'Start',
                sort: 'start_date',
                render: event => startDateTimeStr(event)
              },
              {
                heading: 'End',
                sort: 'end_date',
                render: event => endDateTimeStr(event)
              },
              {
                heading: 'Organisation',
                sort: 'organisation_id',
                render: event => event.organisation.name
              }
            ]"
            :view-route="
              event => {
                return {
                  name: 'events-show',
                  params: { event: event.id }
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
import CkDatePicker from "@/components/Ck/CkDatePicker";
import CkResourceListingTable from "@/components/Ck/CkResourceListingTable.vue";
import CkTableFilters from "@/components/Ck/CkTableFilters.vue";

export default {
  name: "OrganisationEventIndex",

  components: {
    CkDatePicker,
    CkResourceListingTable,
    CkTableFilters
  },

  data() {
    return {
      filters: {
        title: "",
        organisation_id: "",
        start_date: "",
        end_date: ""
      },
      organisations: [{ text: "Please select", value: null }],
      loading: false
    };
  },

  computed: {
    params() {
      let params = {
        include: "organisation",
        "filter[has_permission]": true
      };

      if (this.filters.title !== "") {
        params["filter[title]"] = this.filters.title;
      }

      if (this.filters.organisation_id !== "") {
        params["filter[organisation_id]"] = this.filters.organisation_id;
      }

      if (this.filters.start_date !== "") {
        params["filter[starts_after]"] = this.filters.start_date;
      }

      if (this.filters.end_date !== "") {
        params["filter[ends_before]"] = this.filters.end_date;
      }

      return params;
    },

    todayAsDate() {
      return this.dateToDateString(new Date());
    },
    earliestEndDate() {
      if (!this.filters.start_date) {
        return this.todayAsDate;
      }
      const startDate = new Date(this.filters.start_date);
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      return today < startDate
        ? this.dateToDateString(startDate)
        : this.dateToDateString(today);
    }
  },

  methods: {
    async fetchOrganisations() {
      this.loading = true;
      let fetchedOrganisations = await this.fetchAll("/organisations", {
        "filter[has_permission]": true
      });
      fetchedOrganisations = fetchedOrganisations.map(organisation => {
        return { text: organisation.name, value: organisation.id };
      });
      this.organisations = [...this.organisations, ...fetchedOrganisations];
      this.loading = false;
    },
    onSearch() {
      this.$refs.eventsTable.currentPage = 1;
      this.$refs.eventsTable.fetchResources();
    },
    onAddEvent() {
      this.$router.push({ name: "events-create" });
    },
    startDateTimeStr(event) {
      const startDate = new Date(`${event.start_date} ${event.start_time}`);
      return this.dateToDisplayString(startDate);
    },
    endDateTimeStr(event) {
      const endDate = new Date(`${event.end_date} ${event.end_time}`);
      return this.dateToDisplayString(endDate);
    },
    dateToDateString(dateObj) {
      return `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    },
    dateToDisplayString(dateObj) {
      return `${String(dateObj.getDate()).padStart(2, "0")}/${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}/${dateObj.getFullYear()} ${String(
        dateObj.getHours()
      ).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;
    },
    resetFilters() {
      this.filters = {
        title: "",
        organisation_id: "",
        start_date: "",
        end_date: ""
      };
      this.$nextTick(function() {
        this.onSearch();
      });
    }
  },

  created() {
    this.fetchOrganisations();
  }
};
</script>

<style lang="scss" scoped></style>
