<template>
  <gov-width-container>
    <vue-headful title="Help Yourself Sutton - Add Page" />

    <gov-back-link :to="{ name: 'pages-index' }">Back to pages</gov-back-link>
    <gov-main-wrapper>
      <page-form
        :errors="form.$errors"
        :is-new="true"
        :page_type.sync="form.page_type"
        :parent_id.sync="form.parent_id"
        :title.sync="form.title"
        :slug.sync="form.slug"
        :excerpt.sync="form.excerpt"
        :content.sync="form.content"
        :image_file_id.sync="form.image_file_id"
        :collections.sync="form.collections"
        :enabled.sync="form.enabled"
        @clear="form.$errors.clear($event)"
      />
    </gov-main-wrapper>

    <gov-section-break size="l" />

    <gov-button v-if="form.$submitting" disabled type="submit"
      >Creating...</gov-button
    >
    <gov-button v-else @click="onSubmit" type="submit">Create</gov-button>
    <ck-submit-error v-if="form.$errors.any()" />
  </gov-width-container>
</template>

<script>
import PageForm from "./forms/PageForm";
import Form from "@/classes/Form";

export default {
  name: "CreatePage",

  components: {
    PageForm,
  },

  props: {
    type: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      form: new Form({
        parent_id: null,
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        page_type: this.type,
        image_file_id: null,
        collections: [],
        enabled: false,
      }),

      contentTypes: {
        landing: {
          introduction: {
            order: 1,
            label: "Introduction",
            hint: "",
            content: [
              {
                type: "copy",
                value: "",
              },
            ],
          },
          about: {
            order: 2,
            label: "About",
            hint: "",
            content: [
              {
                type: "copy",
                value: "",
              },
            ],
          },
          info_pages: {
            order: 3,
            label: "Information Pages",
            hint: "",
            title: "",
            content: [
              {
                type: "copy",
                value: "",
              },
            ],
          },
          collections: {
            order: 4,
            label: "Collections",
            hint: "",
            title: "",
            content: [
              {
                type: "copy",
                value: "",
              },
            ],
          },
        },
        information: {
          introduction: {
            order: 1,
            label: "Page content",
            hint: "This is the largest content of the page. Use formatting to improve readability and impact.",
            content: [
              {
                type: "copy",
                value: "",
              },
            ],
          },
        },
      },
    };
  },

  methods: {
    async onSubmit() {
      await this.form.post("/pages");
      this.$router.push({ name: "pages-index" });
    },
  },

  created() {
    this.form.content = this.contentTypes[this.form.page_type];
  },
};
</script>

<style lang="scss" scoped></style>
