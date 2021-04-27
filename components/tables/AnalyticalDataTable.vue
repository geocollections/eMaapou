<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.analysis_id="{ item }">
      <nuxt-link
        v-if="item.analysis_id"
        class="text-link"
        :to="
          localePath({ name: 'analysis-id', params: { id: item.analysis_id } })
        "
      >
        {{ item.analysis_id }}
      </nuxt-link>
    </template>
    <template #item.sample_number="{ item }">
      <nuxt-link
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number || item.sample_id }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_id"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality_id } })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
      <div v-else>{{ item.locality_str }}</div>
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
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </nuxt-link>
      <div v-else>
        {{
          $translate({
            et: item.stratigraphy_str,
            en: item.stratigraphy_en_str,
          })
        }}
      </div>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'AnalyticalDataTable',
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
  },
  data() {
    return {
      headers: [
        { text: this.$t('analyticalData.sample'), value: 'sample_number' },
        { text: this.$t('analyticalData.locality'), value: 'locality' },
        { text: this.$t('analyticalData.stratigraphy'), value: 'stratigraphy' },

        { text: this.$t('analyticalData.depth'), value: 'depth' },
        {
          text: this.$t('analyticalData.depthInterval'),
          value: 'depth_interval',
        },
        {
          text: this.$t('analyticalData.rock'),
          value: 'rock',
        },
        {
          text: this.$t('analyticalData.reference'),
          value: 'reference',
        },
        {
          text: this.$t('analyticalData.dataset'),
          value: 'dataset_id',
        },
        {
          text: this.$t('analyticalData.analysis'),
          value: 'analysis_id',
        },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
