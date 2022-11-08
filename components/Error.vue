<template>
  <v-row justify="center">
    <v-col sm="8" md="6" class="text-center">
      <h1 class="text-h4">
        {{ title }}
      </h1>
      <div class="montserrat">{{ error.message }}</div>
      <v-form class="d-flex text-right my-4" @submit.prevent="handleSearch">
        <input-search
          v-model="query"
          height="56"
          :placeholder="$t('landing.searchPlaceholder')"
        />
        <v-btn
          height="56px"
          width="84px"
          class="text-body-1 ml-2 ml-sm-3 mt-0 mt-sm-0"
          type="submit"
          color="warning"
          dark
        >
          <v-icon>{{ icons.mdiMagnify }}</v-icon>
        </v-btn>
      </v-form>
      <NuxtLink to="/" class="text-link-grey montserrat">
        {{ $t('common.backToLanding') }}
      </NuxtLink>
    </v-col>
  </v-row>
</template>

<script>
import { mdiMagnify } from '@mdi/js'
import InputSearch from '~/components/input/InputSearch.vue'
export default {
  components: { InputSearch },
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      query: '',
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
    icons() {
      return {
        mdiMagnify,
      }
    },
  },
  methods: {
    handleSearch() {
      this.$router.push(
        this.localePath({ name: 'search', query: { q: this.query } })
      )
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
