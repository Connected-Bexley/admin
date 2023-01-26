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
      <slot name="default" :node="slotProps.node">
        <gov-hint :for="node.id" v-if="taxonomyCollections[node.id]"
          >Found in {{ taxonomyCollections[node.id].join(", ") }}</gov-hint
        >
      </slot>
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
