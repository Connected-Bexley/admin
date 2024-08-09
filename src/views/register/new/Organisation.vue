<template>
  <div>
    <gov-heading size="l"> Registration - step 5 of 5 </gov-heading>
    <gov-back-link :to="{ name: 'register-new-step4' }"> Back </gov-back-link>

    <gov-heading size="l"> Register new Organisation </gov-heading>

    <gov-body>
      If you are a smaller group or activity that isn't directly run by an
      organisation, you can enter details about your service/group below.
    </gov-body>

    <ck-text-input
      v-model="form.organisation.name"
      id="name"
      label="Organisation name"
      type="text"
      :error="errors.get(['organisation.name', 'organisation.slug'])"
    >
      <gov-hint slot="hint" for="name">
        The name of your organisation must be unique. The URL of your page will
        be: <br />
        {{ appUri }}/organisations/{{ form.organisation.slug }}
      </gov-hint>
    </ck-text-input>

    <ck-wysiwyg-input
      v-model="form.organisation.description"
      id="description"
      :maxlength="3000"
      label="Please provide a one-line summary of organisation"
      hint="This should be a short line or two that summarises who the organisation is and will appear below the Organisation name on it's page."
      :error="errors.get('organisation.description')"
    />

    <ck-text-input
      v-model="form.organisation.url"
      id="url"
      label="Organisation website address"
      hint="This must start with 'http://'' or 'https://''."
      type="url"
      :error="errors.get('organisation.url')"
    />

    <ck-text-input
      v-model="form.organisation.phone"
      id="phone"
      label="Public phone"
      type="tel"
      :error="errors.get('organisation.phone')"
    />

    <ck-text-input
      v-model="form.organisation.email"
      id="email"
      label="Public email address"
      type="email"
      :error="errors.get('organisation.email')"
    />

    <gov-button start :disabled="fieldsEmpty" @click="$emit('completed')">
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
  computed: {
    fieldsEmpty() {
      return Object.entries(this.form.organisation).some(([field, value]) => {
        return !["id", "slug", "phone", "email"].includes(field) && value == "";
      });
    }
  }
};
</script>
