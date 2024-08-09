<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful :title="`${appName} - Edit Page ${page.title}`" />

      <gov-back-link :to="{ name: 'pages-show', params: { page: page.id } }"
        >Back to page</gov-back-link
      >
      <gov-main-wrapper>
        <page-form
          :page="page"
          :errors="form.$errors"
          :parent_id.sync="form.parent_id"
          :page_type.sync="form.page_type"
          :title.sync="form.title"
          :slug.sync="form.slug"
          :excerpt.sync="form.excerpt"
          :content.sync="form.content"
          :image_file_id.sync="form.image_file_id"
          :collections.sync="form.collections"
          :enabled.sync="form.enabled"
          @clear="form.$errors.clear($event)"
          @image-changed="imageChanged = $event"
        />

        <gov-section-break size="l" />

        <gov-button v-if="form.$submitting" disabled type="submit"
          >Updating...</gov-button
        >
        <gov-button
          v-else
          @click="onSubmit"
          :disabled="imageChanged"
          type="submit"
          >{{ updateButtonText }}</gov-button
        >

        <ck-submit-error v-if="form.$errors.any()" />
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";
import PageForm from "./forms/PageForm";

export default {
  name: "EditPage",

  components: {
    PageForm
  },

  data() {
    return {
      loading: false,
      page: null,
      form: null,
      imageChanged: false
    };
  },
  computed: {
    updateButtonText() {
      return this.auth.isSuperAdmin ? "Update" : "Request update";
    },
    canDelete() {
      return this.auth.canDelete("page") && this.page.children.length === 0;
    }
  },
  methods: {
    async fetchPage() {
      this.loading = true;

      const response = await http.get(`/pages/${this.$route.params.page}`);
      this.page = response.data.data;
      this.form = new Form({
        title: this.page.title,
        slug: this.page.slug,
        excerpt: this.page.excerpt,
        content: this.page.content,
        page_type: this.page.page_type,
        parent_id: this.page.parent ? this.page.parent.id : null,
        enabled: this.page.enabled,
        image_file_id: this.page.image ? this.page.image.id : null,
        collections: this.page.collections
      });

      this.loading = false;
    },
    async onSubmit() {
      const response = await this.form.put(
        `/pages/${this.page.id}`,
        (config, data) => {
          // Remove any unchanged values.
          if (data.title === this.page.title) {
            delete data.title;
          }
          if (data.slug === this.page.slug) {
            delete data.slug;
          }
          if (data.excerpt === this.page.excerpt) {
            delete data.excerpt;
          }
          if (data.content === this.page.content) {
            delete data.content;
          }
          if (data.page_type === this.page.page_type) {
            delete data.page_type;
          }
          if (data.parent_id === this.page.parent_id) {
            delete data.parent_id;
          }
          if (data.enabled === this.page.enabled) {
            delete data.enabled;
          }

          // Remove the image from the request if unchanged.
          if (
            (this.page.image && data.image_file_id === this.page.image.id) ||
            (this.page.image === null && data.image_file_id === null)
          ) {
            delete data.image_file_id;
          }

          // Convert false to null if removed
          if (data.image_file_id === false) {
            data.image_file_id = null;
          }

          if (
            JSON.stringify(data.collections) ===
            JSON.stringify(this.page.collections)
          ) {
            delete data.collections;
          }
        }
      );

      const updateRequestId = response.id;
      let next = {
        name: "pages-updated",
        params: { page: this.page.id }
      };

      if (this.auth.isSuperAdmin) {
        try {
          const { data } = await http.get(
            `/update-requests/${updateRequestId}`
          );
          if (data.approved_at) {
            next.name = "pages-show";
            next.page = this.page.id;
            next.query = { updated: true };
          }
        } catch (err) {
          console.log(err);
        }
      }
      this.$router.push(next);
    }
  },
  created() {
    this.fetchPage();
  }
};
</script>

<style lang="scss" scoped></style>
