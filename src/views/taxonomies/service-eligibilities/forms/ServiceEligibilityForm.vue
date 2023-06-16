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

    <ck-loader v-if="loading" />
    <ck-select-input
      v-else
      :value="parent_id"
      @input="onInput('parent_id', $event)"
      id="parent_id"
      label="Parent"
      :options="topLevelServiceEligibilities"
      :error="errors.get('parent_id')"
    />
  </div>
</template>

<script>
import http from "@/http";

export default {
  name: "ServiceEligibilityForm",
  props: {
    errors: {
      required: true,
      type: Object
    },
    parent_id: {
      required: true
    },
    name: {
      required: true
    },
    order: {
      required: true
    }
  },
  data() {
    return {
      loading: false,
      serviceEligibilities: []
    };
  },

  computed: {
    topLevelServiceEligibilities() {
      return [
        { text: "Select an eligibility type", value: null },
        ...this.serviceEligibilities.map(eligibility => {
          return { text: eligibility.name, value: eligibility.id };
        })
      ];
    }
  },

  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    },
    async fetchServiceEligibilities() {
      this.loading = true;

      const { data } = await http.get("/taxonomies/service-eligibilities");
      this.serviceEligibilities = data.data;

      this.loading = false;
    }
  },
  created() {
    this.fetchServiceEligibilities();
  }
};
</script>
