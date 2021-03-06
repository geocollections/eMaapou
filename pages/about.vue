<template>
  <div>
    <h1 class="text-center my-3">{{ $t('about.title') }}</h1>
    <v-card v-if="page" width="100%" flat tile class="roundedBorder aboutpage">
      <div v-if="$i18n.locale === 'et'" v-html="page.content_et"></div>
      <div v-if="$i18n.locale === 'en'" v-html="page.content_en"></div>
    </v-card>
  </div>
</template>

<script>
export default {
  async asyncData(context) {
    const data = await context.$axios.$get(
      `https://api.geocollections.info/page/78`
    )
    return { page: data.results[0] }
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
  border-top: solid 1px #6a76ab;
  border-bottom: solid 1px #6a76ab;
}
</style>
