<template>
  <div>
    <title-card
      :title="$t('about.title')"
      class="title-border"
      style="border-color: var(--v-header-darken1)"
    />
    <v-card
      v-if="page"
      width="100%"
      tile
      flat
      color="transparent"
      class="roundedBorder"
    >
      <div
        :style="{ columns: aboutTextColumns }"
        class="mx-3 montserrat"
        v-html="$translate({ et: page.content_et, en: page.content_en })"
      ></div>
    </v-card>
  </div>
</template>

<script>
import TitleCard from '~/components/TitleCard.vue'
export default {
  components: { TitleCard },
  async asyncData({ route, error, app }) {
    try {
      const data = await app.$services.sarvREST.getResource('page', 78)
      return { page: data.results[0] }
    } catch (err) {
      error({
        message: `Could not find about page`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$t('about.pageTitle'),
    }
  },
  computed: {
    aboutTextColumns() {
      if (this.$vuetify.breakpoint.lgAndUp) return 3
      if (this.$vuetify.breakpoint.mdOnly) return 2
      return 1
    },
  },
}
</script>

<style scoped>
.aboutpage {
  padding: 20px;
  /* border-top: solid 1px #6a76ab;
  border-bottom: solid 1px #6a76ab; */
}

.aboutpage > div {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}
</style>
