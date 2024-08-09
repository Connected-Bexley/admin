<template>
  <gov-list :bullet="bullet">
    <li v-for="taxonomy in filteredTaxonomies" :key="taxonomy.id">
      {{ taxonomy.name }}
      <span v-if="edit.length > 0 && auth.isGlobalAdmin">
        <gov-link
          :to="{
            name: edit,
            params: { taxonomy: taxonomy.id }
          }"
        >
          Edit </gov-link
        >&nbsp;
        <gov-link @click="$emit('move-up', taxonomy)" v-if="taxonomy.order > 1"
          >(Move up)</gov-link
        >&nbsp;
        <gov-link
          @click="$emit('move-down', taxonomy)"
          v-if="taxonomy.order < taxonomies.length"
          >(Move down)</gov-link
        >
      </span>
      <gov-hint :for="taxonomy.id" v-if="taxonomyCollections[taxonomy.id]"
        >Found in {{ taxonomyCollections[taxonomy.id].join(", ") }}</gov-hint
      >
      <ck-taxonomy-list
        v-if="taxonomy.children.length"
        :key="taxonomy.children[0].id"
        :taxonomies="taxonomy.children"
        :filteredTaxonomyIds="filteredTaxonomyIds"
        :taxonomyCollections="taxonomyCollections"
        :checkbox="false"
        :edit="edit"
        :bullet="bullet"
        @moveUp="$emit('move-up', $event)"
        @moveDown="$emit('move-down', $event)"
      />
    </li>
  </gov-list>
</template>

<script>
export default {
  name: "CkTaxonomyList",

  props: {
    taxonomies: {
      required: true,
      type: Array
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
    edit: {
      type: String,
      default: ""
    },
    bullet: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    filteredTaxonomies() {
      return Array.isArray(this.filteredTaxonomyIds)
        ? this.taxonomies.filter(taxonomy => {
            return this.filteredTaxonomyIds.includes(taxonomy.id);
          })
        : this.taxonomies;
    }
  }
};
</script>

<style lang="scss" scoped></style>
