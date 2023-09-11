<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful
        :title="
          `${appName} - Edit Service Eligibility: ${serviceEligibility.name}`
        "
      />

      <gov-back-link
        :to="{ name: 'admin-index-taxonomies-service-eligibilities' }"
        >Back to taxonomy service eligibilities</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="one-half">
            <gov-heading size="xl">
              <gov-caption size="xl">Taxonomies</gov-caption>
              Service Eligibilities
            </gov-heading>
            <gov-heading size="m">Edit service eligibility</gov-heading>
            <gov-body>
              From this page you can change the name of the taxonomy 'tags' on
              the site and how they relate to each other. These should not be
              changed without reviewing wider impact on the site
            </gov-body>

            <service-eligibility-form
              :errors="form.$errors"
              :parent_id.sync="form.parent_id"
              :name.sync="form.name"
              :order.sync="form.order"
              @clear="form.$errors.clear($event)"
            />

            <gov-button v-if="form.$submitting" disabled type="submit"
              >Updating...</gov-button
            >
            <gov-button v-else @click="onSubmit" type="submit"
              >Update</gov-button
            >
            <ck-submit-error v-if="form.$errors.any()" />

            <gov-section-break size="l" />

            <ck-delete-button
              resource="category"
              :endpoint="
                `/taxonomies/service-eligibilities/${this.serviceEligibility.id}`
              "
              @deleted="onDelete"
            />
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";
import ServiceEligibilityForm from "./forms/ServiceEligibilityForm";

export default {
  name: "EditTaxonomyServiceEligibility",
  components: { ServiceEligibilityForm },
  data() {
    return {
      loading: false,
      serviceEligibility: null,
      form: null
    };
  },
  methods: {
    async fetchServiceEligibility() {
      this.loading = true;

      const response = await http.get(
        `/taxonomies/service-eligibilities/${this.$route.params.taxonomy}`
      );
      this.serviceEligibility = response.data.data;
      this.form = new Form({
        parent_id: this.serviceEligibility.parent_id,
        name: this.serviceEligibility.name,
        order: this.serviceEligibility.order
      });

      this.loading = false;
    },
    async onSubmit() {
      await this.form.put(
        `/taxonomies/service-eligibilities/${this.serviceEligibility.id}`
      );
      this.$router.push({
        name: "admin-index-taxonomies-service-eligibilities"
      });
    },
    onDelete() {
      this.$router.push({
        name: "admin-index-taxonomies-service-eligibilities"
      });
    }
  },
  created() {
    this.fetchServiceEligibility();
  }
};
</script>
