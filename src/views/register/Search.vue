<template>
  <div>
    <gov-heading size="l"> Registration - step 1 </gov-heading>

    <gov-back-link :to="{ name: 'dashboard' }">
      Back to dashboard
    </gov-back-link>

    <gov-heading size="l"> Is your Organisation already listed? </gov-heading>

    <gov-body>
      Before you register an account on {{ appName }}, we need to check if your
      organisation is already registered in our database.
    </gov-body>
    <gov-body
      >Type the name of your organisation below to check if it is already
      registered.</gov-body
    >

    <organisation-search @selected="onSelected" />

    <gov-body>Select your organisation and click "next"</gov-body>
    <gov-button
      start
      :to="{ name: 'register-existing-step2' }"
      :disabled="!organisationSelected"
      @click="$emit('update', registration)"
    >
      Next
    </gov-button>
    <gov-body
      >Can’t find your organisation?
      <gov-link @click="resetOrganisation"
        >Register new organisation</gov-link
      ></gov-body
    >
  </div>
</template>

<script>
import OrganisationSearch from "./forms/OrganisationSearch.vue";

export default {
  components: {
    OrganisationSearch
  },
  model: {
    prop: "form",
    event: "update"
  },
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  computed: {
    organisationSelected() {
      return this.form.organisation.id !== "";
    }
  },
  methods: {
    onSelected({ id }) {
      this.form.organisation.id = id;
    },
    resetOrganisation() {
      this.form.organisation.id = "";
      this.$router.push({ name: "register-new-step2" });
    }
  }
};
</script>

<style lang="scss" scoped></style>
