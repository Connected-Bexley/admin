<template>
  <div id="app">
    <vue-headful
      :title="appName"
      :head="headAttributes"
      :html="htmlAttributes"
    />

    <gov-skip-link href="#main-content">Skip to main content</gov-skip-link>

    <gov-header :service-name="appName" :navigation="headerNav" />

    <div class="govuk-width-container">
      <main
        class="govuk-main-wrapper"
        :class="mainClasses"
        id="main-content"
        role="main"
      >
        <router-view />
      </main>
    </div>

    <gov-footer />
  </div>
</template>

<script>
import _ from "lodash";
import Auth from "@/classes/Auth";

export default {
  name: "App",
  data() {
    return {
      themeColor: "#0b0c0c",
      bodyClasses: ["js-enabled"],
      mainClasses: [],
      headerNav: [],
      logoutInterval: null
    };
  },
  computed: {
    headAttributes() {
      return {
        "meta[name=theme-color]": {
          content: this.themeColor
        },
        "meta[name=robots]": { content: "noindex" }
      };
    },
    htmlAttributes() {
      return {
        body: {
          class: [document.body.className, ...this.bodyClasses].join(" ")
        }
      };
    },
    loggedInItems() {
      return [
        {
          text: "Services",
          to: { name: "services-index" },
          hide: !Auth.canView("services")
        },
        {
          text: "Locations",
          to: { name: "locations-index" },
          hide: !Auth.canView("locations")
        },
        {
          text: "Referrals",
          to: { name: "referrals-index" },
          hide: !Auth.canView("referrals")
        },
        {
          text: "Organisations",
          to: { name: "organisations-index" },
          hide: !Auth.canView("organisations")
        },
        {
          text: "Events",
          to: { name: "events-index" },
          hide: !Auth.canView("events")
        },
        {
          text: "Pages",
          to: { name: "pages-index" },
          hide: !Auth.canView("pages")
        },
        {
          text: "Users",
          to: { name: "users-index" },
          hide: !Auth.canView("users")
        },
        {
          text: "Reports",
          to: { name: "reports-index" },
          hide: !Auth.canView("reports")
        },
        {
          text: "Admin",
          to: { name: "admin-index" },
          hide: !Auth.canView("admin")
        },
        {
          text: "Update requests",
          to: { name: "update-requests-index" },
          hide: !Auth.canView("update requests")
        },
        {
          text: "Help",
          to: { name: "help-index" },
          hide: !this.appHelpSectionActive
        }
      ];
    },
    loggedOutItems() {
      return [
        { text: "Register", to: { name: "register-index" } },
        { text: "Login", href: Auth.authorizeUrl }
      ];
    }
  },
  methods: {
    setHeaderItems() {
      this.headerNav = Auth.isLoggedIn
        ? this.loggedInItems
        : this.loggedOutItems;
    },
    bindActivityTracking() {
      document.addEventListener("mousemove", this.trackActivity);
      document.addEventListener("touchmove", this.trackActivity);
      document.addEventListener("keypress", this.trackActivity);
      document.addEventListener("scroll", this.trackActivity);
    },
    trackActivity: _.throttle(() => {
      if (Auth.isLoggedIn && !Auth.inactive()) {
        Auth.invokeActivity();
      }
    }, 1000),
    startAutoLogoutInterval() {
      this.logoutInterval = setInterval(() => {
        if (Auth.isLoggedIn && Auth.inactive()) {
          this.$router.push({ name: "logout" });
        }
      }, 1000);
    },
    endAutoLogoutInterval() {
      clearInterval(this.logoutInterval);
      this.logoutInterval = null;
    }
  },

  created() {
    this.setHeaderItems();
    this.bindActivityTracking();
    this.$root.$on("login", this.setHeaderItems);
    this.$root.$on("logout", this.setHeaderItems);
  },

  mounted() {
    this.startAutoLogoutInterval();
  },

  destroyed() {
    this.endAutoLogoutInterval();
  }
};
</script>
