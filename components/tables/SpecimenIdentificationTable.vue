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
        v-if="item.taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.taxon }}
      </external-link>

      <div v-if="item.name">| {{ item.name }}</div>
    </template>
    <template #item.agent="{ item }">
      <div v-if="agent">
        {{ item.agent.agent }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      {{ item.date_identified }}
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
    <template #item.type="{ item }">
      <div v-if="identification_type">
        {{
          $translate({
            et: item.identification_type.value,
            en: item.identification_type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.current="{ item }">
      <boolean-indicator :value="item.current" />
    </template>
  </table-wrapper>
</template>

<script>
import ExternalLink from '../ExternalLink.vue'
import BooleanIndicator from '../BooleanIndicator.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'SpecimenIdentificationTable',
  components: { TableWrapper, ExternalLink, BooleanIndicator },
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
  computed: {
    taxon() {
      return this.item?.taxon
    },
    agent() {
      return this.item?.agent
    },
    identification_type() {
      return this.item?.identification_type
    },
    reference() {
      return this.item?.reference
    },
  },
}
</script>
