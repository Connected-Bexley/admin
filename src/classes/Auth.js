import axios from "axios";

class Auth {
  /**
   * Constructor.
   */
  constructor() {
    this.appApiUri = process.env.VUE_APP_API_URI;
    this.appUri = process.env.VUE_APP_URI;
    this.appApiClientId = process.env.VUE_APP_API_CLIENT_ID;
    this.http = axios.create({
      baseURL: this.appApiUri
    });
  }

  get authorizeUrl() {
    return `${this.appApiUri}/oauth/authorize?client_id=${
      this.appApiClientId
    }&redirect_uri=${encodeURI(this.appUri + "/login")}&response_type=token`;
  }

  /**
   * Parses the URL and returns query string parameters as an object.
   *
   * @param {String} url
   * @returns {Object}
   */
  parseQueryString(url) {
    let query = url.substring(url.indexOf("#") + 1);

    let e,
      a = /\+/g, // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function(s) {
        return decodeURIComponent(s.replace(a, " "));
      },
      q = query,
      urlParams = {};

    /* jshint ignore:start */
    while ((e = r.exec(q))) {
      urlParams[d(e[1])] = d(e[2]);
    }
    /* jshint ignore:end */

    return urlParams;
  }

  /**
   * Redirects the user the authorization URL.
   */
  redirect() {
    window.location.href = this.authorizeUrl;
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise}
   */
  async login(accessToken, expiresIn) {
    // OAuth tokens.
    localStorage.setItem(
      "oauth",
      JSON.stringify({
        expires_at: expiresIn * 1000 + new Date().setHours(24, 0, 0, 0),
        access_token: accessToken
      })
    );

    // User details.
    await this.fetchUser();

    // Last active.
    this.invokeActivity();
  }

  async fetchUser() {
    const { data } = await this.http.get("/core/v1/users/user", {
      params: { include: "user-roles" },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    /**
     * Populate the user.roles array by filling in missing organisation IDs for service roles
     */
    let serviceIds = [];
    data.data.roles.forEach(role => {
      if (role.hasOwnProperty("service_id")) {
        serviceIds.push(role.service_id);
      }
    });
    let services = await this.http.post(
      "/core/v1/services/index",
      { "filter[id]": serviceIds.join(",") },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    );
    data.data.roles.forEach(role => {
      if (role.hasOwnProperty("service_id")) {
        const service = services.data.data.find(
          service => service.id === role.service_id
        );
        role.organisation_id = service ? service.organisation_id : null;
      }
    });

    localStorage.setItem("user", JSON.stringify(data.data));
  }

  /**
   * @return {boolean}
   */
  logout() {
    localStorage.removeItem("oauth");
    localStorage.removeItem("user");
    localStorage.removeItem("last_active");

    return true;
  }

  /**
   * Clears the user's sessions on the API.
   */
  async clearSessions() {
    await this.http.delete("/core/v1/users/user/sessions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`
      }
    });
  }

  /**
   * Touches the last_active timestamp.
   */
  invokeActivity() {
    localStorage.setItem("last_active", Date.now());
  }

  /**
   * Determines if the user session is inactive.
   * @param {number} time
   * @returns {boolean}
   */
  inactive(minutes = this.appSessionTimeout) {
    const milliseconds = minutes * 60 * 1000;

    if (this.lastActive === null) {
      return true;
    }

    return Date.now() - this.lastActive > milliseconds;
  }

  /**
   * @returns {boolean}
   */
  get hasExpired() {
    return Date.now() > this.expiresAt;
  }

  /**
   * @returns {object|null}
   */
  get oauth() {
    return JSON.parse(localStorage.getItem("oauth"));
  }

  /**
   * @returns {object|null}
   */
  get user() {
    return JSON.parse(localStorage.getItem("user"));
  }

  /**
   * @returns {object|null}
   */
  get lastActive() {
    return JSON.parse(localStorage.getItem("last_active"));
  }

  /**
   * @returns {number}
   */
  get expiresAt() {
    return this.oauth !== null ? this.oauth.expires_at : null;
  }

  /**
   * @returns {string|null}
   */
  get accessToken() {
    return this.oauth ? this.oauth.access_token : null;
  }

  /**
   * @returns {boolean}
   */
  get isLoggedIn() {
    return (
      this.accessToken !== null && this.expiresAt !== null && !this.hasExpired
    );
  }

  /**
   * @returns {array}
   */
  get roles() {
    return [
      { text: "Super admin", value: "Super Admin" },
      { text: "Global admin", value: "Global Admin" },
      { text: "Content admin", value: "Content Admin" },
      { text: "Organisation admin", value: "Organisation Admin" },
      { text: "Service admin", value: "Service Admin" },
      { text: "Service worker", value: "Service Worker" }
    ];
  }

  /**
   * @param {string} roleName
   * @param {object} service
   * @param {object} organisation
   * @returns {boolean}
   */
  hasRole(roleName, serviceId = null, organisationId = null) {
    if (this.user === null) {
      return false;
    }

    return (
      this.user.roles.find(role => {
        if (role.role !== roleName) {
          return false;
        }

        if (serviceId !== null && role.service_id !== serviceId) {
          return false;
        }

        if (
          organisationId !== null &&
          role.organisation_id !== organisationId
        ) {
          return false;
        }

        return true;
      }) !== undefined
    );
  }

  /**
   * @returns {boolean}
   */
  get isSuperAdmin() {
    return this.hasRole("Super Admin");
  }

  /**
   * @returns {boolean}
   */
  get isGlobalAdmin() {
    return this.hasRole("Global Admin");
  }

  /**
   * @returns {boolean}
   */
  get isOnlyGlobalAdmin() {
    return this.hasRole("Global Admin") && !this.isSuperAdmin;
  }

  /**
   * @returns {boolean}
   */
  get isContentAdmin() {
    return this.hasRole("Content Admin");
  }

  /**
   * @returns {boolean}
   */
  get isOnlyContentAdmin() {
    return this.hasRole("Content Admin") && this.user.roles.length === 1;
  }

  /**
   * @returns {boolean}
   */
  isOrganisationAdmin(organisationId = null) {
    return this.hasRole("Organisation Admin", null, organisationId);
  }

  /**
   * @returns {boolean}
   */
  isServiceAdmin(serviceId = null) {
    return this.hasRole("Service Admin", serviceId);
  }

  /**
   * @returns {boolean}
   */
  isServiceWorker(serviceId = null) {
    return this.hasRole("Service Worker", serviceId);
  }

  /**
   * @returns {boolean}
   */
  get isOnlyServiceWorker() {
    return this.hasRole("Service Worker") && this.user.roles.length === 1;
  }

  /**
   * Can the user view a content type
   * @param {string} type
   * @returns {boolean}
   */
  canView(type) {
    if (this.isSuperAdmin) {
      return true;
    }
    if (type === "events") {
      return this.isOrganisationAdmin();
    }
    if (type === "services") {
      return !this.isOnlyContentAdmin;
    }
    if (type === "organisations") {
      return !this.isOnlyContentAdmin && !this.isOnlyServiceWorker;
    }
    if (type === "locations") {
      return !this.isOnlyContentAdmin;
    }
    if (type === "referrals") {
      return !this.isOnlyContentAdmin && !this.isOnlyGlobalAdmin;
    }
    if (type === "pages") {
      return this.isContentAdmin;
    }
    if (type === "users") {
      return (
        !this.isOnlyContentAdmin &&
        !this.isOnlyGlobalAdmin &&
        !this.isOnlyServiceWorker
      );
    }
  }

  /**
   * Can the user add a content type
   * @param {string} type
   * @returns {boolean}
   */
  canAdd(type) {
    if (this.isSuperAdmin) {
      return true;
    }
    if (type === "event") {
      return this.isOrganisationAdmin();
    }
    if (type === "service") {
      return this.isOrganisationAdmin();
    }
    if (type === "organisation") {
      return this.isGlobalAdmin;
    }
    if (type === "location") {
      return this.isServiceAdmin();
    }
    if (type === "page") {
      return this.isContentAdmin;
    }
    if (type === "user") {
      return (
        !this.isOnlyContentAdmin &&
        !this.isOnlyGlobalAdmin &&
        !this.isOnlyServiceWorker
      );
    }
    return false;
  }

  /**
   * Can the user update a content type
   * @param {string} type
   * @returns {boolean}
   */
  canEdit(type, modelId = null) {
    if (this.isSuperAdmin) {
      return true;
    }
    if (type === "event") {
      return this.isOrganisationAdmin(modelId);
    }
    if (type === "service") {
      return this.isServiceAdmin(modelId);
    }
    if (type === "organisation") {
      return this.isOrganisationAdmin(modelId);
    }
    if (type === "location") {
      return this.isServiceAdmin(modelId);
    }
    if (type === "page") {
      return this.isContentAdmin;
    }
    if (type === "referral") {
      return this.isServiceWorker(modelId) && !this.isOnlyGlobalAdmin;
    }
    if (type === "user") {
      return (
        !this.isOnlyContentAdmin &&
        !this.isOnlyGlobalAdmin &&
        !this.isOnlyServiceWorker
      );
    }
    return false;
  }

  /**
   * Can the user bulk import a content type
   * @param {string} type
   * @returns {boolean}
   */
  canImport() {
    if (this.isSuperAdmin) {
      return true;
    }
    return false;
  }

  /**
   * Can the user delete a content type
   * @param {string} type
   * @returns {boolean}
   */
  canDelete(type) {
    if (this.isSuperAdmin) {
      return true;
    }
    if (type === "page") {
      return this.isSuperAdmin;
    }
    if (type === "user") {
      return (
        !this.isOnlyContentAdmin &&
        !this.isOnlyGlobalAdmin &&
        !this.isOnlyServiceWorker
      );
    }
    return false;
  }

  /**
   *
   * @param {array} roles
   * @returns {string}
   */
  displayHighestRole(userRoles) {
    const roleNames = this.roles.map(role => role.value);

    const highestRole = roleNames.find(
      roleName => userRoles.find(role => role.role === roleName) !== undefined
    );

    return highestRole || "None";
  }
}

export default new Auth();
