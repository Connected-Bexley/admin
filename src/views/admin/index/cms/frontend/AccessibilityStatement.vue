<template>
  <gov-grid-row>
    <gov-grid-column width="two-thirds">
      <gov-heading size="l">Accessibility Statement</gov-heading>

      <gov-body>
        Review the content for the accessibility statement page on the frontend.
      </gov-body>

      <ck-text-input
        :value="frontend.accessibility_statement.title"
        @input="onInput({ field: 'title', value: $event })"
        label="Title"
        :error="errors.get('cms.frontend.accessibility_statement.title')"
        id="cms.frontend.accessibility_statement.title"
      />

      <ck-wysiwyg-input
        :value="frontend.accessibility_statement.content"
        @input="onInput({ field: 'content', value: $event })"
        label="Content"
        :error="errors.get('cms.frontend.accessibility_statement.content')"
        id="cms.frontend.accessibility_statement.content"
      />
    </gov-grid-column>
  </gov-grid-row>
</template>

<script>
export default {
  name: "CmsFrontendAccessibilityStatement",

  model: {
    prop: "frontend",
    event: "input"
  },

  props: {
    frontend: {
      type: Object,
      required: true
    },

    errors: {
      type: Object,
      required: true
    }
  },

  methods: {
    onInput({ field, value }) {
      const frontend = { ...this.frontend };

      frontend.accessibility_statement[field] = value;

      this.$emit("input", frontend);
      this.$emit("clear", `frontend.accessibility_statement.${field}`);
    }
  }
};
</script>
