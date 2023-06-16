<template>
  <div>
    <gov-heading size="l"> Registration - step 2 of 3 </gov-heading>

    <gov-back-link :to="{ name: 'register' }"> Back </gov-back-link>
    <information-copy />
    <gov-button start :to="{ name: 'register-existing-step3' }">
      Next
    </gov-button>
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
