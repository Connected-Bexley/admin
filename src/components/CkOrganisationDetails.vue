<template>
  <gov-table>
    <template slot="body">
      <gov-table-row>
        <gov-table-header top scope="row">Organisation name</gov-table-header>
        <gov-table-cell>{{ organisation.name }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Description</gov-table-header>
        <gov-table-cell v-html="toHtml(organisation.description)" />
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Website Address</gov-table-header>
        <gov-table-cell break>{{ organisation.url }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Phone number</gov-table-header>
        <gov-table-cell>{{ organisation.phone || "-" }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Email</gov-table-header>
        <gov-table-cell>{{ organisation.email || "-" }}</gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header top scope="row">Logo</gov-table-header>
        <gov-table-cell>
          <ck-image
            v-if="organisation.image"
            :file-id="organisation.image.id"
          />
        </gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header scope="row" top>Social links</gov-table-header>
        <gov-table-cell break>
          <gov-list>
            <li
              v-for="(socialMedia, index) in organisation.social_medias"
              :key="index"
            >
              ({{ humanReadableSocialMedia(socialMedia.type) }})
              {{ socialMedia.url }}
            </li>
            <li v-if="organisation.social_medias.length === 0">-</li>
          </gov-list>
        </gov-table-cell>
      </gov-table-row>
      <gov-table-row>
        <gov-table-header scope="row" top>Taxonomies</gov-table-header>
        <gov-table-cell break>
          <gov-grid-row
            v-for="rootTaxonomy in taxonomies"
            :key="rootTaxonomy.id"
          >
            <gov-grid-column width="two-thirds">
              <gov-heading size="m">{{ rootTaxonomy.name }}</gov-heading>
              <ck-taxonomy-list
                :taxonomies="rootTaxonomy.children"
                :filteredTaxonomyIds="organisationTaxonomyIds"
              />
            </gov-grid-column>
          </gov-grid-row>
        </gov-table-cell>
      </gov-table-row>
    </template>
  </gov-table>
</template>

<script>
import http from "@/http";
import CkImage from "@/components/Ck/CkImage.vue";
import CkTaxonomyList from "@/components/Ck/CkTaxonomyList.vue";

export default {
  name: "CkOrganisationDetails",

  components: {
    CkTaxonomyList,
    CkImage
  },

  props: {
    organisation: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      taxonomies: []
    };
  },

  computed: {
    organisationTaxonomyIds() {
      return this.organisation.category_taxonomies.map(taxonomy => taxonomy.id);
    }
  },

  methods: {
    humanReadableSocialMedia(type) {
      switch (type) {
        case "twitter":
          return "Twitter / X";
        case "facebook":
          return "Facebook";
        case "instagram":
          return "Instagram";
        case "snapchat":
          return "Snapchat";
        case "tiktok":
          return "TikTok";
        case "youtube":
          return "YouTube";
        case "other":
          return "Other";
      }
    },
    async fetchTaxonomies() {
      this.loading = true;
      const { data: taxonomies } = await http.get("/taxonomies/categories");
      this.taxonomies = taxonomies.data;
      this.loading = false;
    }
  },

  created() {
    this.fetchTaxonomies();
  }
};
</script>
