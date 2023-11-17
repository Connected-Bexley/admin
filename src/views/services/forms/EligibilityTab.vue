<template>
  <div>
    <gov-heading size="l">Who is eligible for your {{ type }}?</gov-heading>
    <gov-grid-row>
      <gov-grid-column width="one-half">
        <gov-body>
          Use this section to help indicate who should be using your {{ type }}.
          If any of these criteria do not apply, please leave them blank.
        </gov-body>
        <gov-section-break size="l" />

        <service-eligibility-input
          v-for="parent in eligibilityTypes"
          :key="parent.id"
          :eligibilityTaxonomy="parent"
          :serviceEligibilityTypes="serviceEligibilityTypes"
          :errors="errors"
          @update:taxonomies="updateServiceEligibilityTaxonomies"
          @update:custom="updateServiceEligibilityCustom"
        >
          <gov-heading size="m" tag="h3">{{ parent.name }}</gov-heading>
        </service-eligibility-input>

        <gov-error-message
          v-if="errors.has('eligibility_types')"
          v-text="errors.get('eligibility_types')"
          for="eligibility_types"
        />
        <slot />
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import http from "@/http";
import ServiceEligibilityInput from "../inputs/ServiceEligibilityInput";

export default {
  name: "EligibilityTab",
  components: { ServiceEligibilityInput },

  props: {
    serviceEligibilityTypes: {
      required: true,
      type: Object
    },
    type: {
      required: true,
      type: String
    },
    errors: {
      required: true
    }
  },

  data() {
    return {
      loading: false,
      eligibilityTypes: []
    };
  },

  methods: {
    async fetchServiceEligibilites() {
      this.loading = true;
      const { data: eligibilityTypes } = await http.get(
        "/taxonomies/service-eligibilities"
      );
      this.eligibilityTypes = eligibilityTypes.data;
      this.loading = false;
    },
    updateServiceEligibilityTaxonomies({ taxonomy, enabled }) {
      const updatedServiceEligibilityTypes = {
        ...this.serviceEligibilityTypes
      };

      if (enabled) {
        if (!updatedServiceEligibilityTypes.taxonomies.includes(taxonomy.id)) {
          updatedServiceEligibilityTypes.taxonomies.push(taxonomy.id);
        }
      } else if (
        updatedServiceEligibilityTypes.taxonomies.includes(taxonomy.id)
      ) {
        const index = updatedServiceEligibilityTypes.taxonomies.indexOf(
          taxonomy.id
        );
        updatedServiceEligibilityTypes.taxonomies.splice(index, 1);
      }

      this.$emit(
        "update:serviceEligibilityTypes",
        updatedServiceEligibilityTypes
      );
    },
    updateServiceEligibilityCustom({ customTaxonomy, customValue }) {
      const updatedServiceEligibilityTypes = {
        ...this.serviceEligibilityTypes
      };
      updatedServiceEligibilityTypes.custom[customTaxonomy] = customValue;
      this.$emit(
        "update:serviceEligibilityTypes",
        updatedServiceEligibilityTypes
      );
    }
  },

  created() {
    this.fetchServiceEligibilites();
  }
};
</script>
