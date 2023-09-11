<template>
  <div>
    <gov-heading size="l"> Registration - step 2 of 5 </gov-heading>

    <gov-back-link :to="{ name: 'register-index' }"> Back </gov-back-link>

    <gov-heading size="l">
      Is your organisation right for {{ appName }}?
    </gov-heading>

    <gov-body>
      We have some criteria for organisations that are listed on the site.
    </gov-body>

    <gov-form-group>
      <gov-label>
        <strong>
          The organisation that you want to be listed on {{ appName }} is:
        </strong>
      </gov-label>

      <gov-hint> Tick all that apply. </gov-hint>

      <gov-checkboxes>
        <gov-checkbox
          :value="form.organisation_types.includes('community')"
          id="organisation_types.community"
          name="organisation_types"
          label="Charity, voluntary or community group, faith group or social enterprise"
          @input="onInput('community')"
        />

        <gov-checkbox
          :value="form.organisation_types.includes('council')"
          id="organisation_types.council"
          name="organisation_types"
          label="A Council or other statutory service, e.g. services delivered by the NHS or local CCG)"
          @input="onInput('council')"
        />

        <gov-checkbox
          :value="form.organisation_types.includes('commercial')"
          id="organisation_types.commercial"
          name="organisation_types"
          label="A commercial provider offering services to local residents that support health, wellbeing and/or community for free or a reasonable charge"
          @input="onInput('commercial')"
        />

        <gov-checkbox
          :value="form.organisation_types.includes('commercial_contracted')"
          id="organisation_types.commercial_contracted"
          name="organisation_types"
          label="A commercial service that is contracted or spot purchased under a commissioning arrangement with the local Council, intended to improve the health, wellbeing or independence of local residents"
          @input="onInput('commercial_contracted')"
        />
      </gov-checkboxes>
    </gov-form-group>

    <gov-button
      start
      :to="{ name: 'register-new-step3' }"
      :disabled="form.organisation_types.length === 0"
    >
      Next
    </gov-button>
  </div>
</template>

<script>
export default {
  model: {
    prop: "form",
    event: "update"
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      required: true
    }
  },

  methods: {
    onInput(organisationType) {
      if (this.form.organisation_types.includes(organisationType)) {
        this.form.organisation_types = this.form.organisation_types.filter(
          type => type !== organisationType
        );
      } else {
        const organisationTypes = this.form.organisation_types.slice();
        organisationTypes.push(organisationType);
        this.form.organisation_types = organisationTypes;
      }
    }
  }
};
</script>
