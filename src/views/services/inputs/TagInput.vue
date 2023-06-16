<template>
  <div>
    <div v-if="auth.isGlobalAdmin">
      <gov-checkboxes>
        <gov-checkbox
          v-for="tag in combinedTags"
          :key="tag.slug"
          :id="tag.slug"
          :value="serviceTagSlugs.includes(tag.slug)"
          :name="tag.slug"
          :label="tag.label"
          @input="updateTags({ tag, enabled: $event })"
        />
      </gov-checkboxes>
      <gov-form-group>
        <ck-text-input
          id="new-tag"
          v-model="newTag.label"
          label="Create new tag"
          :error="newTagError"
        />
        <gov-button type="button" @click="updateTags({ tag: newTag })">
          Add tag
        </gov-button>
      </gov-form-group>
    </div>
    <gov-tag v-else v-for="serviceTag in serviceTags" :key="serviceTag.slug">
      {{ serviceTag.label }}
    </gov-tag>
  </div>
</template>

<script>
import http from "@/http";
import CkTextInput from "@/components/Ck/CkTextInput";

export default {
  components: { CkTextInput },
  name: "TagInput",

  props: {
    serviceTags: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      tags: [],
      newTag: {
        label: ""
      },
      newTagError: null
    };
  },

  computed: {
    serviceTagSlugs() {
      return this.serviceTags.map(tag => tag.slug);
    },
    combinedTags() {
      const tagSlugs = this.tags.map(tag => tag.slug);
      const newTags = this.serviceTags.filter(
        tag => !tagSlugs.includes(tag.slug)
      );
      return this.tags.concat(newTags);
    }
  },

  methods: {
    async fetchTags() {
      this.loading = true;
      const { data } = await http.get("/tags");
      this.tags = data.data;
      this.loading = false;
    },
    updateTags(update) {
      let serviceTags = this.serviceTags.slice();
      if (update.enabled === false) {
        serviceTags = this.serviceTags.filter(
          tag => tag.slug !== update.tag.slug
        );
      } else {
        // If this is a new tag, check if it exists
        if (
          !update.tag.id &&
          this.combinedTags.filter(
            tag => tag.slug === this.slugify(update.tag.label)
          ).length
        ) {
          this.newTagError = `Tag ${update.tag.label} already exists`;
          this.newTag = { label: "" };
          return;
        }
        serviceTags.push({
          slug: this.slugify(update.tag.label),
          label: update.tag.label
        });
        this.newTag = { label: "" };
      }
      this.$emit("input", serviceTags);
    }
  },

  created() {
    this.fetchTags();
  }
};
</script>

<style lang="scss" scoped></style>
