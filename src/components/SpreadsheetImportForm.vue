<template>
  <ck-file-input
    ref="fileInput"
    :value="spreadsheet"
    @input="onInput('spreadsheet', $event === null ? null : $event.content)"
    id="spreadsheet"
    label="Upload Spreadsheet (.xls or .xlsx)"
    accept="*"
    :error="errors.get('invalidRows') || errors.get('spreadsheet')"
    :hint="feedback"
  >
  </ck-file-input>
</template>

<script>
export default {
  name: "SpreadsheetImportForm",

  props: {
    errors: {
      required: true,
      type: Object
    },

    spreadsheet: {
      required: true
    },

    feedback: {
      type: String,
      default: null
    }
  },

  watch: {
    spreadsheet(isNow, wasThen) {
      if (wasThen && !isNow) {
        this.$refs.fileInput.$refs.file.$el.value = "";
      }
    }
  },

  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    }
  }
};
</script>
