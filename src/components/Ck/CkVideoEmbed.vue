<template>
  <div>
    <gov-heading tag="h4" size="s">Video Embed</gov-heading>
    <gov-error-message v-if="error !== null" v-text="error" :for="id" />
    <ck-text-input
      :value="video.title"
      @input="onInput('title', $event)"
      id="video_title"
      label="Title"
      type="text"
      :error="null"
    />
    <ck-text-input
      :value="video.url"
      @input="onInput('url', $event)"
      id="video_url"
      label="Video URL"
      type="url"
      :error="null"
    >
      <template slot="hint">
        <gov-hint for="video_embed">
          Youtube and Vimeo links are accepted.
        </gov-hint>
      </template>
    </ck-text-input>
  </div>
</template>

<script>
export default {
  name: "VideoEmbed",

  props: {
    error: {
      required: true
    },
    video: {
      type: Object,
      required: true
    }
  },

  methods: {
    onInput(field, value) {
      const video = Object.assign({}, this.video);
      video[field] = value;
      this.$emit("input", video);
      this.$emit("clear", "video");
    }
  }
};
</script>

<style lang="scss" scoped></style>
