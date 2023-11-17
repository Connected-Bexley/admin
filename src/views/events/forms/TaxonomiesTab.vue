<template>
  <div>
    <gov-heading size="l">Taxonomies (Tags)</gov-heading>
    <gov-grid-row>
      <gov-grid-column width="full">
        <gov-body>
          These are a list of ‘tags’ that are applied to an event. These tags
          help the event be found in categories and keyword searches.
        </gov-body>
        <gov-body>
          On creation of a new event, the admin team will select the tags that
          they feel represent the event.
        </gov-body>

        <gov-section-break size="l" />

        <gov-form-group :invalid="errors.has('category_taxonomies')">
          <ck-taxonomy-input
            :value="category_taxonomies"
            root="categories"
            @input="$emit('update:category_taxonomies', $event)"
            :error="errors.get('category_taxonomies')"
            @clear="$emit('clear', 'category_taxonomies')"
            :disabled="!isGlobalAdmin"
          />
          <gov-error-message
            v-if="errors.has('category_taxonomies')"
            v-text="errors.get('category_taxonomies')"
            :for="category_taxonomies"
          />
        </gov-form-group>

        <slot />
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>
<script>
import CkTaxonomyInput from "@/components/Ck/CkTaxonomyInput";

export default {
  name: "TaxonomiesTab",
  components: { CkTaxonomyInput },
  props: {
    errors: {
      required: true
    },
    isGlobalAdmin: {
      required: true
    },
    category_taxonomies: {
      required: true,
      type: Array
    }
  }
};
</script>
