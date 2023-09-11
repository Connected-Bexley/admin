<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Import Services`" />

    <gov-back-link :to="{ name: 'services-index' }"
      >Back to Services</gov-back-link
    >
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Bulk upload services</gov-heading>
          <gov-body>
            <p>
              This tool allows you to upload the details of more than one
              service into the platform. You can add up to 5000 services in a
              single document.
            </p>

            <p>
              The import tool requires all documents to be either in the .xls or
              .xlsx format. Please note that .csv files are not supported.
            </p>

            <p>
              <gov-link :href="exampleSpreadsheetDownloadLink"
                >An example template can be downloaded here</gov-link
              >
              for you to populate offline and upload below. The uploaded
              document must follow this template and new columns can not be
              added.
            </p>

            <p>
              Upon import, the tool will check the data you have provided to
              make sure it is valid. If there are any errors with the data, none
              of the data will be imported and you will be informed of the
              specific rows and data that are invalid.
            </p>
          </gov-body>

          <spreadsheet-import-form
            :errors="form.$errors"
            :spreadsheet.sync="file"
            :feedback="formResponse"
            @clear="resetForm"
          />

          <gov-button v-if="form.$submitting" disabled type="submit"
            >Uploading...</gov-button
          >
          <gov-button v-else @click="onSubmit" type="submit">Upload</gov-button>
          <ck-loader v-if="form.$submitting"
            >Please wait, this may take up to 5 minutes. Do not navigate away or
            refresh the page</ck-loader
          >
          <ck-submit-error v-if="form.$errors.any()" />

          <ck-submit-error
            v-for="(error, index) in errors"
            :key="`error_${index}`"
          >
            {{ error.message }}
          </ck-submit-error>
        </gov-grid-column>
      </gov-grid-row>
      <gov-grid-row v-if="invalidRows">
        <gov-grid-column width="full">
          <spreadsheet-import-errors
            :fields="fields"
            :invalidRows="invalidRows"
          />
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>
<script>
import Form from "@/classes/Form";
import SpreadsheetImportForm from "@/components/SpreadsheetImportForm";
import SpreadsheetImportErrors from "@/components/SpreadsheetImportErrors";

export default {
  name: "OrganisationsImport",
  components: {
    Form,
    SpreadsheetImportForm,
    SpreadsheetImportErrors
  },

  data() {
    return {
      file: null,

      uploadRows: null,

      invalidRows: null,

      form: new Form({
        spreadsheet: null,
        organisation_id: null
      }),

      fields: {
        index: "Index",
        id: "ID",
        organisation_id: "Organisation ID",
        name: "Name",
        type: "Type",
        status: "Status",
        intro: "Introduction",
        description: "Description",
        wait_time: "Wait Time",
        is_free: "Is Free",
        fees_text: "Fees Text",
        fees_url: "Fees URL",
        testimonial: "Testimonial",
        video_embed: "Video Embed",
        url: "Url",
        contact_name: "Contact Name",
        contact_phone: "Contact Phone",
        contact_email: "Contact Email",
        show_referral_disclaimer: "Show Referral Disclaimer",
        referral_method: "Referral Method",
        referral_button_text: "Referral Button Text",
        referral_email: "Referral Email",
        referral_url: "Referral Url",
        criteria_age_group: "Age Group",
        criteria_disability: "Disability",
        criteria_employment: "Employment",
        criteria_gender: "Gender",
        criteria_housing: "Housing",
        criteria_income: "Income",
        criteria_language: "Language",
        criteria_other: "Other"
      },

      errors: []
    };
  },

  computed: {
    formResponse() {
      return this.uploadRows
        ? "Imported " +
            this.uploadRows +
            (this.uploadRows === 1 ? " Service" : " Services")
        : null;
    },
    exampleSpreadsheetDownloadLink() {
      return `${this.appApiUri}/downloads/services_import_example.xlsx`;
    }
  },

  methods: {
    resetForm(event) {
      this.uploadRows = null;
      this.form.$errors.clear(event);
      this.invalidRows = null;
      this.errors = [];
    },
    onSubmit() {
      this.form.spreadsheet = this.file;
      this.form.organisation_id = this.organisationId;

      this.form
        .post("/services/import")
        .then(response => {
          this.uploadRows = response.data.imported_row_count;
          this.file = null;
          this.organisationId = null;
        })
        .catch(error => {
          if (error.data) {
            this.invalidRows = error.data.errors.spreadsheet;
            this.file = null;
          } else if (error.request) {
            console.error(error.request);
            this.errors.push({ message: error.request.statusText });
          } else {
            console.error(error.message);
            this.errors.push({ message: error.message });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
