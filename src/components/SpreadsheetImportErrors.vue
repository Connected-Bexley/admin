<template>
  <gov-error-summary title="Invalid rows">
    <p>
      <gov-hint
        >Scroll the table left and right to see all columns. Fix the listed
        errors and resubmit. Some large text fields have been shortened for
        display, indicated by (...).</gov-hint
      >
    </p>
    <div class="responsive-table-wrapper">
      <gov-table>
        <template slot="header">
          <gov-table-row>
            <gov-table-header
              v-for="(field, index) in fields"
              :key="`OrganisiationImportErrorHeader-${index}`"
            >
              {{ field }}
            </gov-table-header>
            <gov-table-header> Duplicates </gov-table-header>
          </gov-table-row>
        </template>
        <template slot="body">
          <gov-table-row
            v-for="(error, rowIndex) in combinedRows"
            :key="`OrganisiationImportErrorRow-${rowIndex}`"
          >
            <gov-table-cell
              v-for="(field, index) in fields"
              :key="`OrganisiationImportErrorField-${index}`"
              >{{ trimString(error.row[index]) }}
              <gov-error-message
                v-if="error.errors && error.errors[index]"
                :for="`OrganisiationImportErrorField-${index}`"
                >{{ error.errors[index][0] }}</gov-error-message
              >
            </gov-table-cell>
            <gov-table-cell>
              <gov-list v-if="error.originals">
                <li
                  v-for="(original, index) in error.originals"
                  :key="`OrganisiationImportDuplicate-${index}`"
                >
                  <gov-grid-row>
                    <gov-grid-column width="two-thirds">
                      <gov-link
                        :to="{
                          name: 'organisations-show',
                          params: { organisation: original.id }
                        }"
                      >
                        {{ original.name }}
                      </gov-link>
                    </gov-grid-column>
                    <gov-grid-column width="one-third">
                      <gov-button
                        v-if="original.id"
                        :success="!!original.ignored"
                        @click="ignoreDuplicate(original)"
                        >{{
                          !!original.ignored ? "Ignored" : "Ignore"
                        }}</gov-button
                      >
                      <gov-error-message v-else>Repeated row</gov-error-message>
                    </gov-grid-column>
                  </gov-grid-row>
                </li>
              </gov-list>
            </gov-table-cell>
          </gov-table-row>
        </template>
      </gov-table>
    </div>
  </gov-error-summary>
</template>

<script>
export default {
  props: {
    fields: {
      type: Object,
      required: true
    },
    invalidRows: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    duplicateRows: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    }
  },
  computed: {
    combinedRows() {
      const combinedRows = this.invalidRows.slice();
      if (this.duplicateRows.length) {
        this.duplicateRows.forEach(duplicateRow => {
          const index = this.invalidRows.findIndex(invalidRow => {
            return invalidRow.row.index === duplicateRow.row.index;
          });
          if (-1 === index) {
            combinedRows.push(duplicateRow);
          } else {
            combinedRows[index].originals = duplicateRow.originals;
          }
        });
      }
      return combinedRows;
    }
  },
  methods: {
    trimString(s) {
      return String(s).length > 30 ? String(s).slice(0, 30) + "..." : s;
    },
    ignoreDuplicate(duplicate) {
      this.$emit("ignoreDuplicate", duplicate.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.responsive-table-wrapper {
  overflow-x: auto;
}
</style>
