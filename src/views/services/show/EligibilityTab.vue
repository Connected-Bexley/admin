<template>
  <div>
    <gov-heading size="l">Eligibility</gov-heading>
    <gov-grid-row
      v-for="rootTaxonomy in eligibilityTypes"
      :key="rootTaxonomy.id"
    >
      <gov-grid-column width="two-thirds">
        <gov-heading size="m">{{ rootTaxonomy.name }}</gov-heading>
        <div v-if="serviceHasEligibilityCriteria(rootTaxonomy)">
          <ck-taxonomy-list
            :taxonomies="rootTaxonomy.children"
            :filteredTaxonomyIds="service.eligibility_types.taxonomies"
            :bullet="true"
          />

          <gov-body v-if="serviceEligibilityCustomValue(rootTaxonomy.name)"
            >Custom Value:
            {{ serviceEligibilityCustomValue(rootTaxonomy.name) }}</gov-body
          >
        </div>
        <gov-body v-else
          >No specific {{ rootTaxonomy.name }} criteria specified</gov-body
        >
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import http from "@/http";
import CkTaxonomyList from "@/components/Ck/CkTaxonomyList.vue";

export default {
  name: "EligibilityTab",

  components: {
    CkTaxonomyList
  },

  props: {
    service: {
      type: Object,
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
    serviceEligibilityCustomValue(name) {
      const nameSlug = this.slugify(name);
      return this.service.eligibility_types.hasOwnProperty("custom") &&
        null !== this.service.eligibility_types.custom[nameSlug]
        ? this.service.eligibility_types.custom[nameSlug]
        : "";
    },
    serviceHasEligibilityCriteria(taxonomy) {
      return (
        taxonomy.children.some(childTaxonomy => {
          return this.service.eligibility_types.taxonomies.includes(
            childTaxonomy.id
          );
        }) || this.serviceEligibilityCustomValue(taxonomy.name) !== ""
      );
    },
    slugify(name) {
      return name.toLowerCase().replaceAll(" ", "_");
    }
  },

  created() {
    this.fetchServiceEligibilites();
  }
};
</script>
