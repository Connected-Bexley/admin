<template>
  <div>
    <gov-heading size="l"> Registration - step 3 of 5 </gov-heading>

    <gov-back-link :to="{ name: 'register-new-step2' }"> Back </gov-back-link>

    <information-copy />

    <gov-button start :to="{ name: 'register-new-step4' }"> Next </gov-button>
  </div>
</template>

<script>
import InformationCopy from "../components/InformationCopy";
export default {
  components: {
    InformationCopy
  }
};
</script>

<style lang="scss" scoped></style>
