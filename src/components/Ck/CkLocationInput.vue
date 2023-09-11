<template>
  <div>
    <ck-radio-input
      :value="locationType"
      @input="locationType = $event"
      id="location_type"
      label="Select location"
      hint="You can select an existing location or create a new one."
      :options="locationTypes"
      :error="null"
    />

    <!-- Existing location: select from list -->
    <template v-if="locationType === 'existing'">
      <ck-loader v-if="loading" />
      <ck-select-input
        v-else
        :value="location_id"
        @input="$emit('update:location_id', $event)"
        id="location_id"
        label="Location"
        :options="selectLocations"
        :error="error"
      />
    </template>
    <!-- /Existing location: select from list -->

    <!-- New location: enter details -->
    <template v-else-if="locationType === 'new'">
      <location-form
        :errors="form.$errors"
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
        @update:image_file_id="form.image_file_id = $event"
        @clear="form.$errors.clear($event)"
      />

      <gov-section-break size="m" visible />

      <gov-button v-if="form.$submitting" disabled type="submit"
        >Creating...</gov-button
      >
      <gov-button v-else @click="onSubmit" type="submit">Create</gov-button>
      <ck-submit-error v-if="form.$errors.any()" />
    </template>
    <!-- /New location: enter details -->
  </div>
</template>

<script>
import countries from "@/storage/countries";
import Form from "@/classes/Form";
import LocationForm from "@/views/locations/forms/LocationForm";

export default {
  name: "CkLocationInput",

  components: {
    LocationForm
  },
  props: {
    error: {
      required: true
    },
    location_id: {
      required: false
    },
    address_line_1: {
      required: false,
      type: String
    },
    address_line_2: {
      required: false,
      type: String
    },
    address_line_3: {
      required: false,
      type: String
    },
    city: {
      required: false,
      type: String
    },
    county: {
      required: false,
      type: String
    },
    postcode: {
      required: false,
      type: String
    },
    country: {
      required: false,
      type: String
    },
    has_induction_loop: {
      required: false,
      type: Boolean
    },
    has_wheelchair_access: {
      required: false,
      type: Boolean
    },
    has_accessible_toilet: {
      required: false,
      type: Boolean
    }
  },

  data() {
    return {
      loading: false,
      locations: [],
      locationType: "existing",
      form: new Form({
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        city: "",
        county: "",
        postcode: "",
        country: "United Kingdom",
        accessibility_info: "",
        has_wheelchair_access: false,
        has_induction_loop: false,
        has_accessible_toilet: false,
        image_file_id: null
      }),
      countries: [
        { text: "Please select", value: null, disabled: true },
        ...countries
      ],
      locationTypes: [
        { value: "existing", label: "Existing" },
        { value: "new", label: "New" }
      ]
    };
  },

  computed: {
    selectLocations() {
      const locations = this.locations.map(location => {
        return {
          text: `${location.address_line_1}, ${location.city}, ${location.postcode}`,
          value: location.id
        };
      });
      locations.unshift({
        text: "Please select",
        value: null,
        disabled: true
      });

      return locations;
    }
  },

  methods: {
    onInput({ field, value }) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    },
    async fetchLocations() {
      this.loading = true;
      this.locations = await this.fetchAll("/locations");

      this.loading = false;
    },
    onSubmit() {
      this.form.post("/locations").then(({ data }) => {
        this.$emit("update:location_id", data.id);
        this.locations.push(data);
        this.locationType = "existing";
      });
    }
  },

  created() {
    this.fetchLocations();
  }
};
</script>

<style lang="scss" scoped></style>
