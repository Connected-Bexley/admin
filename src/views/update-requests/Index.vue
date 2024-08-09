<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - List Update Requests`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Update requests</gov-heading>

          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <ck-table-filters @search="onSearch">
                <gov-form-group>
                  <gov-label for="filter[entry]">Entry</gov-label>
                  <gov-input
                    v-model="filters.entry"
                    id="filter[entry]"
                    name="filter[entry]"
                    type="search"
                  />
                </gov-form-group>

                <template slot="extra-filters">
                  <gov-form-group>
                    <gov-label for="filter[updateable_type]">Type</gov-label>
                    <gov-select
                      v-model="filters.updateableType"
                      id="filter[updateable_type]"
                      name="filter[updateable_type]"
                      :options="updateableTypes"
                    />
                  </gov-form-group>
                </template>
              </ck-table-filters>
            </gov-grid-column>
          </gov-grid-row>

          <ck-resource-listing-table
            ref="updateRequestsTable"
            uri="/update-requests"
            :params="params"
            default-sort="-created_at"
            :columns="[
              {
                heading: 'User',
                render: updateRequest =>
                  updateRequest.user
                    ? `${updateRequest.user.first_name} ${updateRequest.user.last_name}`
                    : 'N/A'
              },
              {
                heading: 'Type',
                render: updateRequest =>
                  displayType(updateRequest.updateable_type)
              },
              {
                heading: 'Entry',
                sort: 'entry',
                render: updateRequest => updateRequest.entry
              },
              {
                heading: 'Date / Time',
                sort: 'created_at',
                render: updateRequest =>
                  formatDateTime(updateRequest.created_at)
              }
            ]"
            :view-route="
              updateRequest => {
                return {
                  name: 'update-requests-show',
                  params: { updateRequest: updateRequest.id }
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
  name: "ListUpdateRequests",
  components: { CkResourceListingTable, CkTableFilters },
  data() {
    return {
      filters: {
        entry: "",
        updateableType: ""
      },
      updateableTypes: [
        { value: "", text: "All" },
        {
          value: "new_organisation_event_created_by_org_admin",
          text: "New Event"
        },
        { value: "organisation_events", text: "Event update" },
        { value: "locations", text: "Location" },
        {
          value: "new_organisation_created_by_global_admin",
          text: "New Organisation"
        },
        { value: "organisations", text: "Organisation update" },
        {
          value: "organisation_sign_up_form",
          text: "Organisation sign up form"
        },
        { value: "new_page", text: "New Page" },
        { value: "pages", text: "Page update" },
        { value: "referrals", text: "Referral" },
        {
          value: "new_service_created_by_global_admin",
          text: "New Service"
        },
        { value: "services", text: "Service update" },
        { value: "service_locations", text: "Service location" }
      ]
    };
  },
  computed: {
    params() {
      const params = {
        include: "user"
      };

      if (this.filters.entry !== "") {
        params["filter[entry]"] = this.filters.entry;
      }

      if (this.filters.updateableType !== "") {
        params["filter[type]"] = this.filters.updateableType;
      }

      return params;
    }
  },
  methods: {
    onSearch() {
      this.$refs.updateRequestsTable.currentPage = 1;
      this.$refs.updateRequestsTable.fetchResources();
    },
    displayType(type) {
      if (type === "new_service_created_by_org_admin") {
        type = "new_service_created_by_global_admin";
      }
      const displayType = this.updateableTypes.find(
        updateableType => updateableType.value === type
      );
      return displayType ? displayType.text : "Invalid type";
    }
  }
};
</script>
