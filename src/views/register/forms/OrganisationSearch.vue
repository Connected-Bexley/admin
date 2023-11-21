<template>
  <div>
    <gov-grid-row>
      <gov-grid-column width="full">
        <gov-form-group>
          <gov-label for="filter[name]">Organisation name</gov-label>
          <gov-input
            v-model="filters.name"
            id="filter[name]"
            name="filter[name]"
            type="search"
            @input="onSearch"
          />
        </gov-form-group>
      </gov-grid-column>
    </gov-grid-row>
    <gov-grid-row>
      <gov-grid-column width="full">
        <gov-radios>
          <gov-radio
            v-for="org in organisations"
            :key="org.id"
            :bind-to="organisationId"
            name="organisation"
            :label="org.name"
            :id="org.id"
            :value="org.id"
            @input="onSelect"
          ></gov-radio>
        </gov-radios>
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import axios from "axios";

const http = axios.create({
  baseURL: `${process.env.VUE_APP_API_URI}/core/v1`
});
http.defaults.headers.post["Content-Type"] = "application/json";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      loading: false,
      organisations: [],
      organisationId: null
    };
  },
  computed: {
    params() {
      const params = {
        per_page: 20
      };

      if (this.filters.name !== "") {
        params["filter[name]"] = this.filters.name;
      }

      return params;
    }
  },
  methods: {
    async fetchOrganisations() {
      this.loading = true;

      const response = await http.get("/organisations", {
        params: this.params
      });
      this.organisations = response.data.data;

      this.loading = false;
    },
    onSearch() {
      this.fetchOrganisations();
    },
    onSelect(organisationId) {
      this.$emit("selected", { id: organisationId });
      this.organisationId = organisationId;
    }
  }
};
</script>

<style lang="scss" scoped></style>
