<template>
  <gov-form-group :invalid="form.$errors.any()">
    <gov-label :for="id" class="govuk-!-font-weight-bold">
      <slot name="label">{{ label }}</slot>
    </gov-label>

    <slot name="hint">
      <gov-hint v-if="hint" :for="id" v-text="hint" />
    </slot>

    <gov-file-upload
      :value="form.file"
      @change="onChangeFile"
      :id="id"
      :name="id"
      :accept="accept"
      ref="file"
    />

    <slot name="after-input" />

    <!-- Uploading loader -->
    <ck-loader v-if="form.$submitting">Uploading</ck-loader>
    <!-- Uploaded image -->
    <img
      v-else-if="form.file"
      :src="form.file"
      :key="`UploadedImage::${_uid}`"
      :alt="form.alt_text"
      class="ck-logo"
    />

    <ck-text-input
      :value="form.alt_text || ''"
      @input="onChangeAltText"
      id="altText"
      label="Image description"
      hint="Describe the image for visually impaired visitors"
      type="text"
      :error="form.$errors.get('alt_text')"
    />

    <gov-error-message
      v-if="form.$errors.any()"
      v-text="form.$errors.get(['is_private', 'mime_type', 'file'])"
      :for="id"
    />

    <transition name="fade-in-out">
      <gov-hint v-if="success" class="upload-success">
        Image updated
      </gov-hint>
      <gov-warning-text v-else-if="form.file && !form.alt_text"
        >Image description is required</gov-warning-text
      >
      <gov-warning-text v-else-if="imageChanged">
        The image or description has changed, click
        <em>{{ fileId ? "Update" : "Upload" }} file</em> to commit these changes
      </gov-warning-text>
    </transition>

    <slot name="after-error-message" />

    <div class="govuk-!-margin-top-2">
      <gov-button
        @click="onUpload"
        type="button"
        :disabled="!form.file || !form.alt_text || !form.mime_type"
        >{{ fileId ? "Update" : "Upload" }} file</gov-button
      >&nbsp;
      <gov-button v-if="form.file" @click="onRemove" type="button" error
        >Remove file</gov-button
      >
    </div>
  </gov-form-group>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";
import CkTextInput from "./CkTextInput.vue";

export default {
  name: "CkImageInput",
  components: { CkTextInput },
  props: {
    label: {
      required: true,
      type: String
    },
    hint: {
      required: false,
      type: String
    },
    accept: {
      required: false,
      default: "image/png,image/jpg,image/jpeg,image/svg+xml"
    },
    id: {
      required: true,
      type: String
    },
    fileId: {
      required: false,
      type: String
    },
    private: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageChanged: false,
      success: false,
      form: new Form({
        is_private: this.private,
        mime_type: null,
        alt_text: "",
        file: null
      })
    };
  },
  methods: {
    onChangeFile($event) {
      // If null, then simply emit null.
      if ($event === null) {
        this.form.mime_type = null;
        this.form.file = null;
        this.$emit("input", { file_id: null, image: null });
        return;
      }
      // Destructure the payload with the variables we need.
      const { mime_type, content } = $event;
      // Set the outstanding changes flag
      this.imageChanged = true;
      this.$emit("image-changed", true);
      // Set the variables in the form.
      this.form.mime_type = mime_type;
      this.form.file = content;
    },
    onChangeAltText($event) {
      this.form.alt_text = $event;
      // Set the outstanding changes flag
      this.imageChanged = true;
      this.$emit("image-changed", true);
    },
    async onUpload() {
      // Upload the file and retrieve the ID.
      const {
        data: { id }
      } = await this.form.post("/files");
      if (!this.form.$errors.any()) {
        this.success = true;
        setTimeout(() => (this.success = false), 3000);
        // Reset the outstanding changes flag
        this.imageChanged = false;
        this.$emit("image-changed", false);
        // Emit the file ID.
        this.$emit("input", {
          file_id: id,
          image: this.form.file
        });
      }
    },
    onRemove() {
      // For uploaded file.
      if (this.form.file) {
        this.$refs.file.$el.value = "";
        this.form.mime_type = null;
        this.form.file = null;
        this.form.alt_text = null;
        this.form.$errors.clear();
        this.$emit("input", { file_id: null, image: null, alt: null });
        return;
      }
      // Reset the outstanding changes flag
      this.imageChanged = false;
      this.$emit("image-changed", false);
      this.$emit("input", { file_id: false, image: null, alt: null });
    },
    async loadFile(fileId) {
      const { data: file } = await http.get(`files/${fileId}`);
      this.form.file = file.data.src;
      this.form.mime_type = file.data.mime_type;
      this.form.alt_text = file.data.alt_text;
    }
  },
  created() {
    if (this.fileId) {
      this.loadFile(this.fileId);
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/app.scss";
.govuk-hint.upload-success {
  color: govuk-colour("green") !important;
}
.fade-in-out-enter-active {
  transition: opacity 0.3s ease;
}
.fade-in-out-leave-active {
  transition: opacity 0.3s ease;
}
.fade-in-out-enter,
.fade-in-out-leave-to {
  opacity: 0;
}
</style>
