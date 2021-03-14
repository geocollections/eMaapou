<template>
  <table-wrapper
    :headers="headers"
    :items="samples"
    :init-options="options"
    :count="count"
    @update="handleUpdate"
  >
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.number="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.number }}
      </nuxt-link>
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
  </table-wrapper>
</template>

<script>
import { round, isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'

export default {
  name: 'SampleTable',
  components: { TableWrapper },
  props: {
    searchField: {
      type: Object,
      default: null,
      validator: (obj) => {
        return (
          typeof obj === 'object' &&
          obj.key !== undefined &&
          obj.value !== undefined
        )
      },
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
  methods: {
    round,
    async handleUpdate(options) {
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          ...options,
          isValid: isNil(this.searchField.value),
          defaultParams: {
            fq: `${this.searchField.key}:${this.searchField.value}`,
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
