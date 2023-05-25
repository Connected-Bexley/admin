<template>
  <div>
    <gov-heading size="l"> Registration complete </gov-heading>

    <gov-body> Thank you for registering on {{ appName }}. </gov-body>

    <gov-body>
      Your details will be verified by our team within the next 5 working days.
    </gov-body>

    <gov-body>Once your account approved, you will be able:</gov-body>

    <gov-list :bullet="true">
      <li>to access and edit your organisation page</li>
      <li>create new service pages</li>
      <li>edit existing service pages</li>
    </gov-list>

    <gov-body>
      If you haven't heard back from us within 5 working days please email the
      team at
      <gov-link :href="`mailto:${contactEmail}`">{{ contactEmail }}</gov-link>
    </gov-body>

    <gov-button :to="{ name: 'dashboard' }" start>Home</gov-button>
  </div>
</template>
