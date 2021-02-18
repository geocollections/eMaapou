<template>
  <table-wrapper
    :items="references"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.taxon="{ item }">
      <a
        class="text-link"
        @click="$openWindow(`https://fossiilid.info/${item.taxon}`)"
      >
        {{ item.taxon__taxon }}
      </a>
    </template>

    <template #item.extra="{ item }">
      <v-icon v-if="item.extra">mdi-plus</v-icon>
      <v-icon v-else>mdi-minus</v-icon>
    </template>
  </table-wrapper>
</template>

<script>
import { isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'

export default {
  components: { TableWrapper },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      references: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
      },
      headers: [
        { text: this.$t('taxon.taxon'), value: 'taxon' },
        {
          text: this.$t('taxon.name'),
          value: 'name',
        },
        { text: this.$t('taxon.frequency'), value: 'frequency' },
        {
          text: this.$t('taxon.agent_identified'),
          value: 'agent_identified__agent',
        },
        { text: this.$t('taxon.date_identified'), value: 'date_identified' },
        { text: this.$t('taxon.extra'), value: 'extra' },
        { text: this.$t('taxon.remarks'), value: 'remarks' },
      ],
      queryFields: {
        taxon: () => 'taxon__taxon',
        name: () => 'name',
        frequency: () => 'frequency',
        agent_identified: () => 'agent_identified__agent,agent_identified_txt',
        date_identified: () => 'date_identified,date_identified_free',
        extra: () => 'extra',
        remarks: () => 'remarks',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'taxon_list',
        {
          ...options,
          isValid: isNil(this.sample),
          defaultParams: {
            sample: this.sample,
          },
          queryFields: this.queryFields,
        }
      )
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
