<template>
  <div>
    <gov-inset-text
      v-for="(socialMedia, index) in socialMedias"
      :key="socialMedia.index"
    >
      <ck-select-input
        :value="socialMedia.type"
        @input="onTypeInput({ index, value: $event })"
        :id="`social_media.${index}.type`"
        label="Platform:"
        :options="socialMediaTypeOptions"
        :error="errors.get(`social_media.${index}.type`)"
      />

      <ck-text-input
        :value="socialMedia.url"
        @input="onUrlInput({ index, value: $event })"
        :id="`social_medias.${index}.url`"
        label="Link to your page:"
        :hint="linkHint(socialMedia.type)"
        type="url"
        :error="errors.get(`social_medias.${index}.url`)"
      />

      <gov-button @click="onDeleteSocialMedia(index)" error>Delete</gov-button>
    </gov-inset-text>

    <div>
      <gov-button @click="onAddSocialMedia">
        <template v-if="socialMedias.length === 0">Add social media</template>
        <template v-else>Add another</template>
      </gov-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SocialMediasInput",
  model: {
    prop: "socialMedias",
    event: "input"
  },
  props: {
    socialMedias: {
      required: true,
      type: Array
    },
    errors: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      socialMediaTypeOptions: [
        { text: "Please select", value: null, disabled: true },
        { text: "Twitter / X", value: "twitter" },
        { text: "Facebook", value: "facebook" },
        { text: "Instagram", value: "instagram" },
        { text: "TikTok", value: "tiktok" },
        { text: "YouTube", value: "youtube" },
        { text: "SnapChat", value: "snapchat" },
        { text: "Other", value: "other" }
      ],
      exampleSocialMediaUrls: {
        twitter: "https://twitter.com/example or https://x.com/example",
        facebook: "https://www.facebook.com/example",
        instagram: "https://www.instagram.com/example",
        tiktok: "https://tiktok.com/@example",
        youtube: "https://www.youtube.com/channel/example-channelId",
        snapchat: "https://www.snapchat.com/add/example",
        other: "the public link from your social media account"
      },
      socialMediasIndex: 1
    };
  },
  methods: {
    cloneSocialMedias() {
      return this.socialMedias.map(socialMedia => ({ ...socialMedia }));
    },
    onAddSocialMedia() {
      let socialMedias = this.cloneSocialMedias();
      socialMedias.push({
        type: null,
        url: "",
        index: this.socialMediasIndex
      });
      this.$emit("input", socialMedias);

      this.socialMediasIndex++;
    },
    onDeleteSocialMedia(deleteIndex) {
      let socialMedias = this.cloneSocialMedias();
      this.$delete(socialMedias, deleteIndex);
      this.$emit("input", socialMedias);
      this.$emit("clear", `social_medias.${deleteIndex}.type`);
      this.$emit("clear", `social_medias.${deleteIndex}.url`);
    },
    onTypeInput({ index, value }) {
      let socialMedias = this.cloneSocialMedias();
      socialMedias[index].type = value;
      this.$emit("input", socialMedias);
      this.$emit("clear", `social_medias.${index}.type`);
    },
    onUrlInput({ index, value }) {
      let socialMedias = this.cloneSocialMedias();
      socialMedias[index].url = value;
      this.$emit("input", socialMedias);
      this.$emit("clear", `social_medias.${index}.url`);
    },
    linkHint(type) {
      return `Copy the link from your browser, e.g. ${
        this.exampleSocialMediaUrls[type || "other"]
      }`;
    }
  }
};
</script>
