<template>
  <gov-width-container>
    <gov-back-link :to="{ name: 'organisations-index' }"
      >Back to organisations</gov-back-link
    >
    <gov-main-wrapper>
      <ck-loader v-if="loading" />
      <gov-grid-row v-else>
        <vue-headful
          :title="`${appName} - Organisation: ${organisation.name}`"
        />

        <gov-grid-column width="two-thirds">
          <gov-heading size="m">View organisation</gov-heading>

          <gov-inset-text v-if="updated"
            >Organisation {{ organisation.name }} has been
            updated</gov-inset-text
          >

          <ck-organisation-details :organisation="organisation" />

          <template v-if="auth.isSuperAdmin">
            <gov-body
              >Please be certain of the action before deleting an
              organisation</gov-body
            >

            <gov-section-break size="l" />

            <ck-delete-button
              resource="organisation"
              :endpoint="`/organisations/${this.organisation.id}`"
              @deleted="onDelete"
            />
          </template>
        </gov-grid-column>
        <gov-grid-column
          v-if="auth.isOrganisationAdmin(organisation)"
          width="one-third"
          class="text-right"
        >
          <gov-button
            :to="{
              name: 'organisations-edit',
              params: { organisation: organisation.id }
            }"
          >
            Edit organisation
          </gov-button>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import http from "@/http";

export default {
  name: "ShowOrganisation",
  data() {
    return {
      loading: false,
      updated: false,
      organisation: null
    };
  },
  methods: {
    fetchOrganisation() {
      this.loading = true;
      http
        .get(`/organisations/${this.$route.params.organisation}`)
        .then(({ data }) => {
          this.organisation = data.data;
          this.loading = false;
        });
    },
    onDelete() {
      this.$router.push({ name: "organisations-index" });
    }
  },
  created() {
    this.updated = this.$route.query.updated || false;
    this.fetchOrganisation();
  }
};
</script>
