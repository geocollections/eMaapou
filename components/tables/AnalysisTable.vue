<template>
  <table-wrapper
    :headers="headers"
    :items="analyses"
    :init-options="options"
    :count="count"
    @update="handleUpdate"
  >
    <template #item.id="{ item }">
      <a
        class="text-link"
        @click="$openNuxtWindow('analysis-id', { id: item.id })"
      >
        {{ item.id }}
      </a>
    </template>
    <template #item.sample_number="{ item }">
      <a
        class="text-link"
        @click="$openNuxtWindow('sample-id', { id: item.sample_id })"
      >
        {{ item.sample_number }}
      </a>
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
import { round, isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'AnalysisTable',
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
      analyses: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      headers: [
        { text: this.$t('analysis.id'), value: 'id' },
        { text: this.$t('analysis.sampleNumber'), value: 'sample_number' },
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
      queryFields: {
        id: () => 'id',
        sample_number: () => 'sample_number',
        depth: () => 'depth',
        depth_interval: () => 'depth_interval',
        method: () =>
          this.$i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en',
        method_details: () =>
          this.$i18n.locale === 'et' ? 'method_details' : 'method_details_en',
        agent: () => 'agent',
        date: () => 'date',
      },
    }
  },
  methods: {
    round,
    async handleUpdate(options) {
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'analysis',
        {
          ...options,
          isValid: isNil(this.searchField.value),
          defaultParams: {
            fq: `${this.searchField.key}:${this.searchField.value}`,
          },
          queryFields: this.queryFields,
        }
      )

      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
