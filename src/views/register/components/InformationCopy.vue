<template>
  <div>
    <gov-heading size="l"> Important information </gov-heading>
    <gov-body>
      Once your organisation is listed on {{ appName }}, it is really important
      that you keep your organisation and service information up-to-date. For
      example:
    </gov-body>
    <gov-list :bullet="true">
      <li>opening times</li>
      <li>contact details</li>
      <li>location</li>
      <li>access information</li>
      <li>images and videos</li>
    </gov-list>
    <gov-body
      >Keeping these details up-to-date will help make the platform as relevant
      as possible to local residents.</gov-body
    >
    <gov-body
      >We'll help by emailing you every so often to remind you to check in on
      your listings.</gov-body
    >
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
