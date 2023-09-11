<template>
  <gov-grid-row>
    <gov-grid-column width="two-thirds">
      <gov-heading size="l">Banner</gov-heading>

      <gov-body>Review the banner content for the frontend.</gov-body>

      <ck-radio-input
        :value="frontend.banner.enabled"
        @input="frontend.banner.enabled = $event"
        id="cms.frontend.banner.enabled"
        label="Enable/Disable Banner"
        hint="Banner configuration will be shown when enabled"
        :options="[
          { value: false, label: 'Disabled' },
          { value: true, label: 'Enabled' }
        ]"
        :error="null"
      />

      <div v-show="frontend.banner.enabled">
        <ck-banner-input
          v-model="frontend.banner"
          :errors="errors.get('cms.frontend.banner')"
          :showImageInput="true"
        />
      </div>
    </gov-grid-column>
  </gov-grid-row>
</template>

<script>
import CkBannerInput from "@/components/Ck/CkBannerInput";

export default {
  name: "CmsFrontendBanner",

  components: {
    CkBannerInput
  },

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

      frontend.banner[field] = value;

      this.$emit("input", frontend);
      this.$emit("clear", `frontend.banner.${field}`);
    }
  }
};
</script>
