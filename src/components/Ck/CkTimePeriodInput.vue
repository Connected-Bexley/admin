<template>
  <gov-form-group :invalid="error !== null">
    <gov-label>{{ opens_at_label }} / {{ closes_at_label }}</gov-label>
    <gov-select
      :value="opens_at"
      @input="$emit('update:opens_at', $event)"
      :id="`${id}.opens_at`"
      :name="`${id}.opens_at`"
      :options="hours"
      class="govuk-!-width-one-quarter"
    />&nbsp;<!--
  --><gov-select
      :value="closes_at"
      @input="$emit('update:closes_at', $event)"
      :id="`${id}.closes_at`"
      :name="`${id}.closes_at`"
      :options="hours"
      class="govuk-!-width-one-quarter"
    />
    <gov-error-message v-if="error" v-text="error" :for="`${id}.opens_at`" />
  </gov-form-group>
</template>

<script>
export default {
  name: "CkTimePeriodInput",
  props: {
    id: {
      required: true,
      type: String
    },
    opens_at: {
      required: true
    },
    closes_at: {
      required: true
    },
    opens_at_label: {
      required: true
    },
    closes_at_label: {
      required: true
    },
    error: {
      required: true
    }
  },
  data() {
    return {
      hours: [{ text: "--:--", value: null, disabled: true }]
    };
  },
  created() {
    for (let hour = 0; hour < 24; hour += 0.25) {
      const text =
        ("0" + (Math.floor(hour) % 24)).slice(-2) +
        ":" +
        ((hour % 1) * 60 + "0").slice(0, 2);
      const value = `${text}:00`;
      this.hours.push({ text, value });
    }
    this.hours.push({ text: "24:00", value: "23:59:59" });
  }
};
</script>
