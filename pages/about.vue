<template>
  <div>
    <v-card
      v-if="page"
      width="100%"
      raised-1
      tile
      class="roundedBorder aboutpage"
    >
      <h1 class="text-center my-3">{{ $t('about.title') }}</h1>
      <div
        v-html="$translate({ et: page.content_et, en: page.content_en })"
      ></div>
    </v-card>
  </div>
</template>

<script>
export default {
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
