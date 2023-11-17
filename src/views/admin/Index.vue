<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Admin`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>

    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Admin</gov-heading>

          <gov-tabs :tabs="tabs" bar :panel="false">
            <gov-section-break size="m" />
            <router-view />
          </gov-tabs>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
export default {
  name: "Admin",
  computed: {
    tabs() {
      const tabs = [];
      if (this.auth.canView("audits")) {
        tabs[0] = {
          heading: "Audit Logs",
          to: { name: "admin-index" }
        };
      }
      if (this.auth.canView("notifications")) {
        tabs[1] = {
          heading: "Notifications",
          to: { name: "admin-index-notifications" }
        };
      }
      if (this.auth.canView("feedback")) {
        tabs[2] = {
          heading: "Feedback",
          to: { name: "admin-index-feedback" }
        };
      }
      if (this.auth.canView("taxonomies")) {
        tabs[3] = {
          heading: "Taxonomies",
          to: { name: "admin-index-taxonomies" }
        };
      }
      if (this.auth.canView("collections")) {
        tabs[4] = {
          heading: "Collections",
          to: { name: "admin-index-collections" }
        };
      }
      if (this.auth.canView("search engine")) {
        tabs[5] = {
          heading: "Search engine",
          to: { name: "admin-index-search-engine" }
        };
      }
      if (this.auth.canView("cms")) {
        tabs[6] = { heading: "CMS", to: { name: "admin-index-cms" } };
      }
      return tabs;
    }
  }
};
</script>
