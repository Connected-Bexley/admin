<template>
  <gov-checkboxes :invalid="error">
    <ck-node-checkboxes
      :key="taxonomies[0].id"
      :nodes="taxonomies"
      :checked="checked"
      :disabled="disabled"
      :filteredNodeIds="filteredTaxonomyIds"
      @update="$emit('update', $event)"
    >
      <template slot="default" slot-scope="slotProps">
        <gov-hint
          :for="slotProps.node.id"
          v-if="taxonomyCollections[slotProps.node.id]"
          >Found in
          {{ taxonomyCollections[slotProps.node.id].join(", ") }}</gov-hint
        >
      </template>
    </ck-node-checkboxes>
  </gov-checkboxes>
</template>

<script>
import CkNodeCheckboxes from "./CkNodeCheckboxes";
export default {
  name: "TaxonomyTree",

  components: {
    CkNodeCheckboxes
  },

  props: {
    taxonomies: {
      required: true,
      type: Array
    },
    checked: {
      required: true,
      type: Array
    },
    error: {
      required: true
    },
    filteredTaxonomyIds: {
      type: [Array, Boolean],
      default() {
        return [];
      }
    },
    taxonomyCollections: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped></style>
