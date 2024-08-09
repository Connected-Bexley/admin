<template>
  <ck-loader v-if="loading" />
  <div v-else>
    <gov-form-group>
      <gov-label for="filter[name]">Search by taxonomy name</gov-label>
      <gov-input
        v-model="filters.name"
        id="filter[name]"
        name="filter[name]"
        type="search"
      />
    </gov-form-group>
    <gov-button @click="filters.name = ''">Clear</gov-button>

    <!-- Level: 1 -->
    <gov-form-group v-if="filteredTaxonomyIds.length">
      <ck-taxonomy-tree
        :taxonomies="taxonomies"
        :checked="value"
        :filteredTaxonomyIds="filteredTaxonomyIds"
        :taxonomyCollections="taxonomyCollections"
        :error="error"
        :disabled="disabled"
        @update="onUpdate"
      />

      <gov-error-message
        v-if="error"
        v-text="error"
        for="category_taxonomies"
      />
    </gov-form-group>
    <!-- /Level: 1 -->
    <gov-inset-text v-else> No matching taxonomies found </gov-inset-text>
  </div>
</template>

<script>
import http from "@/http";
import CkTaxonomyTree from "./CkTaxonomyTree";

export default {
  name: "TaxonomyInput",

  components: {
    CkTaxonomyTree
  },

  props: {
    value: {
      required: true,
      type: Array
    },
    error: {
      required: true
    },
    root: {
      required: true,
      type: String,
      validator: function(value) {
        return ["categories", "organisations"].indexOf(value) !== -1;
      }
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },
    showCollections: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      taxonomies: [],
      taxonomyCollections: {},
      flattenedTaxonomies: [],
      loading: false,
      enabledTaxonomies: [],
      filters: {
        name: ""
      }
    };
  },
  computed: {
    filteredTaxonomyIds() {
      if (this.filters.name.length > 2) {
        const filteredTaxonomyIds = this.flattenedTaxonomies.reduce(
          (filteredTaxonomies, taxonomy) => {
            if (
              taxonomy.name
                .toLowerCase()
                .includes(this.filters.name.toLowerCase())
            ) {
              filteredTaxonomies = filteredTaxonomies.concat(
                this.getTaxonomyAndAncestorsIds(taxonomy)
              );
            }
            return filteredTaxonomies;
          },
          []
        );
        return [...new Set(filteredTaxonomyIds)];
      } else {
        return this.flattenedTaxonomies.map(taxonomy => taxonomy.id);
      }
    }
  },
  methods: {
    async fetchTaxonomies() {
      this.loading = true;
      const { data: taxonomies } = await http.get(`/taxonomies/${this.root}`);
      this.taxonomies = taxonomies.data;
      this.setFlattenedTaxonomies();

      if (this.showCollections) {
        const { data: collections } = await http.get(
          `/collections/${this.root}/all`
        );
        this.setTaxonomyCollections(collections.data);
      }
      this.loading = false;
    },
    setFlattenedTaxonomies(taxonomies = null) {
      if (taxonomies === null) {
        this.flattenedTaxonomies = [];
        taxonomies = this.taxonomies;
      }

      taxonomies.forEach(taxonomy => {
        this.flattenedTaxonomies.push(taxonomy);

        if (taxonomy.children.length > 0) {
          this.setFlattenedTaxonomies(taxonomy.children);
        }
      });
    },
    setTaxonomyCollections(collections) {
      collections.forEach(collection => {
        collection.category_taxonomies.forEach(taxonomy => {
          this.taxonomyCollections[taxonomy.id] =
            this.taxonomyCollections[taxonomy.id] || [];
          this.taxonomyCollections[taxonomy.id].push(collection.name);
        });
      });
    },
    onUpdate({ node: taxonomy, enabled }) {
      if (enabled) {
        this.onChecked(taxonomy);
      } else {
        this.onUnchecked(taxonomy);
      }

      this.$emit("input", this.enabledTaxonomies);
      this.$emit("clear");
    },
    onChecked(taxonomy) {
      if (!this.enabledTaxonomies.includes(taxonomy.id)) {
        this.enabledTaxonomies.push(taxonomy.id);
      }
    },
    onUnchecked(taxonomy) {
      if (this.enabledTaxonomies.includes(taxonomy.id)) {
        const index = this.enabledTaxonomies.indexOf(taxonomy.id);
        this.enabledTaxonomies.splice(index, 1);
      }
    },
    getTaxonomyAndAncestorsIds(taxonomy) {
      let ids = [taxonomy.id];
      if (taxonomy.parent_id) {
        const parent = this.flattenedTaxonomies.find(
          tax => tax.id === taxonomy.parent_id
        );
        ids = ids.concat(this.getTaxonomyAndAncestorsIds(parent));
      }
      return ids;
    },
    filteredTaxonomies(taxonomies) {
      return taxonomies.filter(taxonomy =>
        this.filteredTaxonomyIds.includes(taxonomy.id)
      );
    }
  },
  created() {
    this.fetchTaxonomies();
    this.enabledTaxonomies = this.value;
  }
};
</script>

<style lang="scss" scoped>
.govuk-hint {
  padding: 8px 15px 5px;
  margin: 0;
}
</style>
