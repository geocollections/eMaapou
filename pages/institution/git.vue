<template>
  <div style="max-width: 800px" class="mx-auto">
    <base-header
      :title="$translate({ et: page.title_et, en: page.title_en })"
    />
    <v-row no-gutters>
      <v-col class="pl-4" cols="12">
        <v-card v-if="page" width="" tile flat color="transparent">
          <div
            class="mx-3"
            v-html="$translate({ et: page.content_et, en: page.content_en })"
          ></div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: 'news',
  async asyncData({ route, error, app }) {
    try {
      const data = await app.$services.sarvREST.getResource('web_pages', 44)
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
      title: this.$translate({
        et: this.page.title_et,
        en: this.page.title_en,
      }),
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
