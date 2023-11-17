<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Import Organisations`" />

    <gov-back-link :to="{ name: 'organisations-index' }"
      >Back to Organisations</gov-back-link
    >
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Bulk upload organisations</gov-heading>
          <gov-body>
            <p>
              This tool allows you to upload the details of more than one
              organisation into the platform. You can add up to 5000
              organisations in a single document.
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
          <ck-submit-error v-if="form.$errors.any()" />
        </gov-grid-column>
      </gov-grid-row>
      <gov-grid-row v-if="invalidRows.length || duplicateRows.length">
        <gov-grid-column width="full">
          <spreadsheet-import-errors
            :fields="fields"
            :invalidRows="invalidRows"
            :duplicateRows="duplicateRows"
            @ignoreDuplicate="ignoreDuplicate"
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

      invalidRows: [],

      duplicateRows: [],

      ignoreDuplicateIds: [],

      form: new Form({
        spreadsheet: null,
        ignore_duplicates: null
      }),

      fields: {
        index: "Index",
        id: "ID",
        name: "Name",
        description: "Description",
        email: "Email",
        phone: "Phone",
        url: "Url"
      }
    };
  },

  computed: {
    formResponse() {
      return this.uploadRows
        ? "Imported " +
            this.uploadRows +
            (this.uploadRows === 1 ? " Organisation" : " Organisations")
        : null;
    },
    exampleSpreadsheetDownloadLink() {
      return `${this.appApiUri}/downloads/organisations_import_example.xls`;
    }
  },

  methods: {
    resetForm(event) {
      this.form.$errors.clear(event);
    },
    async onSubmit() {
      this.form.spreadsheet = this.file;
      this.form.ignore_duplicates = this.duplicateRows.reduce(
        (duplicateIds, duplicateRow) => {
          return duplicateIds.concat(
            duplicateRow.originals
              .filter(original => {
                return original.ignored;
              })
              .map(original => {
                return original.id;
              })
          );
        },
        []
      );
      this.uploadRows = null;
      this.duplicateRows = [];
      this.invalidRows = [];

      this.form
        .post("/organisations/import")
        .then(response => {
          this.uploadRows = response.data.imported_row_count;
          this.file = null;
        })
        .catch(error => {
          this.invalidRows = error.data.errors
            ? error.data.errors.spreadsheet
            : [];
          this.duplicateRows =
            error.data.duplicates.map(duplicateRow => {
              for (let i = 0; i < duplicateRow.originals.length; i++) {
                duplicateRow.originals[i].ignored = false;
              }
              return duplicateRow;
            }) || [];
          this.file = null;
        });
    },
    ignoreDuplicate(duplicateId) {
      for (let i = 0; i < this.duplicateRows.length; i++) {
        for (let j = 0; j < this.duplicateRows[i].originals.length; j++) {
          if (this.duplicateRows[i].originals[j].id === duplicateId) {
            this.duplicateRows[i].originals[j].ignored = !this.duplicateRows[i]
              .originals[j].ignored;
            return;
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
