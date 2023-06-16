<template>
  <input
    @keyup.enter="onEnter"
    :value="value"
    @input="$emit('input', $event.target.value)"
    class="govuk-input"
    :class="computedClass"
    :id="id"
    :name="name"
    :type="type"
    :max="max"
    :min="min"
    :aria-describedby="ariaDescribedBy"
  />
</template>

<script>
export default {
  name: "GovInput",
  props: {
    value: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: "text"
    },
    width: {
      type: Number,
      required: false
    },
    min: {
      type: [String, Number]
    },
    max: {
      type: [String, Number]
    }
  },
  computed: {
    computedClass() {
      return this.width ? `govuk-input--width-${this.width}` : null;
    },
    ariaDescribedBy() {
      return `${this.name}-hint`;
    }
  },
  methods: {
    onEnter() {
      this.$emit("enter");
    }
  }
};
</script>
