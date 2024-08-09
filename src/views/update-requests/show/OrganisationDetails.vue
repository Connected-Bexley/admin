<template>
  <ck-loader v-if="loading" />
  <div v-else>
    <gov-body v-if="original">
      For organisation
      <gov-link
        :to="{
          name: 'organisations-show',
          params: { organisation: original.id }
        }"
        v-text="original.name"
      />.
    </gov-body>

    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header scope="column"></gov-table-header>
          <gov-table-header scope="column">From</gov-table-header>
          <gov-table-header scope="column">To</gov-table-header>
        </gov-table-row>

        <gov-table-row v-if="organisation.hasOwnProperty('url')">
          <gov-table-header top scope="row">URL</gov-table-header>
          <gov-table-cell v-if="original" break>{{
            original.url
          }}</gov-table-cell>
          <gov-table-cell v-else>-</gov-table-cell>
          <gov-table-cell break>{{ organisation.url }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="organisation.hasOwnProperty('name')">
          <gov-table-header top scope="row">Name</gov-table-header>
          <gov-table-cell v-if="original">{{ original.name }}</gov-table-cell>
          <gov-table-cell v-else>-</gov-table-cell>
          <gov-table-cell>{{ organisation.name }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="organisation.hasOwnProperty('slug')">
          <gov-table-header top scope="row">Slug</gov-table-header>
          <gov-table-cell v-if="original">{{ original.slug }}</gov-table-cell>
          <gov-table-cell v-else>-</gov-table-cell>
          <gov-table-cell>{{ organisation.slug }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="organisation.hasOwnProperty('email')">
          <gov-table-header top scope="row">Email</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.email || "-"
          }}</gov-table-cell>
          <gov-table-cell v-else>-</gov-table-cell>
          <gov-table-cell>{{ organisation.email || "-" }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="organisation.hasOwnProperty('phone')">
          <gov-table-header top scope="row">Phone</gov-table-header>
          <gov-table-cell v-if="original">{{
            original.phone || "-"
          }}</gov-table-cell>
          <gov-table-cell v-else>-</gov-table-cell>
          <gov-table-cell>{{ organisation.phone || "-" }}</gov-table-cell>
        </gov-table-row>

        <gov-table-row v-if="organisation.hasOwnProperty('social_medias')">
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
            <gov-list v-if="Array.isArray(organisation.social_medias)">
              <li
                v-for="(socialMedia, index) in organisation.social_medias"
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

        <gov-table-row v-if="organisation.hasOwnProperty('description')">
          <gov-table-header top scope="row">Description</gov-table-header>
          <gov-table-cell
            v-if="original"
            v-html="toHtml(original.description)"
          />
          <gov-table-cell v-else>-</gov-table-cell>
          <gov-table-cell v-html="toHtml(organisation.description)" />
        </gov-table-row>

        <gov-table-row v-if="organisation.hasOwnProperty('logo_file_id')">
          <gov-table-header top scope="row">Logo</gov-table-header>
          <gov-table-cell v-if="original">
            <ck-image v-if="original.image" :file-id="original.image.id" />
          </gov-table-cell>
          <gov-table-cell v-else>-</gov-table-cell>
          <gov-table-cell>
            <ck-image
              v-if="organisation.logo_file_id"
              :file-id="organisation.logo_file_id"
            />
            <img
              v-else-if="organisation.id"
              :src="
                apiUrl(
                  `/organisations/${organisation.id}/logo.png?update_request_id=${updateRequestId}`
                )
              "
              alt="Organisation logo"
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
import CkImage from "@/components/Ck/CkImage";

export default {
  name: "OrganisationDetails",
  components: { CkImage },
  props: {
    updateRequestId: {
      required: true,
      type: String
    },

    requestedAt: {
      required: true,
      type: String
    },

    organisation: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      original: null
    };
  },
  methods: {
    async fetchOriginal() {
      if (this.organisation.id !== null) {
        this.loading = true;
        const {
          data: { data: original }
        } = await http.get(`/organisations/${this.organisation.id}`);
        this.original = original;
        this.loading = false;
      }
    }
  },
  created() {
    this.fetchOriginal();
  }
};
</script>
