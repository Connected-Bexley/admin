<template>
  <ck-loader v-if="loading" />
  <div v-else>
    <gov-body v-if="original">
      For service
      <gov-link
        :to="{ name: 'services-show', params: { service: original.id } }"
        v-text="original.name"
      />.
    </gov-body>
    <gov-body v-else> For a new service. </gov-body>

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

        <gov-table-row v-if="service.hasOwnProperty('type')">
          <gov-table-header top scope="row">Type</gov-table-header>
          <gov-table-cell break v-if="original">{{
            original.type | originalExists | ucfirst
          }}</gov-table-cell>
          <gov-table-cell break>{{ service.type | ucfirst }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('url')">
          <gov-table-header top scope="row">URL</gov-table-header>
          <gov-table-cell break v-if="original">{{
            original.url | originalExists
          }}</gov-table-cell>
          <gov-table-cell break>{{ service.url }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('name')">
          <gov-table-header top scope="row">Name</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.name | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.name }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('slug')">
          <gov-table-header top scope="row">Slug</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.slug | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.slug }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('organisation_id')">
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
                params: { organisation: service.organisation_id }
              }"
            >
              {{ service.organisation.name || "" }}
            </gov-link>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('intro')">
          <gov-table-header top scope="row">Intro</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.intro | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.intro }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('status')">
          <gov-table-header top scope="row">Status</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.status | status
          }}</gov-table-cell>
          <gov-table-cell>{{ service.status | status }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('score')">
          <gov-table-header top scope="row">Quality Score</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.score | score
          }}</gov-table-cell>
          <gov-table-cell>{{ service.score | score }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('ends_at')">
          <gov-table-header top scope="row">End date</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.ends_at | endsAt
          }}</gov-table-cell>
          <gov-table-cell>{{ service.ends_at | endsAt }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('is_free')">
          <gov-table-header top scope="row">Is free</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.is_free | isFree
          }}</gov-table-cell>
          <gov-table-cell>{{ service.is_free | isFree }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('eligibility_types')">
          <gov-table-header top scope="row">Eligibility</gov-table-header>
          <gov-table-cell v-if="original">
            <div
              v-for="rootTaxonomy in eligibilityTypes"
              :key="rootTaxonomy.id"
              v-if="
                eligibilityTaxonomyChanged(rootTaxonomy) ||
                  eligibilityCustomChanged(rootTaxonomy)
              "
            >
              <span class="govuk-!-font-weight-bold">{{
                rootTaxonomy.name
              }}</span>
              <ck-taxonomy-tree
                v-if="Array.isArray(service.eligibility_types.taxonomies)"
                :taxonomies="rootTaxonomy.children"
                :checked="original ? original.eligibility_types.taxonomies : []"
                :error="false"
                :filteredTaxonomyIds="updatedServiceEligibilities()"
                :disabled="true"
              />
              <gov-body v-if="eligibilityCustomChanged(rootTaxonomy)"
                >Custom Value:
                {{
                  original.eligibility_types.custom[slugify(rootTaxonomy.name)]
                }}</gov-body
              >
            </div>
          </gov-table-cell>
          <gov-table-cell>
            <div
              v-for="rootTaxonomy in eligibilityTypes"
              :key="rootTaxonomy.id"
              v-if="
                eligibilityTaxonomyChanged(rootTaxonomy) ||
                  eligibilityCustomChanged(rootTaxonomy)
              "
            >
              <span class="govuk-!-font-weight-bold">{{
                rootTaxonomy.name
              }}</span>
              <ck-taxonomy-tree
                v-if="Array.isArray(service.eligibility_types.taxonomies)"
                :taxonomies="rootTaxonomy.children"
                :checked="service.eligibility_types.taxonomies"
                :error="false"
                :filteredTaxonomyIds="updatedServiceEligibilities()"
                :disabled="true"
              />
              <gov-body v-if="eligibilityCustomChanged(rootTaxonomy)"
                >Custom Value:
                {{
                  service.eligibility_types.custom[slugify(rootTaxonomy.name)]
                }}</gov-body
              >
            </div>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('fees_url')">
          <gov-table-header top scope="row">Fees URL</gov-table-header>
          <gov-table-cell break v-if="original">{{
            original.fees_url | originalExists
          }}</gov-table-cell>
          <gov-table-cell break>{{ service.fees_url }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('fees_text')">
          <gov-table-header top scope="row">Fees text</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.fees_text | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.fees_text }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('wait_time')">
          <gov-table-header top scope="row">Wait time</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.wait_time | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.wait_time }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('description')">
          <gov-table-header top scope="row">Description</gov-table-header>
          <gov-table-cell
            v-if="original"
            v-html="toHtml(original.description)"
          />
          <gov-table-cell v-html="toHtml(service.description)" />
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('testimonial')">
          <gov-table-header top scope="row">Testimonial</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.testimonial | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.testimonial }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('video_embed')">
          <gov-table-header top scope="row">Video embed</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.video_embed | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.video_embed }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('contact_name')">
          <gov-table-header top scope="row">Contact name</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.contact_name | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.contact_name }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('referral_url')">
          <gov-table-header top scope="row">Referral URL</gov-table-header>
          <gov-table-cell break v-if="original">{{
            original.referral_url | originalExists
          }}</gov-table-cell>
          <gov-table-cell break>{{ service.referral_url }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('useful_infos')">
          <gov-table-header top scope="row">Useful infos</gov-table-header>
          <gov-table-cell v-if="original">
            <gov-list
              v-if="
                original.hasOwnProperty('useful_infos') &&
                  Array.isArray(original.useful_infos)
              "
            >
              <li
                v-for="(usefulInfo, index) in original.useful_infos"
                :key="`useful_info.${index}`"
              >
                <gov-heading>{{ usefulInfo.title }}</gov-heading>
                <div v-html="toHtml(usefulInfo.description)" />
                <gov-section-break
                  v-if="index < original.useful_infos.length - 1"
                  visible
                  size="l"
                />
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
          <gov-table-cell>
            <gov-list v-if="Array.isArray(service.useful_infos)">
              <li
                v-for="(usefulInfo, index) in service.useful_infos"
                :key="`useful_info.${index}`"
              >
                <gov-heading>{{ usefulInfo.title }}</gov-heading>
                <div v-html="toHtml(usefulInfo.description)" />
                <gov-section-break
                  v-if="index < service.useful_infos.length - 1"
                  visible
                  size="l"
                />
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('offerings')">
          <gov-table-header top scope="row">Offerings</gov-table-header>
          <gov-table-cell v-if="original">
            <gov-list
              v-if="
                original.hasOwnProperty('offerings') &&
                  Array.isArray(original.offerings)
              "
              bullet
            >
              <li
                v-for="{ offering, order } in original.offerings"
                :key="`ServiceOffering::Original::${order}`"
              >
                {{ offering }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
          <gov-table-cell>
            <gov-list v-if="Array.isArray(service.offerings)" bullet>
              <li
                v-for="{ offering, order } in service.offerings"
                :key="`ServiceOffering::New::${order}`"
              >
                {{ offering }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('contact_email')">
          <gov-table-header top scope="row">Contact email</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.contact_email
          }}</gov-table-cell>
          <gov-table-cell>{{ service.contact_email }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('contact_phone')">
          <gov-table-header top scope="row">Contact phone</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.contact_phone | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.contact_phone }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('cqc_location_id')">
          <gov-table-header top scope="row">CQC Location ID</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.cqc_location_id | originalExists
          }}</gov-table-cell>
          <gov-table-cell>{{ service.cqc_location_id }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('social_medias')">
          <gov-table-header top scope="row">Social medias</gov-table-header>
          <gov-table-cell break v-if="original">
            <gov-list
              v-if="
                original.hasOwnProperty('social_medias') &&
                  Array.isArray(original.social_medias)
              "
            >
              <li
                v-for="(socialMedia, index) in original.social_medias"
                :key="`social_media.${index}`"
              >
                <span class="govuk-!-font-weight-bold"
                  >{{ socialMedia.type | socialMediaType }}:</span
                >
                {{ socialMedia.url }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
          <gov-table-cell break>
            <gov-list v-if="Array.isArray(service.social_medias)">
              <li
                v-for="(socialMedia, index) in service.social_medias"
                :key="`social_media.${index}`"
              >
                <span class="govuk-!-font-weight-bold"
                  >{{ socialMedia.type | socialMediaType }}:</span
                >
                {{ socialMedia.url }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('referral_email')">
          <gov-table-header top scope="row">Referral email</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.referral_email
          }}</gov-table-cell>
          <gov-table-cell>{{ service.referral_email }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('referral_method')">
          <gov-table-header top scope="row">Referral method</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.referral_method | originalExists | referralMethod
          }}</gov-table-cell>
          <gov-table-cell>{{
            service.referral_method | referralMethod
          }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('tags')">
          <gov-table-header top scope="row">Tags</gov-table-header>
          <gov-table-cell v-if="original">
            <gov-list
              v-if="
                original.hasOwnProperty('tags') && Array.isArray(original.tags)
              "
              bullet
            >
              <li
                v-for="(tag, index) in original.tags"
                :key="`ServiceTag::Original::${index}`"
              >
                {{ tag.label }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
          <gov-table-cell>
            <gov-list v-if="Array.isArray(service.tags)" bullet>
              <li
                v-for="(tag, index) in service.tags"
                :key="`ServiceTag::New::${index}`"
              >
                {{ tag.label }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('category_taxonomies')">
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
            <gov-list bullet v-if="Array.isArray(service.category_taxonomies)">
              <li
                v-for="(taxonomy, index) in service.category_taxonomies"
                :key="`category_taxonomies.${index}`"
              >
                {{ taxonomyName(findTaxonomy(taxonomy)) }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('referral_button_text')">
          <gov-table-header top scope="row"
            >Referral button text</gov-table-header
          >
          <gov-table-cell v-if="original">{{
            original.referral_button_text
          }}</gov-table-cell>
          <gov-table-cell>{{ service.referral_button_text }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row
          v-if="service.hasOwnProperty('show_referral_disclaimer')"
        >
          <gov-table-header top scope="row"
            >Show referral disclaimer</gov-table-header
          >
          <gov-table-cell v-if="original">{{
            original.show_referral_disclaimer | showReferralDisclaimer
          }}</gov-table-cell>
          <gov-table-cell>{{
            service.show_referral_disclaimer | showReferralDisclaimer
          }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('logo_file_id')">
          <gov-table-header top scope="row">Logo</gov-table-header>
          <gov-table-cell v-if="original">
            <ck-image v-if="original.image" :file-id="original.image.id" />
          </gov-table-cell>
          <gov-table-cell>
            <ck-image
              v-if="service.logo_file_id"
              :file-id="service.logo_file_id"
            />
            <img
              v-else
              :src="
                logoDataUri ||
                  apiUrl(
                    `/services/new/logo.png?update_request_id=${updateRequestId}`
                  )
              "
              :alt="logoAlt"
              class="ck-logo"
            />
          </gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="service.hasOwnProperty('gallery_items')">
          <gov-table-header top scope="row">Gallery items</gov-table-header>
          <gov-table-cell style="width: 25%" v-if="original">
            <ck-carousel
              v-if="
                original.hasOwnProperty('gallery_items') &&
                  Array.isArray(original.gallery_items) &&
                  original.gallery_items.length
              "
              :image-ids="
                original.gallery_items.map(galleryItem => galleryItem.file_id)
              "
            />
            <gov-body v-else>-</gov-body>
          </gov-table-cell>
          <gov-table-cell :style="original ? 'width: 25%;' : 'width: 50%;'">
            <ck-carousel
              v-if="
                Array.isArray(service.gallery_items) &&
                  service.gallery_items.length
              "
              :image-ids="
                service.gallery_items.map(galleryItem => galleryItem.file_id)
              "
            />
            <gov-body v-else>-</gov-body>
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
import http from "@/http";
import moment from "moment";
import CkCarousel from "@/components/Ck/CkCarousel";
import CkImage from "@/components/Ck/CkImage";
import CkTaxonomyTree from "@/components/Ck/CkTaxonomyTree";

export default {
  name: "ServiceDetails",

  props: {
    updateRequestId: {
      required: true,
      type: String
    },

    requestedAt: {
      required: true,
      type: String
    },

    service: {
      required: true,
      type: Object
    },

    logoDataUri: {
      required: false,
      type: String
    },

    logoAlt: {
      required: false,
      type: String
    },

    galleryItemsDataUris: {
      required: false,
      type: Array
    }
  },

  components: { CkCarousel, CkImage, CkTaxonomyTree },

  data() {
    return {
      loading: false,
      original: null,
      taxonomies: [],
      flattenedTaxonomies: [],
      eligibilityTypes: [],
      flattenedEligibilityTypes: []
    };
  },

  computed: {
    serviceGalleryItems() {
      return this.galleryItemsDataUris && this.galleryItemsDataUris.length > 0
        ? this.galleryItemsDataUris
        : this.imageUrls(this.service);
    }
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

      await this.fetchServiceEligibilites();

      this.loading = false;
    },

    async fetchOriginal() {
      // If this is an update request for a NEW service, then there's no original to check for.
      if (this.service.id !== null) {
        const {
          data: { data: original }
        } = await http.get(`/services/${this.service.id}`, {
          params: { include: "organisation" }
        });
        this.original = original;
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

    async fetchServiceEligibilites() {
      this.loading = true;
      const { data: eligibilityTypes } = await http.get(
        "/taxonomies/service-eligibilities"
      );
      this.eligibilityTypes = eligibilityTypes.data;
      this.flattenedEligibilityTypes = this.getFlattenedTaxonomies(
        eligibilityTypes.data
      );
      this.loading = false;
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
    },

    getServiceEligibilityIds(service) {
      return service.eligibility_types.taxonomies.reduce(
        (taxonomyIds, taxonomyId) => {
          const taxonomy = this.flattenedEligibilityTypes.find(
            taxonomy => taxonomy.id === taxonomyId
          );
          return taxonomyIds.concat(
            this.getTaxonomyAndAncestorsIds(
              taxonomy,
              this.flattenedEligibilityTypes
            )
          );
        },
        []
      );
    },

    updatedServiceEligibilities() {
      const originalTaxonomies = this.original
        ? this.getServiceEligibilityIds(this.original)
        : [];
      const updatedTaxonomies = this.getServiceEligibilityIds(this.service);
      return Array.from(new Set(originalTaxonomies.concat(updatedTaxonomies)));
    },

    imageUrls(service) {
      return service.gallery_items.map(galleryItem => {
        if (galleryItem.hasOwnProperty("url")) {
          return galleryItem.url;
        }

        return this.apiUrl(
          `/services/${service.id}/gallery-items/${galleryItem.file_id}?update_request_id=${this.updateRequestId}`
        );
      });
    },

    slugify(name) {
      return name.toLowerCase().replaceAll(" ", "_");
    },

    eligibilityTaxonomyChanged(eligibilityRoot) {
      return (
        this.service.hasOwnProperty("eligibility_types") &&
        this.updatedServiceEligibilities().includes(eligibilityRoot.id)
      );
    },
    eligibilityCustomChanged(eligibilityRoot) {
      const rootSlug = this.slugify(eligibilityRoot.name);

      const customEligibility = this.original
        ? this.original.eligibility_types.custom[rootSlug]
        : "";

      return (
        this.service.eligibility_types.hasOwnProperty("custom") &&
        typeof this.service.eligibility_types.custom[rootSlug] == "string" &&
        this.service.eligibility_types.custom[rootSlug] !== customEligibility
      );
    }
  },

  filters: {
    status(status) {
      return status === "active" ? "Enabled" : "Disabled";
    },

    score(score) {
      const qualityScores = {
        0: "Unrated",
        1: "Poor",
        2: "Below Average",
        3: "Average",
        4: "Above Average",
        5: "Excellent"
      };
      return qualityScores[score];
    },

    isFree(isFree) {
      return isFree ? "Yes" : "No";
    },

    originalExists(field) {
      return field || "";
    },

    socialMediaType(type) {
      switch (type) {
        case "twitter":
          return "Twitter / X";
        case "facebook":
          return "Facebook";
        case "instagram":
          return "Instagram";
        case "snapchat":
          return "Snapchat";
        case "tiktok":
          return "TikTok";
        case "youtube":
          return "YouTube";
        case "other":
          return "Other";
      }
    },

    referralMethod(referralMethod) {
      return referralMethod.charAt(0).toUpperCase() + referralMethod.slice(1);
    },

    showReferralDisclaimer(showReferralDisclaimer) {
      return showReferralDisclaimer ? "Show" : "Hide";
    },

    endsAt(date) {
      if (date === null || date === "") {
        return "";
      }
      return moment(date).format("D/M/YYYY");
    }
  },

  created() {
    this.fetchAll();
  }
};
</script>
