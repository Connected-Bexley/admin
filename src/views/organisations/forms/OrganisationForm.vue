<template>
  <div>
    <ck-text-input
      :value="name"
      @input="onInput('name', $event)"
      id="name"
      label="Organisation name"
      type="text"
      :error="errors.get('name')"
    />

    <ck-text-input
      v-if="auth.isGlobalAdmin"
      :value="slug"
      @input="onInput('slug', $event)"
      id="slug"
      label="Unique slug"
      type="text"
      :error="errors.get('slug')"
    >
      <gov-hint slot="hint" for="slug">
        This will be used to access the organisation page.<br />
        e.g. example.com/organisations/{{ slug }}
      </gov-hint>
    </ck-text-input>

    <ck-wysiwyg-input
      :value="description"
      @input="onInput('description', $event)"
      id="description"
      :maxlength="3000"
      label="Please provide a one-line summary of organisation"
      hint="This should be a short line or two that summarises who the organisation is and will appear below the Organisation name on it's page."
      :error="errors.get('description')"
    />

    <ck-text-input
      :value="url"
      @input="onInput('url', $event)"
      id="url"
      label="Organisation website address"
      type="url"
      :error="errors.get('url')"
    />

    <ck-text-input
      :value="phone"
      @input="onInput('phone', $event)"
      id="phone"
      label="Public phone"
      type="tel"
      :error="errors.get('phone')"
    />

    <ck-text-input
      :value="email"
      @input="onInput('email', $event)"
      id="email"
      label="Public email address"
      type="email"
      :error="errors.get('email')"
    />

    <ck-image-input
      @input="onInput('logo_file_id', $event.file_id)"
      @image-changed="$emit('image-changed', $event)"
      id="logo"
      label="Organisation logo"
      :file-id="logo_file_id"
    />

    <gov-section-break size="l" />

    <gov-heading size="m">Social media links</gov-heading>

    <gov-body>
      If you have any social media accounts for your Organisation, please select
      the appropriate platform from the dropdown and add the relevant URL.
    </gov-body>

    <ck-social-medias-input
      :social-medias="social_medias"
      @input="$emit('update:social_medias', $event)"
      :errors="errors"
    />
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import CkSocialMediasInput from "@/components/Ck/CkSocialMediasInput";

export default {
  name: "OrganisationForm",
  components: {
    CkImageInput,
    CkSocialMediasInput
  },
  props: {
    errors: {
      required: true,
      type: Object
    },
    name: {
      required: true,
      type: String
    },
    slug: {
      required: true,
      type: String
    },
    description: {
      required: true,
      type: String
    },
    url: {
      required: true,
      type: String
    },
    phone: {
      required: true,
      type: String
    },
    email: {
      required: true,
      type: String
    },
    id: {
      required: false,
      type: String
    },
    logo_file_id: {
      required: true,
      type: String
    },
    social_medias: {
      required: true
    }
  },
  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    }
  }
};
</script>
