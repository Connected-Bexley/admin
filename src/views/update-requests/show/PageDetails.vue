<template>
  <ck-loader v-if="loading" />
  <div v-else>
    <gov-body v-if="original">
      For page
      <gov-link
        :to="{
          name: 'pages-edit',
          params: { page: original.id }
        }"
        v-text="original.title"
      />.
    </gov-body>

    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header scope="column"></gov-table-header>
          <gov-table-header scope="column" v-if="original"
            >From</gov-table-header
          >
          <gov-table-header scope="column">{{
            original ? "To" : "New"
          }}</gov-table-header>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('page_type')">
          <gov-table-header top scope="row">Type</gov-table-header>
          <gov-table-cell break v-if="original">{{
            original.page_type | originalExists | ucfirst
          }}</gov-table-cell>
          <gov-table-cell break>{{ page.page_type | ucfirst }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('title')">
          <gov-table-header top scope="row">Title</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.title | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ page.title }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('slug')">
          <gov-table-header top scope="row">Slug</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.slug | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ page.slug }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('excerpt')">
          <gov-table-header top scope="row">Excerpt</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.excerpt | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ page.excerpt }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('enabled')">
          <gov-table-header top scope="row">Status</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.enabled | status
          }}</gov-table-cell>
          <gov-table-cell>{{ page.enabled | status }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('order')">
          <gov-table-header top scope="row">Order</gov-table-header>
          <gov-table-cell v-if="original">{{ original.order }}</gov-table-cell>
          <gov-table-cell>{{ page.order }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('content')">
          <gov-table-header top scope="row">Content</gov-table-header>
          <gov-table-cell v-if="original">
            <div
              v-if="
                original.hasOwnProperty('content') &&
                  typeof original.content === 'object' &&
                  original.content.constructor === Object
              "
            >
              <page-content :content="original.content" />
            </div>
            <template v-else>None</template>
          </gov-table-cell>
          <gov-table-cell>
            <div
              v-if="
                page.hasOwnProperty('content') &&
                  typeof page.content === 'object' &&
                  page.content.constructor === Object
              "
            >
              <page-content :content="page.content" />
            </div>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('image_file_id')">
          <gov-table-header top scope="row">Image</gov-table-header>
          <gov-table-cell v-if="original">
            <ck-image v-if="original.image" :file-id="original.image.id" />
          </gov-table-cell>
          <gov-table-cell>
            <ck-image v-if="page.image_file_id" :file-id="page.image_file_id" />
            <img
              v-else
              :src="
                apiUrl(
                  `/pages/new/image.png?update_request_id=${updateRequestId}`
                )
              "
              alt="Page image"
              class="ck-logo"
            />
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="page.hasOwnProperty('collections')">
          <gov-table-header top scope="row">Collections</gov-table-header>
          <gov-table-cell v-if="original">
            <gov-list
              bullet
              v-if="
                original.hasOwnProperty('collection_categories') &&
                  Array.isArray(original.collection_categories)
              "
            >
              <li
                v-for="(collection, index) in original.collection_categories"
                :key="`collections.${index}`"
              >
                {{ collection.name }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
          <gov-table-cell>
            <gov-list bullet v-if="Array.isArray(page.collections)">
              <li
                v-for="(collectionId, index) in page.collections"
                :key="`collections.${index}`"
              >
                {{ collectionName(findCollection(collectionId)) }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
import http from "@/http";
import CkImage from "@/components/Ck/CkImage";
import PageContent from "@/views/pages/show/PageContent.vue";

export default {
  name: "PageDetails",

  components: {
    CkImage,
    PageContent
  },

  props: {
    updateRequestId: {
      required: true,
      type: String
    },

    requestedAt: {
      required: true,
      type: String
    },

    page: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      original: null,
      collections: []
    };
  },
  methods: {
    async fetchOriginal() {
      if (this.page.id !== null) {
        this.loading = true;
        const {
          data: { data: original }
        } = await http.get(`/pages/${this.page.id}`);
        this.original = original;
        this.loading = false;
      } else {
        this.original = null;
      }
    },

    async fetchCollections() {
      const {
        data: { data: collections }
      } = await http.get("/collections/categories/all");
      this.collections = collections;
    },
    findCollection(collectionId) {
      return this.collections.find(
        collection => collection.id === collectionId
      );
    },
    collectionName(collection) {
      return collection ? collection.name : "";
    }
  },

  filters: {
    status(status) {
      return status ? "Enabled" : "Disabled";
    },

    originalExists(field) {
      return field || "";
    }
  },

  created() {
    this.fetchOriginal();
    this.fetchCollections();
  }
};
</script>

<style lang="scss" scoped></style>
