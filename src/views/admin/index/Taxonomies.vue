<template>
  <div>
    <vue-headful :title="`${appName} - Admin: Taxonomies`" />

    <gov-tabs :tabs="tabs">
      <router-view />
    </gov-tabs>
  </div>
</template>

<script>
export default {
  name: "ListTaxonomies",
  data() {
    return {
      tabs: [
        { heading: "Categories", to: { name: "admin-index-taxonomies" } },
        {
          heading: "Organisations",
          to: { name: "admin-index-taxonomies-organisations" }
        },
        {
          heading: "Service Eligibilities",
          to: { name: "admin-index-taxonomies-service-eligibilities" }
        }
      ]
    };
  }
};
</script>
