<template>
  <div>
    <vue-headful :title="`${appName} - Admin: Collections`" />

    <gov-tabs :tabs="tabs">
      <router-view />
    </gov-tabs>
  </div>
</template>

<script>
export default {
  name: "ListCollections",
  data() {
    return {
      tabs: [
        { heading: "Categories", to: { name: "admin-index-collections" } },
        {
          heading: "Personas",
          to: { name: "admin-index-collections-personas" }
        },
        {
          heading: "Events",
          to: { name: "admin-index-collections-events" }
        }
      ]
    };
  }
};
</script>
