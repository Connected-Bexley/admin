<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful
        :title="`${appName} - Edit Organisation: ${organisation.name}`"
      />

      <gov-back-link
        :to="{
          name: 'organisations-show',
          params: { organisation: organisation.id }
        }"
        >Back to organisation</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="full">
            <gov-heading size="xl">Organisations</gov-heading>
            <gov-heading size="m">Edit organisation</gov-heading>

            <gov-error-summary
              v-if="form.$errors.any()"
              title="Check for errors"
            >
              <gov-list>
                <li
                  v-for="(error, field) in form.$errors.all()"
                  :key="field"
                  v-text="error[0]"
                />
              </gov-list>
            </gov-error-summary>

            <gov-tabs @tab-changed="onTabChange" :tabs="tabs" no-router>
              <organisation-tab
                title="Details"
                :active="isTabActive('details')"
              >
                <template v-slot:intro
                  >General details about the organisation. To be found when
                  searching or linked from a service page.</template
                >

                <organisation-form
                  :errors="form.$errors"
                  :id="organisation.id"
                  :name.sync="form.name"
                  :slug.sync="form.slug"
                  :description.sync="form.description"
                  :url.sync="form.url"
                  :email.sync="form.email"
                  :phone.sync="form.phone"
                  :social_medias.sync="form.social_medias"
                  :logo_file_id.sync="form.logo_file_id"
                  @clear="form.$errors.clear($event)"
                  @image-changed="imageChanged = $event"
                />
              </organisation-tab>

              <organisation-tab
                title="Taxonomies"
                :active="isTabActive('taxonomies')"
              >
                <template v-slot:intro>
                  <gov-body>
                    These are a list of ‘tags’ that are applied to an
                    organisation. These tags help the organisation be found in
                    categories and keyword searches.
                  </gov-body>
                  <gov-body>
                    On creation of a new organisation, the admin team will
                    select the tags that they feel represent the organisation.
                  </gov-body>
                </template>
                <gov-form-group
                  :invalid="form.$errors.has('category_taxonomies')"
                >
                  <ck-taxonomy-input
                    root="categories"
                    :value.sync="form.category_taxonomies"
                    @input="$emit('update:category_taxonomies', $event)"
                    :error="form.$errors.get('category_taxonomies')"
                    @clear="form.$errors.clear($event)"
                  />
                  <gov-error-message
                    v-if="form.$errors.has('category_taxonomies')"
                    v-text="form.$errors.get('category_taxonomies')"
                    :for="category_taxonomies"
                  />
                </gov-form-group>
              </organisation-tab>
            </gov-tabs>

            <gov-warning-text>
              Please be aware, by submitting these changes, any pending updates
              may be overwritten.
            </gov-warning-text>

            <gov-button v-if="form.$submitting" disabled type="submit"
              >Requesting...</gov-button
            >
            <gov-button
              v-else
              @click="onSubmit"
              :disabled="imageChanged"
              type="submit"
              >{{ updateButtonText }}</gov-button
            >
            <ck-submit-error v-if="form.$errors.any()" />
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";
import OrganisationTab from "./OrganisationTab";
import OrganisationForm from "./forms/OrganisationForm";
import CkTaxonomyInput from "@/components/Ck/CkTaxonomyInput";

export default {
  name: "EditOrganisation",
  components: { OrganisationForm, OrganisationTab, CkTaxonomyInput },
  data() {
    return {
      loading: false,
      organisation: null,
      form: null,
      tabs: [
        { id: "details", heading: "Details", active: true },
        { id: "taxonomies", heading: "Taxonomies", active: false }
      ],
      imageChanged: false
    };
  },
  computed: {
    updateButtonText() {
      return this.auth.isGlobalAdmin ? "Update" : "Request update";
    }
  },
  methods: {
    async fetchOrganisation() {
      this.loading = true;

      const response = await http.get(
        `/organisations/${this.$route.params.organisation}`
      );
      this.organisation = response.data.data;
      this.form = new Form({
        name: this.organisation.name,
        slug: this.organisation.slug,
        description: this.organisation.description,
        url: this.organisation.url,
        email: this.organisation.email || "",
        phone: this.organisation.phone || "",
        logo_file_id: this.organisation.image ? this.organisation.image.id : "",
        social_medias: this.organisation.social_medias,
        category_taxonomies: this.organisation.category_taxonomies.map(
          taxonomy => taxonomy.id
        )
      });

      this.loading = false;
    },
    async onSubmit() {
      const response = await this.form.put(
        `/organisations/${this.organisation.id}`,
        (config, data) => {
          // Remove any unchanged values.
          if (data.name === this.organisation.name) {
            delete data.name;
          }
          if (data.slug === this.organisation.slug) {
            delete data.slug;
          }
          if (data.description === this.organisation.description) {
            delete data.description;
          }
          if (data.url === this.organisation.url) {
            delete data.url;
          }
          if (data.email === (this.organisation.email || "-")) {
            delete data.email;
          }
          if (data.phone === (this.organisation.phone || "-")) {
            delete data.phone;
          }

          // Remove the logo from the request if null, or delete if false.
          if (data.logo_file_id === null) {
            delete data.logo_file_id;
          } else if (data.logo_file_id === false) {
            data.logo_file_id = null;
          }

          if (
            JSON.stringify(data.social_medias) ===
            JSON.stringify(this.organisation.social_medias)
          ) {
            delete data.social_medias;
          }

          if (
            JSON.stringify(data.category_taxonomies) ===
            JSON.stringify(
              this.organisation.category_taxonomies.map(taxonomy => taxonomy.id)
            )
          ) {
            delete data.category_taxonomies;
          }
        }
      );
      const updateRequestId = response.id;
      let next = {
        name: "organisations-updated",
        params: { organisation: this.organisation.id }
      };

      if (this.auth.isSuperAdmin) {
        try {
          const { data } = await http.get(
            `/update-requests/${updateRequestId}`
          );

          if (data.approved_at) {
            next.name = "organisations-show";
            next.query = { updated: true };
          }
        } catch (err) {
          console.log(err);
        }
      }
      this.$router.push(next);
    },
    onTabChange({ index }) {
      this.tabs.forEach(tab => (tab.active = false));
      const tabId = this.tabs[index].id;
      this.tabs.find(tab => tab.id === tabId).active = true;
    },
    isTabActive(id) {
      const tab = this.tabs.find(tab => tab.id === id);

      return tab === undefined ? false : tab.active;
    }
  },
  created() {
    this.fetchOrganisation();
  }
};
</script>
