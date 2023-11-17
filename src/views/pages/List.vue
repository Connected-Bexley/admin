<template>
  <div>
    <vue-headful :title="`${appName} - Pages`" />

    <gov-heading size="xl">Pages</gov-heading>
    <gov-section-break size="m" />

    <gov-inset-text v-if="orderChangedMessage">{{
      orderChangedMessage
    }}</gov-inset-text>

    <gov-grid-row>
      <gov-grid-column width="two-thirds">
        <ck-table-filters @search="onSearch">
          <gov-form-group>
            <gov-label for="filter[title]">Page title</gov-label>
            <gov-grid-row>
              <gov-grid-column width="three-quarters">
                <gov-input
                  v-model="filters.title"
                  id="filter[title]"
                  name="filter[title]"
                  type="search"
                />
              </gov-grid-column>
              <gov-grid-column width="one-quarter">
                <gov-button type="button" @click="clearSearch"
                  >Cancel</gov-button
                >
              </gov-grid-column>
            </gov-grid-row>
          </gov-form-group>

          <template slot="extra-filters">
            <gov-form-group>
              <gov-label for="filter[page_type]">Page type</gov-label>
              <gov-select
                v-model="filters.page_type"
                id="filter[page_type"
                name="filter[page_type"
                :options="pageTypes"
              />
            </gov-form-group>
          </template>
        </ck-table-filters>
      </gov-grid-column>
      <gov-grid-column v-if="auth.canAdd('page')" width="one-third">
        <gov-button :to="{ name: 'pages-create-landing' }" success expand
          >Add a new Landing page</gov-button
        >
        <gov-button :to="{ name: 'pages-create-information' }" success expand
          >Add a new Information page</gov-button
        >
      </gov-grid-column>
    </gov-grid-row>

    <ck-loader v-if="loading" />
    <gov-grid-row v-else>
      <gov-grid-column width="two-thirds">
        <gov-list v-if="searching" :bullet="true">
          <li v-for="page in pages" :key="page.id">
            {{ page.title }}
            <span v-if="showView">
              <gov-link
                :to="{
                  name: 'pages-show',
                  params: { page: page.id }
                }"
              >
                View </gov-link
              >&nbsp;
            </span>
            <gov-tag v-if="page.page_type === 'landing'">Landing page</gov-tag
            >&nbsp;
            <gov-tag v-if="!page.enabled" class="govuk-tag--grey"
              >disabled</gov-tag
            >
          </li>
        </gov-list>
        <ck-tree-list
          v-else
          key="pageslist"
          :nodes="pagesTree"
          edit="pages-edit"
          nodeType="page"
          :bullet="true"
          @move-up="onMoveUp"
          @move-down="onMoveDown"
        >
          <template v-if="showView" slot="edit" slot-scope="editProps">
            <gov-link
              :to="{
                name: 'pages-show',
                params: { page: editProps.node.id }
              }"
            >
              View
            </gov-link>
          </template>
          <template slot="status" slot-scope="statusProps">
            <gov-tag v-if="statusProps.node.page_type === 'landing'"
              >Landing page</gov-tag
            >&nbsp;
            <gov-tag v-if="!statusProps.node.enabled" class="govuk-tag--grey"
              >disabled</gov-tag
            >
          </template>
        </ck-tree-list>
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import http from "@/http";
import CkTreeList from "@/components/Ck/CkTreeList";
import CkTableFilters from "@/components/Ck/CkTableFilters";

export default {
  name: "ListPages",
  components: {
    CkTreeList,
    CkTableFilters
  },
  data() {
    return {
      loading: false,
      searching: false,
      pages: [],
      filters: {
        title: "",
        page_type: null
      },
      minSearchPhraseLength: 3,
      pageTypes: [
        { value: "", text: "All" },
        { value: "information", text: "Information page" },
        { value: "landing", text: "Landing page" }
      ],
      orderChangedMessage: null
    };
  },
  computed: {
    pagesTree() {
      return this.buildPagesTree(
        this.pages.filter(page => {
          return !page.parent;
        })
      );
    },
    params() {
      const params = {};
      if (this.filters.title.length > this.minSearchPhraseLength) {
        params["filter[title]"] = this.filters.title;
      }
      if (this.filters.page_type) {
        params["filter[page_type]"] = this.filters.page_type;
      }
      return params;
    },
    showView() {
      return this.auth.canView("pages");
    },
    updatedPage() {
      return this.updated
        ? this.pages.find(page => page.id === this.updated)
        : null;
    }
  },
  methods: {
    async fetchPages() {
      this.loading = true;
      this.searching = Object.keys(this.params).length > 0;
      const { data } = await http.get("/pages/index", {
        params: this.params
      });
      this.pages = data.data.map(page => {
        return {
          label: page.title,
          ...page
        };
      });

      this.loading = false;
    },
    async onMoveUp(page) {
      this.orderChangedMessage = null;
      const orderWas = page.order;
      page.order--;
      await http.put(`/pages/${page.id}`, {
        id: page.id,
        order: page.order
      });
      if (!this.auth.isSuperAdmin) {
        this.orderChangedMessage = this.orderUpdateRequestMessage(
          orderWas,
          page
        );
      }
      this.fetchPages();
    },
    async onMoveDown(page) {
      this.orderChangedMessage = null;
      const orderWas = page.order;
      page.order++;
      await http.put(`/pages/${page.id}`, {
        id: page.id,
        order: page.order
      });
      if (!this.auth.isSuperAdmin) {
        this.orderChangedMessage = this.orderUpdateRequestMessage(
          orderWas,
          page
        );
      }
      this.fetchPages();
    },
    async onSearch() {
      await this.fetchPages();
    },
    async clearSearch() {
      this.filters.title = "";
      await this.fetchPages();
    },
    buildPagesTree(pages, parsed = [], depth = 0) {
      pages
        .sort((page1, page2) => {
          return page1.order - page2.order;
        })
        .forEach(page => {
          page.children = this.pages.filter(
            child => child.parent && child.parent.id === page.id
          );

          if (depth === 0) {
            parsed.push(page);
          }

          if (page.children.length > 0 && depth < 4) {
            parsed = this.buildPagesTree(page.children, parsed, depth + 1);
          }
        });

      return parsed;
    },
    orderUpdateRequestMessage(orderWas, page) {
      return `An update request has been created to change the order of page ${page.title} from ${orderWas} to ${page.order}`;
    }
  },
  created() {
    this.fetchPages();
  }
};
</script>

<style lang="scss" scoped></style>
