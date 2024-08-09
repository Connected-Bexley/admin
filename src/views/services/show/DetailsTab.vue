<template>
  <div>
    <gov-heading size="l">Details</gov-heading>
    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header top scope="row"
            >Name of {{ service.type }}</gov-table-header
          >
          <gov-table-cell>{{ service.name }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row"
            >Organisation for {{ service.type }}</gov-table-header
          >
          <gov-table-cell>{{ service.organisation.name }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row"
            >{{ service.type | ucfirst }} website address</gov-table-header
          >
          <gov-table-cell break>{{ service.url }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row"
            >{{ service.type | ucfirst }} logo</gov-table-header
          >
          <gov-table-cell>
            <ck-image v-if="service.image" :file-id="service.image.id" />
          </gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row"
            >Summary of {{ service.type }}</gov-table-header
          >
          <gov-table-cell>{{ service.intro }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row"
            >{{ service.type | ucfirst }} description</gov-table-header
          >
          <gov-table-cell v-html="toHtml(service.description)" />
        </gov-table-row>
        <gov-table-row v-if="appServiceOfferingsActive">
          <gov-table-header top scope="row">Offerings</gov-table-header>
          <gov-table-cell>
            <gov-list v-if="service.offerings.length > 0" bullet>
              <li
                v-for="{ offering, order } in service.offerings"
                :key="`ServiceOffering::${order}`"
              >
                {{ offering }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">Status</gov-table-header>
          <gov-table-cell
            v-html="service.status === 'active' ? 'Enabled' : 'Disabled'"
          />
        </gov-table-row>
        <gov-table-row v-if="auth.isSuperAdmin">
          <gov-table-header top scope="row">Quality Score</gov-table-header>
          <gov-table-cell v-html="qualityScores[service.score]" />
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">End date</gov-table-header>
          <gov-table-cell>{{ service.ends_at | endsAt }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row">Last updated</gov-table-header>
          <gov-table-cell>
            {{ service.last_modified_at | lastModifiedAt }}
            <template v-if="auth.isServiceAdmin(service.id)">
              <gov-link
                v-if="!refreshForm.$submitting"
                @click="onMarkAsStillUpToDate"
                >(mark as still up to date)</gov-link
              >
              <template v-else>(marking as still up to date...)</template>
            </template>
          </gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row"
            >Gallery items ({{
              service.gallery_items.length
            }})</gov-table-header
          >
          <gov-table-cell style="width: 50%">
            <ck-carousel
              v-if="service.gallery_items.length"
              :image-ids="
                service.gallery_items.map(galleryItem => galleryItem.file_id)
              "
            />
            <gov-body v-else>-</gov-body>
          </gov-table-cell>
        </gov-table-row>
        <gov-table-row v-if="appServiceTagsActive">
          <gov-table-header top scope="row">Tags</gov-table-header>
          <gov-table-cell>
            <gov-list v-if="service.tags.length > 0" bullet>
              <li
                v-for="(tag, index) in service.tags"
                :key="`ServiceTag::${index}`"
              >
                {{ tag.label }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
import moment from "moment";
import Form from "@/classes/Form";
import CkImage from "@/components/Ck/CkImage";
import CkCarousel from "@/components/Ck/CkCarousel";

export default {
  name: "DetailsTab",

  components: { CkCarousel, CkImage },

  props: {
    service: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      refreshForm: new Form({}),
      qualityScores: {
        0: "Unrated",
        1: "Poor",
        2: "Below Average",
        3: "Average",
        4: "Above Average",
        5: "Excellent"
      }
    };
  },

  computed: {
    imageUrls() {
      return this.service.gallery_items.map(galleryItem => galleryItem.url);
    }
  },

  filters: {
    endsAt(date) {
      if (date === null || date === "") {
        return "No end date";
      }
      return moment(date).format("D/M/YYYY");
    },

    lastModifiedAt(date) {
      return moment(date).format("D/M/YYYY");
    }
  },

  methods: {
    async onMarkAsStillUpToDate() {
      await this.refreshForm.put(`/services/${this.service.id}/refresh`);
      this.$router.go();
    }
  }
};
</script>
