<template>
  <v-row justify="center" class="mt-10">
    <v-col sm="8" md="6" class="text-center">
      <h1 class="text-h4 mb-5">
        {{ title }}
      </h1>

      <v-btn
        text
        large
        elevation="0"
        class="text-capitalize montserrat"
        @click="$router.go(0)"
      >
        <v-icon left> {{ icons.mdiRefresh }} </v-icon>
        Refresh
      </v-btn>
      <v-btn
        large
        text
        elevation="0"
        nuxt
        to="/"
        class="montserrat text-capitalize"
      >
        <v-icon left>{{ icons.mdiHome }}</v-icon>
        {{ $t('common.backToLanding') }}
      </v-btn>
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
    </v-col>
  </v-row>
</template>

<script>
import { mdiMagnify, mdiRefresh, mdiHome } from '@mdi/js'
import InputSearch from '~/components/input/InputSearch.vue'
export default {
  name: 'DetailError',
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
      otherError: this.$t('error.occurred'),
    }
  },
  head() {
    const title = this.otherError
    return {
      title,
    }
  },
  computed: {
    title() {
      return this.otherError
    },
    icons() {
      return {
        mdiMagnify,
        mdiRefresh,
        mdiHome,
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
