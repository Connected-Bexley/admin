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
      :value="intro"
      @input="
        $emit('update:intro', $event);
        $emit('clear', 'intro');
      "
      id="intro"
      label="Description of event collection"
      hint="A short summary detailing what type of events the event collection contains."
      :maxlength="300"
      :error="errors.get('intro')"
    />

    <ck-image-input
      @input="onInput('image_file_id', $event.file_id)"
      id="image"
      label="Event collection image"
      accept="image/x-svg"
      :existing-url="
        id
          ? apiUrl(`/collections/organisation-events/${id}/image.svg?v=${now}`)
          : undefined
      "
    >
      <template slot="after-error-message">
        <gov-error-message
          v-if="errors.get('image_file_id')"
          v-text="errors.get('image_file_id')"
          for="image"
        />
      </template>
    </ck-image-input>

    <collection-enabled-input
      :value="enabled"
      @input="onInput('enabled', $event)"
      id="status"
      type="category"
      label="Status of Event Collection"
      :error="errors.get('enabled')"
    />

    <gov-heading size="m">Sideboxes</gov-heading>

    <gov-body>
      Create up to three sideboxes that will can be used to display information
      on the event collection results page.
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
      :hierarchy="false"
    />
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import CkTaxonomyInput from "@/components/Ck/CkTaxonomyInput";
import CkSideboxesInput from "@/views/collections/inputs/SideboxesInput";
import CollectionEnabledInput from "@/views/collections/inputs/CollectionEnabledInput";

export default {
  name: "CollectionForm",
  components: {
    CollectionEnabledInput,
    CkTaxonomyInput,
    CkSideboxesInput,
    CkImageInput,
  },
  props: {
    errors: {
      required: true,
      type: Object,
    },
    id: {
      required: false,
      type: String,
    },
    name: {
      required: true,
    },
    intro: {
      required: true,
    },
    order: {
      required: true,
    },
    enabled: {
      required: true,
    },
    sideboxes: {
      required: true,
    },
    category_taxonomies: {
      required: true,
    },
  },
  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    },
  },
};
</script>
