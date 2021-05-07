<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'analysis-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.sample_number="{ item }">
      <nuxt-link
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number }}
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
      <nuxt-link
        v-else-if="item.site_id"
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.site_id } })"
      >
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </nuxt-link>
    </template>
    <template #item.thickness="{ item }">
      {{
        !item.depth_interval || !item.depth
          ? null
          : round(item.depth_interval - item.depth, 3)
      }}
    </template>
    <template #item.method="{ item }">
      {{
        $translate({
          et: item.analysis_method,
          en: item.analysis_method_en,
        })
      }}
    </template>
    <template #item.method_details="{ item }">
      {{
        $translate({
          et: item.method_details,
          en: item.method_details_en,
        })
      }}
    </template>
    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ item.date ? new Date(item.date).toISOString().split('T')[0] : null }}
      </div>
      <div v-else>{{ item.date_free }}</div>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'AnalysisTable',
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
        { text: this.$t('analysis.id'), value: 'id' },
        { text: this.$t('analysis.sampleNumber'), value: 'sample_number' },
        { text: this.$t('analysis.locality'), value: 'locality' },
        { text: this.$t('analysis.depth'), value: 'depth' },
        { text: this.$t('analysis.depthInterval'), value: 'depth_interval' },

        { text: this.$t('analysis.method'), value: 'method' },
        {
          text: this.$t('analysis.methodDetails'),
          value: 'method_details',
        },
        { text: this.$t('analysis.analysedBy'), value: 'agent' },
        { text: this.$t('analysis.date'), value: 'date' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
