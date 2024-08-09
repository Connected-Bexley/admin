<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful
        :title="`${appName} - Edit Location: ${location.address_line_1}`"
      />

      <gov-back-link
        :to="{ name: 'locations-show', params: { location: location.id } }"
        >Back to location</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="one-half">
            <gov-heading size="xl">Locations</gov-heading>
            <gov-heading size="m">Edit location</gov-heading>
            <gov-body
              >The locations will appear on the service pages which will inform
              people of where to find your service/organisation</gov-body
            >

            <location-form
              :errors="form.$errors"
              :id="location.id"
              :address_line_1.sync="form.address_line_1"
              :address_line_2.sync="form.address_line_2"
              :address_line_3.sync="form.address_line_3"
              :city.sync="form.city"
              :county.sync="form.county"
              :postcode.sync="form.postcode"
              :country.sync="form.country"
              :has_induction_loop.sync="form.has_induction_loop"
              :has_wheelchair_access.sync="form.has_wheelchair_access"
              :has_accessible_toilet.sync="form.has_accessible_toilet"
              :image_file_id.sync="form.image_file_id"
              @clear="form.$errors.clear($event)"
              @image-changed="imageChanged = $event"
            />

            <gov-warning-text>
              Please be aware, by submitting these changes, any pending updates
              may be overwritten.
            </gov-warning-text>

            <gov-button v-if="form.$submitting" disabled type="submit"
              >Requesting...</gov-button
            >
            <gov-button
              :disabled="imageChanged"
              v-else
              @click="onSubmit"
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
import LocationForm from "@/views/locations/forms/LocationForm";

export default {
  name: "EditLocation",
  components: { LocationForm },
  data() {
    return {
      loading: false,
      location: null,
      form: null,
      imageChanged: false
    };
  },
  computed: {
    updateButtonText() {
      return this.auth.isGlobalAdmin ? "Update" : "Request update";
    }
  },
  methods: {
    async fetchLocation() {
      this.loading = true;

      const response = await http.get(
        `/locations/${this.$route.params.location}`
      );
      this.location = response.data.data;
      this.form = new Form({
        address_line_1: this.location.address_line_1,
        address_line_2: this.location.address_line_2 || "",
        address_line_3: this.location.address_line_3 || "",
        city: this.location.city,
        county: this.location.county,
        postcode: this.location.postcode,
        country: this.location.country,
        accessibility_info: this.location.accessibility_info || "",
        has_wheelchair_access: this.location.has_wheelchair_access,
        has_induction_loop: this.location.has_induction_loop,
        has_accessible_toilet: this.location.has_accessible_toilet,
        image_file_id: this.location.image ? this.location.image.id : null
      });

      this.loading = false;
    },
    async onSubmit() {
      const response = await this.form.put(
        `/locations/${this.location.id}`,
        (config, data) => {
          // Remove any unchanged values.
          if (data.address_line_1 === this.location.address_line_1) {
            delete data.address_line_1;
          }
          if (data.address_line_2 === (this.location.address_line_2 || "")) {
            delete data.address_line_2;
          }
          if (data.address_line_3 === (this.location.address_line_3 || "")) {
            delete data.address_line_3;
          }
          if (data.city === this.location.city) {
            delete data.city;
          }
          if (data.county === this.location.county) {
            delete data.county;
          }
          if (data.postcode === this.location.postcode) {
            delete data.postcode;
          }
          if (data.country === this.location.country) {
            delete data.country;
          }
          if (
            data.accessibility_info === (this.location.accessibility_info || "")
          ) {
            delete data.accessibility_info;
          }
          if (
            data.has_wheelchair_access === this.location.has_wheelchair_access
          ) {
            delete data.has_wheelchair_access;
          }
          if (data.has_induction_loop === this.location.has_induction_loop) {
            delete data.has_induction_loop;
          }
          if (
            data.has_accessible_toilet === this.location.has_accessible_toilet
          ) {
            delete data.has_accessible_toilet;
          }
          // Remove the logo from the request if null, or delete if false.
          if (
            data.image_file_id === null ||
            data.image_file_id === this.location.image.id
          ) {
            delete data.image_file_id;
          } else if (data.image_file_id === false) {
            data.image_file_id = null;
          }
        }
      );

      const updateRequestId = response.id;
      let next = {
        name: "locations-updated",
        params: { location: this.location.id }
      };

      if (this.auth.isGlobalAdmin) {
        try {
          const { data } = await http.get(
            `/update-requests/${updateRequestId}`
          );
          if (data.approved_at) {
            next.name = "locations-show";
            next.query = { updated: true };
          }
        } catch (err) {
          console.log(err);
        }
      }
      this.$router.push(next);
    }
  },
  created() {
    this.fetchLocation();
  }
};
</script>
