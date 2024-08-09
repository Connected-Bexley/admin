<template>
  <div>
    <div v-for="[sectionId, section] in sortedContent" :key="sectionId">
      <gov-heading tag="h3" size="m">{{ section.label }}</gov-heading>
      <ck-text-input
        v-if="Object.keys(section).includes('title')"
        :value="section.title"
        @input="onChangeTitle(sectionId, $event)"
        :id="`${sectionId}-title`"
        label="Title"
        type="text"
        :error="errors.get(`content_${sectionId}_title`)"
      />
      <div
        v-for="(content, index) in section.content"
        :key="`${sectionId}-content-${index}`"
      >
        <ck-wysiwyg-input
          v-if="content.type === 'copy'"
          :value="content.value"
          @input="onChangeCopy(sectionId, index, $event)"
          :id="`${sectionId}-copy-${index}`"
          :label="section.label"
          :hint="section.hint"
          :error="errors.get(`content.${sectionId}.content.${index}`)"
          large
          :maxlength="60000"
        />
        <ck-call-to-action
          v-else-if="content.type === 'cta'"
          :call-to-action="content"
          :id="`${sectionId}-cta-${index}`"
          @input="onChangeCalltoAction(sectionId, index, $event)"
          :error="errors.get(`content.${sectionId}.content.${index}`)"
        />
        <ck-video-embed
          v-else-if="content.type === 'video'"
          :video="content"
          :id="`${sectionId}-video-${index}`"
          @input="onChangeVideo(sectionId, index, $event)"
          :error="errors.get(`content.${sectionId}.content.${index}`)"
        />
        <gov-button type="button" @click="addCopy(sectionId, index)"
          >Add Copy here</gov-button
        >&nbsp;
        <gov-button type="button" @click="addCallToAction(sectionId, index)"
          >Add Call to action here</gov-button
        >&nbsp;
        <gov-button type="button" @click="addVideo(sectionId, index)"
          >Add Video here</gov-button
        >&nbsp;
        <span v-if="index > 0">
          <gov-button
            type="button"
            :warning="true"
            @click="removeContent(sectionId, index)"
            >Remove Content</gov-button
          >&nbsp;
          <gov-button type="button" @click="moveUp(sectionId, index)"
            >Move up</gov-button
          >&nbsp;
        </span>
        <gov-button
          v-if="index < section.content.length - 1"
          type="button"
          @click="moveDown(sectionId, index)"
          >Move down</gov-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import CkCallToAction from "./Ck/CkCallToAction";
import CkVideoEmbed from "./Ck/CkVideoEmbed.vue";

export default {
  name: "PageContent",

  components: {
    CkCallToAction,
    CkVideoEmbed
  },

  props: {
    content: {
      type: Object,
      required: true
    },
    errors: {
      required: true
    }
  },

  data() {
    return {
      contentOrder: {
        introduction: 1,
        about: 2,
        info_pages: 3,
        collections: 4
      }
    };
  },

  computed: {
    sortedContent() {
      return Object.entries(this.content)
        .map(([key, value]) => {
          if (!value.order) {
            value.order = this.contentOrder[key];
          }
          return [key, value];
        })
        .sort((a, b) => {
          return a[1].order - b[1].order;
        });
    }
  },

  methods: {
    onChangeTitle(section, value) {
      const content = Object.assign({}, this.content);

      content[section]["title"] = value;

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_title`);
    },
    onChangeCopy(section, index, value) {
      const content = Object.assign({}, this.content);

      content[section]["content"][index].value = value;

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content_${index}`);
    },
    onChangeCalltoAction(section, index, cta) {
      const content = Object.assign({}, this.content);

      content[section]["content"][index] = cta;

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content_${index}`);
    },
    onChangeVideo(section, index, video) {
      const content = Object.assign({}, this.content);

      content[section]["content"][index] = video;

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content_${index}`);
    },
    addCopy(section, index) {
      const content = Object.assign({}, this.content);

      content[section]["content"].splice(index + 1, 0, {
        type: "copy",
        value: ""
      });

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content`);
    },
    addCallToAction(section, index) {
      const content = Object.assign({}, this.content);

      content[section]["content"].splice(index + 1, 0, {
        type: "cta",
        title: "",
        description: "",
        url: "",
        buttonText: ""
      });

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content`);
    },
    addVideo(section, index) {
      const content = Object.assign({}, this.content);

      content[section]["content"].splice(index + 1, 0, {
        type: "video",
        title: "",
        url: ""
      });

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content`);
    },
    removeContent(section, index) {
      const content = Object.assign({}, this.content);

      content[section]["content"].splice(index, 1);

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content`);
    },

    moveUp(section, index) {
      const content = Object.assign({}, this.content);
      const contentBlock = Object.assign(
        {},
        content[section]["content"][index]
      );

      content[section]["content"].splice(index, 1);
      content[section]["content"].splice(index - 1, 0, contentBlock);

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content`);
    },

    moveDown(section, index) {
      const content = Object.assign({}, this.content);
      const contentBlock = Object.assign(
        {},
        content[section]["content"][index]
      );

      content[section]["content"].splice(index, 1);
      content[section]["content"].splice(index + 1, 0, contentBlock);

      this.$emit("update", content);
      this.$emit("clear", `content_${section}_content`);
    }
  }
};
</script>

<style lang="scss" scoped></style>
