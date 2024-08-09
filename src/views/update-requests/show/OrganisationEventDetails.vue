<template>
  <ck-loader v-if="loading" />
  <div v-else>
    <gov-body v-if="original">
      For event
      <gov-link
        :to="{ name: 'events-show', params: { event: original.id } }"
        v-text="original.title"
      />.
    </gov-body>
    <gov-body v-else> For a new event. </gov-body>

    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header scope="column"></gov-table-header>
          <gov-table-header scope="column" v-if="original"
            >From</gov-table-header
          >
          <gov-table-header scope="column">{{
            original ? "To" : "New"
          }}</gov-table-header>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('organisation_id')">
          <gov-table-header top scope="row">Organisation</gov-table-header>
          <gov-table-cell v-if="original">
            <gov-link
              v-if="original.hasOwnProperty('organisation_id')"
              :to="{
                name: 'organisations-show',
                params: { organisation: original.organisation_id }
              }"
            >
              {{ original.organisation.name }}
            </gov-link>
          </gov-table-cell>
          <gov-table-cell>
            <gov-link
              :to="{
                name: 'organisations-show',
                params: { organisation: event.organisation_id }
              }"
            >
              {{ event.organisation.name || "" }}
            </gov-link>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('start_date')">
          <gov-table-header top scope="row">Start date</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.start_date | asDate
          }}</gov-table-cell>
          <gov-table-cell>{{ event.start_date | asDate }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('end_date')">
          <gov-table-header top scope="row">End date</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.end_date | asDate
          }}</gov-table-cell>
          <gov-table-cell>{{ event.end_date | asDate }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('start_time')">
          <gov-table-header top scope="row">Start time</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.start_time | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.start_time }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('end_time')">
          <gov-table-header top scope="row">End time</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.end_time | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.end_time }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('title')">
          <gov-table-header top scope="row">Title</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.title | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.title }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('intro')">
          <gov-table-header top scope="row">Intro</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.intro | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.intro }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('description')">
          <gov-table-header top scope="row">Description</gov-table-header>
          <gov-table-cell
            v-if="original"
            v-html="toHtml(original.description)"
          />
          <gov-table-cell v-html="toHtml(event.description)" />
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('is_free')">
          <gov-table-header top scope="row">Is free</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.is_free | yesNo
          }}</gov-table-cell>
          <gov-table-cell>{{ event.is_free | yesNo }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('fees_url')">
          <gov-table-header top scope="row">Fees URL</gov-table-header>
          <gov-table-cell break v-if="original">{{
            original.fees_url | originalExists
          }}</gov-table-cell>
          <gov-table-cell break>{{ event.fees_url }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('fees_text')">
          <gov-table-header top scope="row">Fees text</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.fees_text | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.fees_text }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('organiser_name')">
          <gov-table-header top scope="row">Organiser name</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.organiser_name | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.organiser_name }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('organiser_email')">
          <gov-table-header top scope="row">Organiser email</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.organiser_email
          }}</gov-table-cell>
          <gov-table-cell>{{ event.organiser_email }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('organiser_phone')">
          <gov-table-header top scope="row">Organiser phone</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.organiser_phone | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.organiser_phone }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('organiser_url')">
          <gov-table-header top scope="row">Organiser url</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.organiser_url | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.organiser_url }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('booking_title')">
          <gov-table-header top scope="row">Booking title</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.booking_title | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.booking_title }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('booking_summary')">
          <gov-table-header top scope="row">Booking summary</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.booking_summary | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.booking_summary }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('booking_url')">
          <gov-table-header top scope="row">Booking url</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.booking_url | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.booking_url }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('booking_cta')">
          <gov-table-header top scope="row"
            >Booking call to action</gov-table-header
          >
          <gov-table-cell v-if="original">{{
            original.booking_cta | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ event.booking_cta }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('homepage')">
          <gov-table-header top scope="row">Homepage</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.homepage | yesNo
          }}</gov-table-cell>
          <gov-table-cell>{{ event.homepage | yesNo }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('is_virtual')">
          <gov-table-header top scope="row">Is virtual</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.is_virtual | yesNo
          }}</gov-table-cell>
          <gov-table-cell>{{ event.is_virtual | yesNo }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('category_taxonomies')">
          <gov-table-header top scope="row"
            >Category taxonomies</gov-table-header
          >
          <gov-table-cell v-if="original">
            <gov-list
              bullet
              v-if="
                original.hasOwnProperty('category_taxonomies') &&
                  Array.isArray(original.category_taxonomies)
              "
            >
              <li
                v-for="(taxonomy, index) in original.category_taxonomies"
                :key="`category_taxonomies.${index}`"
              >
                {{ taxonomyName(findTaxonomy(taxonomy.id)) }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
          <gov-table-cell>
            <gov-list bullet v-if="Array.isArray(event.category_taxonomies)">
              <li
                v-for="(taxonomy, index) in event.category_taxonomies"
                :key="`category_taxonomies.${index}`"
              >
                {{ taxonomyName(findTaxonomy(taxonomy)) }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('location_id')">
          <gov-table-header top scope="row">Location</gov-table-header>
          <gov-table-cell>
            <location-details
              v-if="originalLocation"
              :location="originalLocation"
            />
          </gov-table-cell>
          <gov-table-cell>
            <location-details v-if="eventLocation" :location="eventLocation" />
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="event.hasOwnProperty('image_file_id')">
          <gov-table-header top scope="row">Image</gov-table-header>
          <gov-table-cell v-if="original">
            <ck-image v-if="original.image" :file-id="original.image.id" />
          </gov-table-cell>
          <gov-table-cell>
            <ck-image
              v-if="event.image_file_id"
              :file-id="event.image_file_id"
            />
            <img
              v-else
              :src="
                apiUrl(
                  `/organisation-events/new/image.png?update_request_id=${updateRequestId}`
                )
              "
              alt="Event image"
              class="ck-logo"
            />
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
import http from "@/http";
import CkCarousel from "@/components/Ck/CkCarousel";
import CkImage from "@/components/Ck/CkImage";
import CkTaxonomyTree from "@/components/Ck/CkTaxonomyTree";
import LocationDetails from "@/views/locations/show/LocationDetails";

export default {
  name: "OrganisationEventDetails",

  props: {
    updateRequestId: {
      required: true,
      type: String
    },

    requestedAt: {
      required: true,
      type: String
    },

    event: {
      required: true,
      type: Object
    }
  },

  components: { CkCarousel, CkImage, CkTaxonomyTree, LocationDetails },

  data() {
    return {
      loading: false,
      original: null,
      taxonomies: [],
      flattenedTaxonomies: [],
      eligibilityTypes: [],
      flattenedEligibilityTypes: [],
      originalLocation: null,
      eventLocation: null
    };
  },

  methods: {
    taxonomyName(taxonomy) {
      let name = taxonomy.name;

      if (taxonomy.parent_id !== null) {
        const parent = this.flattenedTaxonomies.find(flattenedTaxonomy => {
          return flattenedTaxonomy.id === taxonomy.parent_id;
        });
        name = `${this.taxonomyName(parent)} / ${name}`;
      }

      return name;
    },

    async fetchAll() {
      this.loading = true;

      await this.fetchOriginal();

      await this.fetchTaxonomies();

      await this.fetchOriginalLocation();

      await this.fetchEventLocation();

      this.loading = false;
    },

    async fetchOriginal() {
      // If this is an update request for a NEW event, then there's no original to check for.
      if (this.event.id !== null) {
        this.loading = true;
        const {
          data: { data: original }
        } = await http.get(`/organisation-events/${this.event.id}`, {
          params: { include: "organisation" }
        });
        this.original = original;
        this.loading = false;
      } else {
        this.original = null;
      }
    },

    async fetchTaxonomies() {
      const {
        data: { data: taxonomies }
      } = await http.get("/taxonomies/categories");
      this.taxonomies = taxonomies;
      this.flattenedTaxonomies = this.getFlattenedTaxonomies(taxonomies);
    },

    async fetchLocation(locationId) {
      const { data } = await http.get(`/locations/${locationId}`);
      return data.data;
    },

    async fetchOriginalLocation() {
      if (this.original && this.original.location_id) {
        this.originalLocation = await this.fetchLocation(
          this.original.location_id
        );
      }
    },

    async fetchEventLocation() {
      if (this.event.location_id) {
        this.eventLocation = await this.fetchLocation(this.event.location_id);
      }
    },

    getFlattenedTaxonomies(taxonomies = null, flattenedTaxonomies = []) {
      taxonomies.forEach(taxonomy => {
        flattenedTaxonomies.push(taxonomy);

        if (taxonomy.children.length > 0) {
          this.getFlattenedTaxonomies(taxonomy.children, flattenedTaxonomies);
        }
      });
      return flattenedTaxonomies;
    },

    findTaxonomy(id) {
      return this.flattenedTaxonomies.find(taxonomy => taxonomy.id === id);
    },

    getTaxonomyAndAncestorsIds(taxonomy, flatTaxonomyTree) {
      let ids = [taxonomy.id];
      if (taxonomy.parent_id) {
        const parent = flatTaxonomyTree.find(
          tax => tax.id === taxonomy.parent_id
        );
        if (parent) {
          ids = ids.concat(
            this.getTaxonomyAndAncestorsIds(parent, flatTaxonomyTree)
          );
        }
      }
      return ids;
    }
  },

  filters: {
    yesNo(value) {
      return value ? "Yes" : "No";
    },

    originalExists(field) {
      return field || "";
    },

    asDate(dateValue) {
      return new Date(dateValue).toDateString();
    }
  },

  async created() {
    await this.fetchAll();
  }
};
</script>
