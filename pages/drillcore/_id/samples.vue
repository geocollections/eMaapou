<template>
  <table-wrapper
    :items="samples"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.id="{ item }">
      <a class="text-link" @click="$openGeoDetail('sample', item.id)">
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
    <template #item.thickness="{ item }">
      {{
        !item.depth_interval || !item.depth
          ? null
          : round(item.depth_interval - item.depth, 3)
      }}
    </template>
    <template #item.date_collected="{ item }">
      {{
        item.date_collected
          ? new Date(item.date_collected).toISOString().split('T')[0]
          : null
      }}
    </template>
  </table-wrapper>
</template>

<script>
import { round, isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'

export default {
  components: { TableWrapper },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
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
        { text: this.$t('samples.id'), value: 'id' },
        { text: this.$t('samples.number'), value: 'number' },
        { text: this.$t('samples.depth'), value: 'depth' },
        { text: this.$t('samples.depthInterval'), value: 'depth_interval' },
        // {
        //   text: this.$t('samples.thickness'),
        //   value: 'thickness',
        //   sortable: false,
        //   class: 'static-cell-header',
        //   cellClass: 'static-cell',
        // },
        { text: this.$t('samples.stratigraphy'), value: 'stratigraphy' },
        { text: this.$t('samples.collector'), value: 'collector' },
        { text: this.$t('samples.dateCollected'), value: 'date_collected' },
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
  methods: {
    round,
    async handleUpdate(options) {
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
          },
          queryFields: this.queryFields,
        }
      )
      this.samples = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
