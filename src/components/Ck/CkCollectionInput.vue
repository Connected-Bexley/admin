<template>
  <ck-loader v-if="loading" />
  <div v-else>
    <gov-heading tag="h3" size="m">Collections</gov-heading>
    <slot />
    <gov-form-group>
      <gov-label for="filter[name]">Search by Collection name</gov-label>
      <gov-input
        v-model="filters.name"
        id="filter[name]"
        name="filter[name]"
        type="search"
      />
    </gov-form-group>
    <gov-button @click="filters.name = ''">Clear</gov-button>
    <gov-form-group>
      <gov-checkboxes :invalid="error">
        <ck-node-checkboxes
          :nodes="filteredCollections"
          :checked="enabledCollections"
          :disabled="disabled"
          :filteredNodeIds="true"
          @update="onUpdate"
        >
        </ck-node-checkboxes>
      </gov-checkboxes>
    </gov-form-group>
  </div>
</template>

<script>
import http from "@/http";
import CkNodeCheckboxes from "./CkNodeCheckboxes";

export default {
  name: "CollectionInput",

  components: {
    CkNodeCheckboxes
  },

  props: {
    value: {
      required: true,
      type: Array
    },
    error: {
      required: true
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },
    root: {
      required: true,
      type: String,
      validator: function(value) {
        return ["categories", "organisations"].indexOf(value) !== -1;
      }
    }
  },

  data() {
    return {
      collections: [],
      enabledCollections: [],
      loading: false,
      filters: {
        name: ""
      }
    };
  },

  computed: {
    filteredCollections() {
      if (this.filters.name.length > 2) {
        const filteredCollections = this.collections.reduce(
          (filteredCollections, collection) => {
            if (
              collection.name
                .toLowerCase()
                .includes(this.filters.name.toLowerCase())
            ) {
              filteredCollections.push(collection);
            }
            return filteredCollections;
          },
          []
        );
        return [...new Set(filteredCollections)];
      } else {
        return this.collections;
      }
    }
  },

  methods: {
    async fetchCollections() {
      this.loading = true;
      const { data: collections } = await http.get(
        `/collections/${this.root}/all`
      );
      this.collections = collections.data;
      this.loading = false;
    },

    onUpdate({ node: collection, enabled }) {
      if (enabled) {
        this.onChecked(collection);
      } else {
        this.onUnchecked(collection);
      }

      this.$emit("input", this.enabledCollections);
      this.$emit("clear");
    },
    onChecked(collection) {
      if (!this.enabledCollections.includes(collection.id)) {
        this.enabledCollections.push(collection.id);
      }
    },
    onUnchecked(collection) {
      if (this.enabledCollections.includes(collection.id)) {
        const index = this.enabledCollections.indexOf(collection.id);
        this.enabledCollections.splice(index, 1);
      }
    }
  },

  created() {
    this.fetchCollections();
    this.enabledCollections = this.value;
  }
};
</script>

<style lang="scss" scoped></style>
