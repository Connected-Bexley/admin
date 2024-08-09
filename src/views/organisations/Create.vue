<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Add Organisation`" />

    <gov-back-link :to="{ name: 'organisations-index' }"
      >Back to organisations</gov-back-link
    >
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Organisations</gov-heading>
          <template v-if="!auth.isSuperAdmin">
            <div v-if="updateRequestCreated">
              <gov-heading size="m" tag="h3"
                >Create organisation request</gov-heading
              >
              <gov-body>{{ updateRequestMessage }}</gov-body>
              <gov-back-link :to="{ name: 'organisations-index' }"
                >Back to organisations</gov-back-link
              >
            </div>
          </template>
          <template v-if="!updateRequestCreated">
            <gov-heading size="m">Add organisation</gov-heading>

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
                  :name.sync="form.name"
                  :slug.sync="form.slug"
                  :description.sync="form.description"
                  :url.sync="form.url"
                  :email.sync="form.email"
                  :phone.sync="form.phone"
                  :social_medias.sync="form.social_medias"
                  @update:logo_file_id="form.logo_file_id = $event"
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

            <gov-section-break size="l" />

            <gov-button v-if="form.$submitting" disabled type="submit"
              >Creating...</gov-button
            >
            <gov-button
              v-else
              @click="onSubmit"
              :disabled="imageChanged"
              type="submit"
              >Create</gov-button
            >
            <ck-submit-error v-if="form.$errors.any()" />
          </template>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import Form from "@/classes/Form";
import OrganisationTab from "./OrganisationTab";
import OrganisationForm from "./forms/OrganisationForm";
import CkTaxonomyInput from "@/components/Ck/CkTaxonomyInput";

export default {
  name: "CreateOrganisation",
  components: { OrganisationForm, OrganisationTab, CkTaxonomyInput },
  data() {
    return {
      form: new Form({
        name: "",
        slug: "",
        description: "",
        url: "",
        email: "",
        phone: "",
        logo_file_id: null,
        social_medias: [],
        category_taxonomies: []
      }),
      tabs: [
        { id: "details", heading: "Details", active: true },
        { id: "taxonomies", heading: "Taxonomies", active: false }
      ],
      updateRequestCreated: false,
      updateRequestMessage: null,
      imageChanged: false
    };
  },
  watch: {
    ["form.name"](newName) {
      this.form.slug = this.slugify(newName);
    }
  },
  methods: {
    async onSubmit() {
      const response = await this.form.post("/organisations");
      const organisationId = response.data.id;

      // Refetch the user as new permissions added for the new service.
      await this.auth.fetchUser();

      if (this.auth.isSuperAdmin && organisationId) {
        this.$router.push({
          name: "organisations-show",
          params: { organisation: organisationId }
        });
      } else if (!this.form.$errors.any()) {
        this.updateRequestCreated = true;
        this.updateRequestMessage = response.message;
      }
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
  }
};
</script>
