<template>
  <ck-text-input
    :value="value"
    :id="id"
    :label="label"
    :type="type"
    hint="The password must be at least eight characters long, contain one uppercase letter, one lowercase letter, one number and one special character (!#$%&()*+,-./:;<=>?@[]^_`{|}~)"
    :error="error"
    @input="$emit('input', $event)"
  >
    <template v-slot:after-input>
      <GovButton type="button" @click="toggleShowPassword">{{
        toggleShowPasswordText
      }}</GovButton>
    </template>
  </ck-text-input>
</template>

<script>
export default {
  name: "CkPassword",
  props: {
    value: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: "password"
    },
    label: {
      type: String,
      default: "Password"
    },
    error: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      type: "password"
    };
  },
  computed: {
    toggleShowPasswordText() {
      return this.type === "password" ? "Show Password" : "Hide Password";
    }
  },
  methods: {
    toggleShowPassword() {
      this.type = this.type === "password" ? "text" : "password";
    }
  }
};
</script>

<style lang="scss" scoped></style>
