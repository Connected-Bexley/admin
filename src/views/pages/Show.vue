<template>
  <gov-width-container>
    <gov-back-link :to="{ name: 'pages-index' }">Back to pages</gov-back-link>
    <gov-main-wrapper>
      <ck-loader v-if="loading" />
      <gov-grid-row v-else>
        <vue-headful :title="`${appName} - Show Page ${page.title}`" />

        <gov-grid-column width="full">
          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <gov-heading size="m">
                <gov-caption size="m">{{ page.title }}</gov-caption>
                View page
              </gov-heading>
              <gov-inset-text v-if="updated"
                >page {{ page.title }} has been updated</gov-inset-text
              >
            </gov-grid-column>
            <gov-grid-column
              v-if="auth.canEdit('page', page)"
              width="one-third"
              class="text-right"
            >
              <gov-button
                :to="{ name: 'pages-edit', params: { page: page.id } }"
                >Edit page</gov-button
              >
            </gov-grid-column>
          </gov-grid-row>

          <gov-table>
            <template slot="body">
              <gov-table-row>
                <gov-table-header top scope="row">Page type</gov-table-header>
                <gov-table-cell>{{ pageTypes[page.page_type] }}</gov-table-cell>
              </gov-table-row>

              <gov-table-row>
                <gov-table-header top scope="row">Status</gov-table-header>
                <gov-table-cell>{{
                  page.enabled ? "Enabled" : "Disabled"
                }}</gov-table-cell>
              </gov-table-row>

              <gov-table-row>
                <gov-table-header top scope="row">Title</gov-table-header>
                <gov-table-cell>{{ page.title }}</gov-table-cell>
              </gov-table-row>

              <gov-table-row>
                <gov-table-header top scope="row"
                  >Page content</gov-table-header
                >
                <gov-table-cell>
                  <page-content :content="page.content" />
                </gov-table-cell>
              </gov-table-row>

              <gov-table-row>
                <gov-table-header top scope="row">Image</gov-table-header>
                <gov-table-cell>
                  <img
                    :src="
                      apiUrl(`/pages/${page.id}/image.png?v=${page.updated_at}`)
                    "
                    :alt="page.title"
                    class="ck-logo"
                  />
                </gov-table-cell>
              </gov-table-row>
            </template>
          </gov-table>

          <template v-if="auth.canDelete('page')">
            <gov-section-break size="l" />

            <gov-body
              >Please be certain of the action before deleting a page</gov-body
            >

            <ck-delete-button
              resource="page"
              :endpoint="`/pages/${this.page.id}`"
              @deleted="onDelete"
            />
          </template>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import PageContent from "@/views/pages/show/PageContent.vue";

export default {
  name: "ShowPage",

  components: {
    PageContent
  },

  data() {
    return {
      loading: false,
      page: null,
      updated: false,
      pageTypes: {
        information: "Information page",
        landing: "Landing page"
      }
    };
  },

  methods: {
    async fetchPage() {
      this.loading = true;

      const response = await http.get(`/pages/${this.$route.params.page}`);
      this.page = response.data.data;

      this.loading = false;
    },
    onDelete() {
      this.$router.push({
        name: "pages-index"
      });
    }
  },

  created() {
    this.updated = this.$route.query.updated || false;
    this.fetchPage();
  }
};
</script>

<style lang="scss" scoped></style>
