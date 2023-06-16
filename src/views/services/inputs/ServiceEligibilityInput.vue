<template>
  <gov-form-group>
    <slot />

    <ck-radio-input
      :value="access"
      @input="onUpdateAccess"
      :id="`${customEligibilitySlug}_access`"
      label="Access to the service"
      hint="Changing access to all will remove current selections and custom values"
      :options="accessOptions"
      :error="null"
    />

    <ck-taxonomy-tree
      v-if="access === 'some'"
      :taxonomies="eligibilityTaxonomy.children"
      :checked="serviceEligibilityTypes.taxonomies"
      :error="errors"
      :filteredTaxonomyIds="true"
      @update="onUpdateTaxonomies"
    />

    <gov-section-break size="l" />

    <ck-text-input
      v-if="access === 'some'"
      :value="customEligibilityValue"
      @input="onUpdateCustom"
      id="custom"
      label="Custom value"
      :hint="
        `If the service eligibility does not fit into the ${eligibilityTaxonomy.name} taxonomies, enter a custom value here`
      "
      :error="errors.get('custom')"
    />
  </gov-form-group>
</template>

<script>
import CkTaxonomyTree from "@/components/Ck/CkTaxonomyTree";

export default {
  components: {
    CkTaxonomyTree
  },

  data() {
    return {
      access: "all",
      accessOptions: [
        { label: "Access for all", value: "all" },
        { label: "Access for some", value: "some" }
      ]
    };
  },

  props: {
    eligibilityTaxonomy: {
      required: true,
      type: Object
    },
    serviceEligibilityTypes: {
      required: true,
      type: Object
    },
    customEligibility: {
      type: String,
      default: ""
    },
    errors: {
      required: true
    }
  },

  computed: {
    customEligibilitySlug() {
      // @todo This should not be guessed, it should be supplied by the API
      return this.eligibilityTaxonomy.name.toLowerCase().replaceAll(" ", "_");
    },
    customEligibilityValue() {
      return (
        this.serviceEligibilityTypes.custom[this.customEligibilitySlug] || ""
      );
    },
    checkedEligibilities() {
      return this.eligibilityTaxonomy.children.filter(taxonomy => {
        return this.serviceEligibilityTypes.taxonomies.includes(taxonomy.id);
      });
    }
  },

  methods: {
    onUpdateTaxonomies({ node: taxonomy, enabled }) {
      this.$emit("update:taxonomies", { taxonomy, enabled });
      this.$emit("clear");
    },

    onUpdateCustom(customEligibity) {
      this.$emit("update:custom", {
        customTaxonomy: this.customEligibilitySlug,
        customValue: customEligibity
      });
      this.$emit("clear");
    },
    onUpdateAccess(access) {
      this.access = access;

      if (this.access === "all") {
        this.checkedEligibilities.forEach(taxonomy => {
          this.$emit("update:taxonomies", { taxonomy, enabled: false });
          this.$emit("update:custom", {
            customTaxonomy: this.customEligibilitySlug,
            customValue: null
          });
          this.$emit("clear");
        });
      }
    }
  },
  created() {
    this.serviceEligibilityTaxonomies = this.serviceEligibilityTypes.taxonomies.slice();
    this.access =
      this.checkedEligibilities.length || this.customEligibilityValue
        ? "some"
        : "all";
  }
};
</script>

<style lang="scss" scoped></style>
