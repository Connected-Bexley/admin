<template>
  <div>
    <ck-text-input
      :value="name"
      @input="onInput('name', $event)"
      id="name"
      label="Name"
      type="text"
      :error="errors.get('name')"
    />

    <ck-textarea-input
      :value="subtitle"
      @input="
        $emit('update:subtitle', $event);
        $emit('clear', 'subtitle');
      "
      id="subtitle"
      label="Subtitle"
      hint="A one line summary of the persona."
      :maxlength="150"
      :error="errors.get('subtitle')"
    />

    <ck-textarea-input
      :value="intro"
      @input="
        $emit('update:intro', $event);
        $emit('clear', 'intro');
      "
      id="intro"
      label="Description of category"
      hint="A short summary detailing what type of services the persona includes."
      :maxlength="300"
      :error="errors.get('intro')"
    />

    <ck-image-input
      @input="onInput('image_file_id', $event.file_id)"
      @image-changed="$emit('image-changed', $event)"
      id="image"
      label="Persona image"
      :file-id="image_file_id"
    >
      <template slot="after-error-message">
        <gov-error-message
          v-if="errors.get('image_file_id')"
          v-text="errors.get('image_file_id')"
          for="image"
        />
      </template>
    </ck-image-input>

    <collection-homepage-input
      :value="homepage"
      @input="onInput('homepage', $event)"
      id="homepage"
      label="Show the Persona on the homepage"
      :error="errors.get('homepage')"
    />

    <collection-enabled-input
      :value="enabled"
      @input="onInput('enabled', $event)"
      id="status"
      type="category"
      label="Status of Persona"
      :error="errors.get('enabled')"
    />

    <gov-heading size="m">Sideboxes</gov-heading>

    <gov-body>
      Create up to three sideboxes that will can be used to display information
      on the persona results page.
    </gov-body>

    <ck-sideboxes-input
      :sideboxes="sideboxes"
      @input="onInput('sideboxes', $event)"
      :errors="errors"
    />

    <gov-label class="govuk-!-font-weight-bold">Taxonomies</gov-label>
    <ck-taxonomy-input
      root="categories"
      :invalid="errors.has('category_taxonomies')"
      :value="category_taxonomies"
      @input="$emit('update:category_taxonomies', $event)"
      :error="errors.get('category_taxonomies')"
      @clear="$emit('clear', 'category_taxonomies')"
      :showCollections="false"
    />
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import CkTaxonomyInput from "@/components/Ck/CkTaxonomyInput";
import CkSideboxesInput from "@/views/collections/inputs/SideboxesInput";
import CollectionEnabledInput from "@/views/collections/inputs/CollectionEnabledInput";
import CollectionHomepageInput from "@/views/collections/inputs/CollectionHomepageInput";

export default {
  name: "CollectionForm",

  components: {
    CollectionEnabledInput,
    CollectionHomepageInput,
    CkImageInput,
    CkTaxonomyInput,
    CkSideboxesInput
  },
  props: {
    errors: {
      required: true,
      type: Object
    },
    name: {
      required: true
    },
    intro: {
      required: true
    },
    subtitle: {
      required: true
    },
    order: {
      required: true
    },
    enabled: {
      required: true
    },
    homepage: {
      required: true
    },
    sideboxes: {
      required: true
    },
    category_taxonomies: {
      required: true
    },
    image_file_id: {
      required: true
    },
    id: {
      required: false,
      type: String
    }
  },
  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    }
  }
};
</script>
