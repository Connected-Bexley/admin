<template>
  <gov-form-group :invalid="error !== null">
    <gov-label :for="id" class="govuk-!-font-weight-bold">
      <slot name="label">{{ label }}</slot>
    </gov-label>
    <slot name="hint">
      <gov-hint v-if="hint" :for="id" v-text="hint" />
    </slot>
    <gov-radios>
      <gov-radio
        :bind-to="value"
        @input="$emit('input', $event)"
        :id="`${id}_enabled`"
        :name="id"
        label="Enabled"
        :value="true"
      />
      <gov-radio
        :bind-to="value"
        @input="$emit('input', $event)"
        :id="`${id}_disabled`"
        :name="id"
        label="Disabled"
        :value="false"
      />
    </gov-radios>
  </gov-form-group>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    error: {
      required: true
    },
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: function(value) {
        return ["category", "persona"].indexOf(value) !== -1;
      }
    },
    label: {
      required: true,
      type: String
    },
    hint: {
      required: false,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped></style>
