<template>
  <div>
    <gov-heading tag="h4" size="s">Call to action</gov-heading>
    <gov-error-message v-if="error !== null" v-text="error" :for="id" />
    <ck-text-input
      :value="callToAction.title"
      @input="onInput('title', $event)"
      id="cta-title"
      label="Title"
      type="text"
      :error="null"
    />
    <ck-textarea-input
      :value="callToAction.description"
      @input="onInput('description', $event)"
      id="cta-description"
      label="Description"
      :error="null"
    />
    <ck-text-input
      :value="callToAction.url"
      @input="onInput('url', $event)"
      id="cta-url"
      label="Link address"
      type="text"
      :error="null"
    />
    <ck-text-input
      :value="callToAction.buttonText"
      @input="onInput('buttonText', $event)"
      id="cta-button-text"
      label="Button text"
      type="text"
      :error="null"
    />
  </div>
</template>

<script>
export default {
  name: "CallToAction",

  props: {
    callToAction: {
      type: Object,
      required: true
    },
    error: {
      required: true
    }
  },

  methods: {
    onInput(field, value) {
      const callToAction = Object.assign({}, this.callToAction);
      callToAction[field] = value;
      this.$emit("input", callToAction);
      this.$emit("clear", "callToAction");
    }
  }
};
</script>

<style lang="scss" scoped></style>
