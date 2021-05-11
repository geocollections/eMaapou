<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="mergedHeaders"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.analysis="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'analysis-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.sample="{ item }">
      <nuxt-link
        v-if="item.sample_id"
        class="text-link"
        :to="
          localePath({
            name: 'sample-id',
            params: { id: item.sample_id },
          })
        "
      >
        {{ item.sample_id }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_id"
        class="text-link"
        :to="
          localePath({
            name: 'locality-id',
            params: { id: item.locality_id },
          })
        "
      >
        {{ item.locality }}
      </nuxt-link>
      <nuxt-link
        v-else-if="item.site_id"
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.site_id } })"
      >
        {{ item.site }}
      </nuxt-link>
    </template>
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        v-if="item.stratigraphy_id"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy_id },
          })
        "
      >
        {{ $translate({ et: item.stratigraphy, en: item.stratigraphy_en }) }}
      </nuxt-link>
    </template>

    <template #item.lithostratigraphy="{ item }">
      <nuxt-link
        v-if="item.lithostratigraphy_id"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.lithostratigraphy_id },
          })
        "
      >
        {{
          $translate({
            et: item.lithostratigraphy,
            en: item.lithostratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'DatasetAnalysisTable',
  components: { TableWrapper },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      }),
    },
    additionalHeaders: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        { text: this.$t('datasetAnalysis.analysis'), value: 'analysis' },
        {
          text: this.$t('datasetAnalysis.sampleNumber'),
          value: 'sample',
        },
        { text: this.$t('datasetAnalysis.locality'), value: 'locality' },
        {
          text: this.$t('datasetAnalysis.stratigraphy'),
          value: 'stratigraphy',
        },
        {
          text: this.$t('datasetAnalysis.lithostratigraphy'),
          value: 'lithostratigraphy',
        },
        {
          text: this.$t('datasetAnalysis.depth'),
          value: 'depth',
        },
      ],
    }
  },
  computed: {
    mergedHeaders() {
      return this.headers.concat(this.additionalHeaders)
    },
  },
  methods: {
    round,
  },
}
</script>
