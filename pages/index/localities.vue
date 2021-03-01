<template>
  <external-search-table-wrapper
    :external-search="search"
    :items="items"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.country="{ item }">
      {{ $translate({ et: item.country, en: item.country_en }) }}
    </template>
  </external-search-table-wrapper>
</template>

<script>
import { mapState } from 'vuex'

import ExternalSearchTableWrapper from '@/components/tables/ExternalSearchTableWrapper'
export default {
  components: { ExternalSearchTableWrapper },
  data() {
    return {
      items: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      headers: [
        { text: this.$t('locality.name'), value: 'locality' },
        { text: this.$t('locality.country'), value: 'country' },
        { text: this.$t('locality.latitude'), value: 'latitude' },
        { text: this.$t('locality.longitude'), value: 'longitude' },
      ],
      queryFields: {
        locality: () =>
          this.$i18n.locale === 'et' ? 'locality' : 'locality_en',
        country: () => (this.$i18n.locale === 'et' ? 'country' : 'country_en'),
      },
    }
  },
  computed: {
    ...mapState('landing', ['search']),
  },
  created() {
    this.$store.subscribe((mutation, _) => {
      if (mutation.type === 'landing/updateSearch') {
        this.handleUpdate({ ...this.options, search: mutation.payload })
      }
    })
  },
  methods: {
    async handleUpdate(options) {
      const localityResponse = await this.$services.sarvSolr.getResourceList(
        'locality',
        {
          ...options,
          search: this.search,
          queryFields: this.queryFields,
        }
      )
      this.options = options
      this.items = localityResponse.items
      this.count = localityResponse.count
    },
  },
}
</script>
