<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Add Event`" />

    <gov-back-link :to="{ name: 'events-index' }">Back to events</gov-back-link>
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Events</gov-heading>

          <template v-if="updateRequestCreated">
            <gov-heading size="m" tag="h3">Create event request</gov-heading>
            <gov-body>{{ updateRequestMessage }}</gov-body>
            <gov-back-link :to="{ name: 'events-index' }"
              >Back to events</gov-back-link
            >
          </template>

          <template v-else>
            <div v-if="!auth.isGlobalAdmin">
              <gov-body class="govuk-!-font-weight-bold">
                Please review the process below on how to create an event.
              </gov-body>

              <gov-list bullet>
                <li>To create an event, fill in the form below.</li>
                <li>
                  The event won't be visible until an admin has reviewed it.
                </li>
                <li>
                  If there are any issues upon review, an admin will get
                  directly in touch with you.
                </li>
              </gov-list>
            </div>
            <gov-heading size="m">Add event</gov-heading>
            <gov-body
              >The events will appear on their own page will be discoverable and
              filterable by visitors based on the information you
              provide</gov-body
            >
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
            <gov-tabs @tab-changed="onTabChange" :tabs="allowedTabs" no-router>
              <details-tab
                v-show="isTabActive('details')"
                :errors="form.$errors"
                @update:title="onUpdateTitle"
                :title="form.title"
                :slug.sync="form.slug"
                :start_date.sync="form.start_date"
                :end_date.sync="form.end_date"
                :start_time.sync="form.start_time"
                :end_time.sync="form.end_time"
                :intro.sync="form.intro"
                :description.sync="form.description"
                :is_free.sync="form.is_free"
                :fees_text.sync="form.fees_text"
                :fees_url.sync="form.fees_url"
                :organiser_name.sync="form.organiser_name"
                :organiser_phone.sync="form.organiser_phone"
                :organiser_email.sync="form.organiser_email"
                :organiser_url.sync="form.organiser_url"
                :booking_title.sync="form.booking_title"
                :booking_summary.sync="form.booking_summary"
                :booking_url.sync="form.booking_url"
                :booking_cta.sync="form.booking_cta"
                :is_virtual.sync="form.is_virtual"
                :homepage.sync="form.homepage"
                :organisations="organisations"
                :organisation_id.sync="form.organisation_id"
                :location_id.sync="form.location_id"
                :image_file_id.sync="form.image_file_id"
                @clear="form.$errors.clear($event)"
                @image-changed="imageChanged = $event"
              />
              <taxonomies-tab
                v-if="isTabActive('taxonomies')"
                @clear="
                  form.$errors.clear($event);
                  errors = {};
                "
                :errors="form.$errors"
                :is-global-admin="auth.isGlobalAdmin"
                :type="form.type"
                :category_taxonomies.sync="form.category_taxonomies"
              >
              </taxonomies-tab>
            </gov-tabs>
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
import DetailsTab from "@/views/events/forms/DetailsTab";
import TaxonomiesTab from "@/views/events/forms/TaxonomiesTab";

export default {
  name: "OrganisationEventCreate",

  components: { DetailsTab, TaxonomiesTab },

  data() {
    return {
      form: new Form({
        title: "",
        slug: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        intro: "",
        description: "",
        is_free: true,
        fees_text: "",
        fees_url: "",
        organiser_name: "",
        organiser_phone: "",
        organiser_email: "",
        organiser_url: "",
        booking_title: "",
        booking_summary: "",
        booking_url: "",
        booking_cta: "",
        is_virtual: true,
        location_id: null,
        organisation_id: null,
        image_file_id: null,
        homepage: false,
        category_taxonomies: []
      }),

      tabs: [
        { id: "details", heading: "Details", active: true },
        { id: "taxonomies", heading: "Taxonomies", active: false }
      ],

      organisations: [{ text: "Please select", value: null }],
      updateRequestCreated: false,
      updateRequestMessage: null,
      loading: false,
      imageChanged: false
    };
  },

  computed: {
    allowedTabs() {
      if (!this.auth.isGlobalAdmin) {
        const taxonomiesTabIndex = this.tabs.findIndex(
          tab => tab.id === "taxonomies"
        );
        const tabs = this.tabs.slice();
        tabs.splice(taxonomiesTabIndex, 1);

        return tabs;
      }

      return this.tabs;
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
    async onSubmit() {
      const response = await this.form.post("/organisation-events");

      const eventId = response.data.id;

      if (this.auth.isSuperAdmin && eventId) {
        this.$router.push({
          name: "events-show",
          params: { event: eventId }
        });
      } else if (!this.form.$errors.any()) {
        this.updateRequestCreated = true;
        this.updateRequestMessage = response.message;
      }
    },
    onTabChange({ index }) {
      this.tabs.forEach(tab => (tab.active = false));
      const tabId = this.allowedTabs[index].id;
      this.tabs.find(tab => tab.id === tabId).active = true;
    },
    isTabActive(id) {
      const tab = this.allowedTabs.find(tab => tab.id === id);

      return tab === undefined ? false : tab.active;
    },
    onUpdateTitle(title) {
      this.form.title = title;
      this.form.slug = this.slugify(title);
    }
  },

  created() {
    this.fetchOrganisations();
  }
};
</script>

<style lang="scss" scoped></style>
