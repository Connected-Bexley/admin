<template>
  <div>
    <gov-heading size="l">Taxonomies</gov-heading>

    <gov-section-break size="l" />

    <gov-grid-row>
      <gov-grid-column width="two-thirds">
        <ck-taxonomy-list
          :taxonomies="taxonomies"
          :filteredTaxonomyIds="serviceTaxonomyIds"
          :taxonomyCollections="taxonomyCollections"
          :bullet="true"
          v-if="!loading"
        />
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import http from "@/http";
import CkTaxonomyList from "@/components/Ck/CkTaxonomyList";
export default {
  name: "TaxonomiesTab",

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
      taxonomies: [],
      taxonomyCollections: {}
    };
  },

  computed: {
    serviceTaxonomyIds() {
      return this.service.category_taxonomies.map(taxonomy => taxonomy.id);
    }
  },

  methods: {
    async fetchTaxonomies() {
      this.loading = true;

      const { data: taxonomies } = await http.get("/taxonomies/categories");
      this.taxonomies = taxonomies.data;
      const { data: collections } = await http.get(
        "/collections/categories/all"
      );
      this.setTaxonomyCollections(collections.data);

      this.loading = false;
    },

    setTaxonomyCollections(collections) {
      collections.forEach(collection => {
        collection.category_taxonomies.forEach(taxonomy => {
          this.taxonomyCollections[taxonomy.id] =
            this.taxonomyCollections[taxonomy.id] || [];
          this.taxonomyCollections[taxonomy.id].push(collection.name);
        });
      });
    }
  },

  created() {
    this.fetchTaxonomies();
  }
};
</script>

<style lang="scss" scoped></style>
