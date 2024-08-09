<template>
  <div>
    <ck-text-input
      :value="address_line_1"
      @input="onInput('address_line_1', $event)"
      id="address_line_1"
      label="Address Line 1"
      type="text"
      :error="errors.get('address_line_1')"
    />

    <ck-text-input
      :value="address_line_2"
      @input="onInput('address_line_2', $event)"
      id="address_line_2"
      label="Address Line 2"
      type="text"
      :error="errors.get('address_line_2')"
    />

    <ck-text-input
      :value="address_line_3"
      @input="onInput('address_line_3', $event)"
      id="address_line_3"
      label="Address Line 3"
      type="text"
      :error="errors.get('address_line_3')"
    />

    <ck-text-input
      :value="city"
      @input="onInput('city', $event)"
      id="city"
      label="City"
      type="text"
      :error="errors.get('city')"
    />

    <ck-text-input
      :value="county"
      @input="onInput('county', $event)"
      id="county"
      label="County"
      type="text"
      :error="errors.get('county')"
    />

    <ck-text-input
      :value="postcode"
      @input="onInput('postcode', $event)"
      id="postcode"
      label="Postcode"
      type="text"
      :error="errors.get('postcode')"
    />

    <ck-select-input
      :value="country"
      @input="onInput('country', $event)"
      id="country"
      label="Country"
      :options="countries"
      :error="errors.get('country')"
    />

    <gov-error-message
      v-if="errors.has('address_not_found')"
      v-text="errors.get('address_not_found')"
      for="postcode"
    />

    <gov-section-break size="l" />

    <gov-form-group
      :invalid="
        errors.has('has_induction_loop') || errors.has('has_wheelchair_access')
      "
    >
      <gov-fieldset-legend size="xl">
        <gov-heading size="m">Accessibility information</gov-heading>
      </gov-fieldset-legend>
      <gov-body
        >Select which accessibility requirements the building meets</gov-body
      >
      <gov-checkboxes>
        <gov-checkbox
          :value="has_induction_loop"
          @input="onInput('has_induction_loop', $event)"
          id="has_induction_loop"
          name="has_induction_loop"
          label="Induction loop"
        />
        <gov-error-message
          v-if="errors.has('has_induction_loop')"
          v-text="errors.get('has_induction_loop')"
          for="has_induction_loop"
        />

        <gov-checkbox
          :value="has_wheelchair_access"
          @input="onInput('has_wheelchair_access', $event)"
          id="has_wheelchair_access"
          name="has_wheelchair_access"
          label="Wheelchair accessible"
        />
        <gov-error-message
          v-if="errors.has('has_wheelchair_access')"
          v-text="errors.get('has_wheelchair_access')"
          for="has_wheelchair_access"
        />

        <gov-checkbox
          :value="has_accessible_toilet"
          @input="onInput('has_accessible_toilet', $event)"
          id="has_accessible_toilet"
          name="has_accessible_toilet"
          label="Accessible toilet"
        />
        <gov-error-message
          v-if="errors.has('has_accessible_toilet')"
          v-text="errors.get('has_accessible_toilet')"
          for="has_accessible_toilet"
        />
      </gov-checkboxes>
    </gov-form-group>

    <ck-image-input
      @input="onInput('image_file_id', $event.file_id)"
      @image-changed="$emit('image-changed', $event)"
      id="image"
      label="Location image"
      :file-id="image_file_id"
    />
  </div>
</template>

<script>
import countries from "@/storage/countries";
import CkImageInput from "@/components/Ck/CkImageInput";

export default {
  name: "CreateLocationForm",
  components: { CkImageInput },
  data() {
    return {
      countries
    };
  },
  props: {
    errors: {
      required: true,
      type: Object
    },
    address_line_1: {
      required: true,
      type: String
    },
    address_line_2: {
      required: true,
      type: String
    },
    address_line_3: {
      required: true,
      type: String
    },
    city: {
      required: true,
      type: String
    },
    county: {
      required: true,
      type: String
    },
    postcode: {
      required: true,
      type: String
    },
    country: {
      required: true,
      type: String
    },
    has_induction_loop: {
      required: true,
      type: Boolean
    },
    has_wheelchair_access: {
      required: true,
      type: Boolean
    },
    has_accessible_toilet: {
      required: true,
      type: Boolean
    },
    image_file_id: {
      type: String
    },
    id: {
      required: false,
      type: String
    }
  },
  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    }
  }
};
</script>
