<template>
  <div class="pt-5 mx-auto" style="max-width: 800px">
    <base-header
      :title="$t('about.title')"
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
        class="mx-6 text-body-1"
        style="max-width: 700px"
        v-html="$translate({ et: page.content_et, en: page.content_en })"
      ></div>
    </v-card>
  </div>
</template>

<script>
import BaseHeader from '~/components/base/BaseHeader.vue'
export default {
  components: { BaseHeader },
  layout: 'news',
  async asyncData({ route, error, app }) {
    try {
      const data = await app.$services.sarvREST.getResource('web_pages', 78)
      return { page: data }
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
