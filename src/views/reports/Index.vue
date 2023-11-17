<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Reports`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Reports</gov-heading>

          <gov-body
            >Access information by receiving updates on data such as site
            usage.</gov-body
          >

          <gov-tabs :tabs="tabs">
            <router-view />
          </gov-tabs>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
export default {
  name: "ReportsPage",
  computed: {
    tabs() {
      const tabs = [];
      if (this.auth.canView("reports")) {
        tabs[0] = {
          heading: "View all",
          to: { name: "reports-index" }
        };
      }
      if (this.auth.canAdd("report") || this.auth.canEdit("report")) {
        tabs[1] = {
          heading: "Manage",
          to: { name: "reports-edit" }
        };
      }
      return tabs;
    }
  }
};
</script>
