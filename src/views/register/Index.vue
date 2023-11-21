<template>
  <div>
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="two-thirds">
          <router-view
            v-model="form"
            :errors="form.$errors"
            @completed="submitRegistration"
          ></router-view>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </div>
</template>

<script>
import Form from "@/classes/Form";
import axios from "axios";
const http = axios.create({
  baseURL: `${process.env.VUE_APP_API_URI}/core/v1`
});
http.defaults.headers.post["Content-Type"] = "application/json";

export default {
  data() {
    return {
      form: new Form(
        {
          organisation_types: [],
          user: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: ""
          },
          organisation: {
            id: "",
            name: "",
            slug: "",
            description: "",
            url: "",
            email: "",
            phone: ""
          }
        },
        {},
        http
      )
    };
  },
  methods: {
    async submitRegistration() {
      this.form.organisation.slug = this.slugify(this.form.organisation.name);
      try {
        await this.form.post("/organisation-sign-up-forms");
        this.$router.push({ name: "register-completed" });
      } catch (exception) {
        const formErrors = Object.keys(exception.errors);
        if (formErrors.includes("organisation_id")) {
          this.$router.push({ name: "register-index" });
        } else if (
          !this.form.organisation.id &&
          formErrors.some(error => error.startsWith("user"))
        ) {
          this.$router.push({ name: "register-new-step4" });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
