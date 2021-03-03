<template>
  <external-search-table-wrapper
    :items="samples"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.id="{ item }">
      <a
        class="text-link"
        @click="$openNuxtWindow('sample-id', { id: item.id })"
      >
        {{ item.id }}
      </a>
    </template>
    <template #item.stratigraphy="{ item }">
      <a
        class="text-link"
        @click="$openGeoDetail('stratigraphy', item.stratigraphy_id)"
      >
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </a>
    </template>
    <template #item.date_collected="{ item }">
      {{
        item.date_collected
          ? new Date(item.date_collected).toISOString().split('T')[0]
          : null
      }}
    </template>
  </external-search-table-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import { round } from 'lodash'
import ExternalSearchTableWrapper from '@/components/tables/ExternalSearchTableWrapper'
export default {
  components: { ExternalSearchTableWrapper },
  data() {
    return {
      samples: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      headers: [
        { text: this.$t('sample.id'), value: 'id' },
        { text: this.$t('sample.number'), value: 'number' },
        { text: this.$t('sample.depth'), value: 'depth' },
        { text: this.$t('sample.depthInterval'), value: 'depth_interval' },
        { text: this.$t('sample.stratigraphy'), value: 'stratigraphy' },
        { text: this.$t('sample.collector'), value: 'collector' },
        { text: this.$t('sample.dateCollected'), value: 'date_collected' },
      ],
      queryFields: {
        id: () => 'id',
        number: () => 'number',
        depth: () => 'depth',
        depth_interval: () => 'depth_interval',
        stratigraphy: () =>
          this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
        collector: () => 'collector',
        date_collected: () => 'date_collected',
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
    round,
    async handleUpdate(options) {
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          ...options,
          defaultParams: {},
          queryFields: this.queryFields,
        }
      )

      this.options = options
      this.samples = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
