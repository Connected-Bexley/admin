<template>
  <div>
    <gov-heading tag="h3" size="m">{{ pageTypes[page_type] }}</gov-heading>

    <ck-loader v-if="loading" />

    <ck-select-input
      v-else-if="page_type !== 'landing'"
      :value="parent_id"
      @input="onInput('parent_id', $event)"
      id="parent_id"
      label="Parent"
      :options="parentOptions"
      :error="errors.get('parent_id')"
    />

    <ck-text-input
      :value="title"
      @input="onInput('title', $event)"
      id="title"
      label="Title"
      type="text"
      :error="errors.get('title')"
    />

    <ck-text-input
      :value="slug"
      @input="onInput('slug', $event)"
      id="slug"
      label="Unique slug"
      type="text"
      :error="errors.get('slug')"
    >
      <gov-hint slot="hint" for="slug">
        This will be used to access the page.<br />
        e.g. example.com/pages/{{ slug }}
      </gov-hint>
    </ck-text-input>

    <ck-text-input
      :value="excerpt || ''"
      @input="onInput('excerpt', $event)"
      id="excerpt"
      label="Excerpt"
      type="text"
      :error="errors.get('excerpt')"
    />

    <ck-page-content
      :content="content"
      id="content"
      @update="onInput('content', $event)"
      @clear="$emit('clear', $event)"
      :errors="errors"
    />

    <ck-image-input
      @input="onInput('image_file_id', $event.file_id)"
      @image-changed="$emit('image-changed', $event)"
      id="image"
      label="Page Image"
      :file-id="image_file_id"
    />

    <ck-collection-input
      v-if="page_type === 'landing'"
      :value="pageCollectionIds"
      root="categories"
      :error="errors.get('collections')"
      @input="onInput('collections', $event)"
    >
      <gov-hint>Select the collections to show on the landing page</gov-hint>
    </ck-collection-input>

    <ck-radio-input
      :value="enabled"
      @input="onInput('enabled', $event)"
      id="enabled"
      label="Is the page enabled"
      hint="Indicates if the page is enabled or disabled"
      :options="enabledOptions"
      :error="errors.get('enabled')"
    />
  </div>
</template>

<script>
import http from "@/http";
import CkCollectionInput from "@/components/Ck/CkCollectionInput";
import CkImageInput from "@/components/Ck/CkImageInput";
import CkPageContent from "@/components/CkPageContent";

export default {
  name: "PageForm",

  components: {
    CkImageInput,
    CkPageContent,
    CkCollectionInput
  },

  props: {
    errors: {
      type: Object,
      required: true
    },
    parent_id: {
      required: true
    },
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      default: ""
    },
    content: {
      type: Object,
      required: true
    },
    enabled: {
      type: Boolean,
      required: true
    },
    page_type: {
      type: String,
      default: "information"
    },
    page: {
      type: Object,
      default: null
    },
    image_file_id: {
      default: null
    }
  },

  data() {
    return {
      loading: false,
      pages: [],
      enabledOptions: [
        { label: "Enabled", value: true },
        { label: "Disabled", value: false }
      ],
      pageTypes: {
        information: "Information page",
        landing: "Landing page"
      }
    };
  },

  computed: {
    parentOptions() {
      return [
        { text: "No parent (top level)", value: null },
        ...this.parsePages(
          this.pages.filter(page => {
            return !page.parent;
          })
        )
      ];
    },
    contentErrors() {
      let errors = {};
      Object.keys(this.errors)
        .filter(key => {
          return key.startsWith("content_");
        })
        .forEach(errorKey => {
          errors[errorKey] = this.errors[errorKey];
        });
      return errors;
    },
    pageCollectionIds() {
      return this.page
        ? this.page.collection_categories
            .map(collection => collection.id)
            .concat(
              this.page.collection_personas.map(collection => collection.id)
            )
        : [];
    }
  },

  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    },
    async fetchPages() {
      this.loading = true;

      const { data } = await http.get("/pages/index");
      this.pages = data.data;

      this.loading = false;
    },
    parsePages(pages, parsed = [], depth = 0) {
      pages
        .filter(page => !this.page || page.id !== this.page.id)
        .forEach(page => {
          const text = "-".repeat(depth) + " " + page.title;
          parsed.push({ text, value: page.id });
          const children = this.pages.filter(
            child => child.parent && child.parent.id === page.id
          );
          if (children.length > 0 && depth < 4) {
            parsed = this.parsePages(children, parsed, depth + 1);
          }
        });

      return parsed;
    }
  },

  created() {
    this.fetchPages();
  }
};
</script>

<style lang="scss" scoped></style>
