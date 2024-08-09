<template>
  <gov-table>
    <template slot="body">
      <gov-table-row
        v-for="(content, index) in orderedContent"
        :key="`content.${index}`"
      >
        <gov-table-header scope="row" top>{{ content.label }}</gov-table-header>
        <gov-table-cell>
          <gov-heading v-if="content.title" tag="h2">{{
            content.title
          }}</gov-heading>
          <div
            v-for="(contentItem, contentIndex) in content.content"
            :key="`content.${index}.${contentIndex}`"
          >
            <div
              v-if="contentItem.type === 'copy'"
              v-html="toHtml(contentItem.value)"
            ></div>
            <div v-if="contentItem.type === 'cta'">
              <gov-heading v-if="contentItem.title" size="s" tag="h3">{{
                contentItem.title
              }}</gov-heading>
              <p v-if="contentItem.description">
                {{ contentItem.description }}
              </p>
              <gov-button>{{ contentItem.buttonText }}</gov-button>
              <gov-hint>Link to: {{ contentItem.url }}</gov-hint>
            </div>
            <div v-if="contentItem.type === 'video'">
              <gov-heading v-if="contentItem.title" size="s" tag="h3">{{
                contentItem.title
              }}</gov-heading>
              <ck-video-iframe
                height="315"
                width="560"
                :src="contentItem.url"
                :title="contentItem.title"
              />
            </div>
          </div>
        </gov-table-cell>
      </gov-table-row>
    </template>
  </gov-table>
</template>

<script>
import CkVideoIframe from "@/components/Ck/CkVideoIframe";

export default {
  name: "PageContent",

  props: {
    content: {
      type: Object,
      required: true
    }
  },

  components: {
    CkVideoIframe
  },

  computed: {
    orderedContent() {
      return Object.entries(this.content)
        .sort((page1, page2) => {
          if (page1[1].order === page2[1].order) {
            return 0;
          }
          return page1[1].order < page2[1].order ? -1 : 1;
        })
        .map(contentItem => contentItem[1]);
    }
  }
};
</script>

<style lang="scss" scoped></style>
