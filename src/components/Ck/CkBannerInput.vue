<template>
  <gov-inset-text>
    <ck-text-input
      :value="banner.title || ''"
      @input="onInput({ field: 'title', value: $event })"
      label="What is the banner title?"
      help="This text will appear as the large heading on the banner (70 characters max)"
      :error="errors ? errors.title : null"
      id="banner.title"
    />

    <ck-wysiwyg-input
      :value="banner.content || ''"
      @input="onInput({ field: 'content', value: $event })"
      label="Banner description"
      help="This text will appear as the smaller description text on the banner (200 characters max)"
      :error="errors ? errors.content : null"
      id="banner.content"
    />

    <ck-image-input
      v-if="showImageInput"
      @input="onInput({ field: 'image_file_id', value: $event.file_id })"
      id="logo"
      label="Add a logo"
      hint="Click 'Choose file' below to upload a logo to be displayed on the banner"
      :existing-url="
        banner.has_image
          ? apiUrl(`/settings/banner-image.png?v=${now}`)
          : undefined
      "
    />

    <ck-text-input
      :value="banner.button_text || ''"
      @input="onInput({ field: 'button_text', value: $event })"
      label="What should the button say?"
      hint='eg. "Find out more" (30 characters max)'
      :error="errors ? errors.button_text : null"
      id="banner.button_text"
    />

    <ck-text-input
      :value="banner.button_url || ''"
      @input="onInput({ field: 'button_url', value: $event })"
      label="What page should the banner link to?"
      hint="Copy and paste the web address below"
      :error="errors ? errors.button_url : null"
      id="banner.button_url"
      type="url"
    />
    <slot />
  </gov-inset-text>
</template>

<script>
import CkImageInput from "./CkImageInput";

export default {
  components: {
    CkImageInput
  },

  model: {
    prop: "banner",
    event: "update"
  },

  props: {
    banner: {
      type: Object,
      default() {
        return {
          title: "",
          content: "",
          button_text: "",
          button_url: ""
        };
      }
    },
    errors: {
      type: Object,
      default() {
        return {};
      }
    },
    showImageInput: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onInput({ field, value }) {
      const banner = { ...this.banner };

      banner[field] = value;

      this.$emit("update", banner);
      this.$emit("clear", `banner.${field}`);
    }
  }
};
</script>

<style lang="scss" scoped></style>
