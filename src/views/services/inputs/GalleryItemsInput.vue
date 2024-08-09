<template>
  <div>
    <gov-inset-text
      v-for="(galleryItem, index) in galleryItems"
      :key="`Ck::GalleryItem::${galleryItem.file_id}`"
    >
      <ck-image-input
        @input="onGalleryItemInput($event, index)"
        :id="`Ck::GalleryItemImage::${galleryItem.file_id}`"
        label="Upload an item to the gallery"
        :file-id="galleryItem.file_id"
      />

      <gov-error-message
        v-if="
          errors.has(`gallery_items.${index}`) ||
            errors.has(`gallery_items.${index}.file_id`)
        "
        v-text="
          errors.get([
            `gallery_items.${index}`,
            `gallery_items.${index}.file_id`
          ])
        "
        :for="`Ck::GalleryItem::${galleryItem.file_id}`"
      />
    </gov-inset-text>

    <div>
      <gov-button @click="onAddGalleryItem">
        <template v-if="galleryItems.length === 0">Add gallery item</template>
        <template v-else>Add another</template>
      </gov-button>
    </div>
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";

export default {
  name: "GalleryItemsInput",

  components: { CkImageInput },

  model: {
    prop: "galleryItems",
    event: "input"
  },

  props: {
    galleryItems: {
      type: Array,
      required: true
    },

    errors: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      index: 1
    };
  },

  methods: {
    clone() {
      return JSON.parse(JSON.stringify(this.galleryItems));
    },

    onGalleryItemInput(event, index) {
      const galleryItems = this.clone();
      if (event.file_id === null) {
        galleryItems.splice(index, 1);
      } else {
        galleryItems[index].file_id = event.file_id;
        galleryItems[index].image = event.image;
      }
      this.$emit("clear", `gallery_items.${index}`);
      this.$emit("clear", `gallery_items.${index}.file_id`);
      this.$emit("input", galleryItems);
    },

    onAddGalleryItem() {
      const galleryItems = this.clone();
      galleryItems.push({
        file_id: null,
        image: null,
        $index: this.index
      });
      this.$emit("input", galleryItems);

      this.index++;
    }
  }
};
</script>
