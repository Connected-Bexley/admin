<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful
        :title="`${appName} - Edit Event Collection: ${collection.name}`"
      />

      <gov-back-link :to="{ name: 'admin-index-collections-events' }"
        >Back to event collections</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="one-half">
            <gov-heading size="xl">
              <gov-caption size="xl">Collections</gov-caption>
              Events
            </gov-heading>
            <gov-heading size="m">Edit event collection</gov-heading>
            <gov-body>
              From this page, you can edit the event collections that appear on
              the homepage. You can change which taxonomies they refer to, the
              icon used, and the information provided in the description and
              sidebox.
            </gov-body>

            <collection-form
              :errors="form.$errors"
              :id="collection.id"
              :name.sync="form.name"
              :intro.sync="form.intro"
              :order.sync="form.order"
              :enabled.sync="form.enabled"
              :sideboxes.sync="form.sideboxes"
              :category_taxonomies.sync="form.category_taxonomies"
              :image_file_id.sync="form.image_file_id"
              @clear="form.$errors.clear($event)"
              @image-changed="imageChanged = $event"
            />

            <gov-button v-if="form.$submitting" disabled type="submit"
              >Updating...</gov-button
            >
            <gov-button
              v-else
              @click="onSubmit"
              :disabled="imageChanged"
              type="submit"
              >Update</gov-button
            >
            <ck-submit-error v-if="form.$errors.any()" />

            <gov-section-break size="l" />

            <ck-delete-button
              resource="event"
              :endpoint="
                `/collections/organisation-events/${this.collection.id}`
              "
              @deleted="onDelete"
            />
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";
import CollectionForm from "@/views/collections/events/forms/CollectionForm";

export default {
  name: "EditCollectionEvent",
  components: { CollectionForm },
  data() {
    return {
      loading: false,
      collection: null,
      form: null,
      imageChanged: false
    };
  },
  methods: {
    async fetchCollection() {
      this.loading = true;

      const response = await http.get(
        `/collections/organisation-events/${this.$route.params.collection}`
      );
      this.collection = response.data.data;
      this.form = new Form({
        name: this.collection.name,
        intro: this.collection.intro,
        image_file_id: this.collection.image ? this.collection.image.id : null,
        order: this.collection.order,
        enabled: this.collection.enabled,
        sideboxes: this.collection.sideboxes,
        category_taxonomies: this.collection.category_taxonomies.map(
          taxonomy => taxonomy.id
        )
      });

      this.loading = false;
    },
    async onSubmit() {
      await this.form.put(
        `/collections/organisation-events/${this.collection.id}`
      );
      this.$router.push({ name: "admin-index-collections-events" });
    },
    onDelete() {
      this.$router.push({ name: "admin-index-collections-events" });
    }
  },
  created() {
    this.fetchCollection();
  }
};
</script>
