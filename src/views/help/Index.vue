<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Help`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>

    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Help</gov-heading>
          <gov-body
            >Welcome to the help section. Please follow the links below to our
            series of "how to" guides on YouTube.</gov-body
          >
          <template v-for="(videoPair, i) in pairedVideos">
            <gov-grid-row :key="`video-pair-${i}`">
              <gov-grid-column
                v-for="(video, j) in videoPair"
                :key="`video-${j}`"
                width="one-half"
              >
                <ck-video-iframe
                  :height="video.height"
                  :width="video.width"
                  :src="video.src"
                  :title="video.title"
                />
                <gov-heading size="m">{{ video.title }}</gov-heading>
              </gov-grid-column>
            </gov-grid-row>
          </template>
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import CkVideoIframe from "@/components/Ck/CkVideoIframe";

export default {
  name: "Help",

  components: {
    CkVideoIframe
  },

  data() {
    return {
      videos: [
        {
          height: 315,
          width: 560,
          src: "https://www.youtube.com/embed/HALo2I-gdXs",
          title: "Introduction the to video training series"
        },
        {
          height: 315,
          width: 560,
          src: "https://www.youtube.com/embed/RoeMDBZLJQc",
          title: "How to sign up to the platform"
        },
        {
          height: 315,
          width: 560,
          src: "https://www.youtube.com/embed/p3-4mlY1pOQ",
          title: "Your first login, managing your organisation and adding users"
        },
        {
          height: 315,
          width: 560,
          src: "https://www.youtube.com/embed/Qf421buT6zs",
          title: "Adding your service"
        }
      ]
    };
  },

  computed: {
    pairedVideos() {
      let pairedVideos = [];
      this.videos.forEach((video, index) => {
        if (index % 2 == 0) {
          let videoPair = [video];
          if (typeof this.videos[index + 1] !== "undefined") {
            videoPair.push(this.videos[index + 1]);
          }
          pairedVideos.push(videoPair);
        }
      });
      return pairedVideos;
    }
  }
};
</script>

<style lang="scss" scoped></style>
