import Vue from "vue";
import Router from "vue-router";
import auth from "@/classes/Auth";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/pages/Dashboard"),
      meta: { auth: true }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/pages/auth/Login"),
      meta: { guest: true }
    },
    {
      path: "/login/code",
      name: "login-code",
      component: () => import("@/views/pages/auth/Code"),
      meta: { guest: true }
    },
    {
      path: "/forgotten-password",
      name: "forgotten-password",
      component: () => import("@/views/pages/auth/ForgottenPassword"),
      meta: { guest: true }
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("@/views/pages/auth/NewPassword"),
      meta: { guest: true }
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/views/pages/auth/Logout"),
      meta: { auth: true }
    },
    {
      path: "/organisations",
      name: "organisations-index",
      component: () => import("@/views/pages/organisations/Index"),
      meta: { auth: true }
    },
    {
      path: "/organisations/create",
      name: "organisations-create",
      component: () => import("@/views/pages/organisations/Create"),
      meta: { auth: true }
    },
    {
      path: "/organisations/:organisation",
      name: "organisations-show",
      component: () => import("@/views/pages/organisations/Show"),
      meta: { auth: true }
    },
    {
      path: "/referrals",
      name: "referrals-index",
      component: () => import("@/views/pages/referrals/Index"),
      meta: { auth: true }
    },
    {
      path: "/referrals/:referral/confirmation",
      name: "referrals-confirmation",
      component: () => import("@/views/pages/referrals/Confirmation"),
      meta: { auth: true }
    },
    {
      path: "/referrals/:referral",
      name: "referrals-show",
      component: () => import("@/views/pages/referrals/Show"),
      meta: { auth: true }
    },
    {
      path: "/locations",
      name: "locations-index",
      component: () => import("@/views/pages/locations/Index"),
      meta: { auth: true }
    },
    {
      path: "/locations/create",
      name: "locations-create",
      component: () => import("@/views/pages/locations/Create"),
      meta: { auth: true }
    },
    {
      path: "/locations/:location",
      name: "locations-show",
      component: () => import("@/views/pages/locations/Show"),
      meta: { auth: true }
    },
    {
      path: "/users",
      name: "users-index",
      component: () => import("@/views/pages/users/Index"),
      meta: { auth: true }
    },
    {
      path: "/user/:user",
      name: "users-show",
      component: () => import("@/views/pages/users/Show"),
      meta: { auth: true }
    }
  ]
});

// Middleware.
router.beforeEach((to, from, next) => {
  // If user needs to be authed.
  if (to.matched.some(route => route.meta.auth)) {
    if (!auth.isLoggedIn) {
      auth
        .refreshAccessToken()
        .then(() => next())
        .catch(() => next({ name: "login" }));
      return;
    }
  }

  // If user needs to be a guest.
  if (to.matched.some(route => route.meta.guest)) {
    if (auth.isLoggedIn) {
      next({ name: "dashboard" });
      return;
    }
  }

  next();
});

export default router;
