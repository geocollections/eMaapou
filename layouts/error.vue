<template>
  <v-row justify="center">
    <v-col sm="8" md="6" class="text-center">
      <h1 style="font-size: 1.75rem">
        {{ title }}
      </h1>
      <div>{{ error.message }}</div>
      <quick-search-form class="my-4" @submit="handleSearch" />
      <NuxtLink to="/" class="text-link-grey">
        {{ $t('common.backToLanding') }}
      </NuxtLink>
    </v-col>
  </v-row>
</template>

<script>
import { isEmpty } from 'lodash'
import QuickSearchForm from '~/components/search/forms/QuickSearchForm.vue'
export default {
  components: { QuickSearchForm },
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
  computed: {
    title() {
      return this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    },
  },
  methods: {
    handleSearch() {
      const routeName = this.$route.name.includes('search')
        ? this.$route.name.split('__')[0]
        : 'search'
      const query = isEmpty(this.search)
        ? { ...this.$route.query }
        : { ...this.$route.query, q: this.search }
      this.$router.push(this.localePath({ name: routeName, query }))
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
