<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.name="{ item }">
      <external-link
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon__taxon }}
      </external-link>
    </template>
    <template #item.agent="{ item }">
      {{ item.agent__agent }}
    </template>
    <template #item.dateIdentified="{ item }">
      <!-- NOTE: Needs to be formated -->
      {{ item.date_identified }}
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference_id"
        @click.native="$openGeology('reference', item.reference_id)"
      >
        {{ item.reference__reference }}
      </external-link>
    </template>
    <template #item.type="{ item }">
      {{
        $translate({
          et: item.identification_type__value,
          en: item.identification_type__value_en,
        })
      }}
    </template>
    <template #item.current="{ item }">
      <!-- NOTE:  Should probably create a component for checkmark/cross.
          This is piece of code is also in RockTable.
       -->
      <v-icon v-if="item.current" color="green" small>mdi-check-bold</v-icon>
      <v-icon v-else color="red" small>mdi-close-thick</v-icon>
    </template>
  </table-wrapper>
</template>

<script>
import ExternalLink from '../ExternalLink.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'SpecimenIdentificationTable',
  components: { TableWrapper, ExternalLink },
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
        {
          text: this.$t('specimenIdentification.name'),
          value: 'name',
        },
        {
          text: this.$t('specimenIdentification.agent'),
          value: 'agent',
        },
        {
          text: this.$t('specimenIdentification.dateIdentified'),
          value: 'dateIdentified',
        },
        {
          text: this.$t('specimenIdentification.reference'),
          value: 'reference',
        },
        { text: this.$t('specimenIdentification.type'), value: 'type' },
        { text: this.$t('specimenIdentification.remarks'), value: 'remarks' },
        { text: this.$t('specimenIdentification.current'), value: 'current' },
        // { text: this.$t('stratigraphyReference.pages'), value: 'pages' },
        // { text: this.$t('stratigraphyReference.remarks'), value: 'remarks' },
      ],
    }
  },
}
</script>
