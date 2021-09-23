<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.rock="{ item }">
      <external-link
        v-if="item.rock"
        @click.native="$openWindow(`https://kivid.info/${item.rock.id}`)"
      >
        {{
          $translate({
            et: item.rock.name,
            en: item.rock.name_en,
          })
        }}
      </external-link>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent.agent }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      <div>{{ item.date_identified || item.date_identified_free }}</div>
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
      <div v-if="item.type">
        {{
          $translate({
            et: item.type.value,
            en: item.type.value_en,
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
  name: 'SpecimenIdentificationGeologyTable',
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
          text: this.$t('specimenIdentification.rock'),
          value: 'rock',
        },
        {
          text: this.$t('specimenIdentification.name'),
          value: 'name',
        },
        {
          text: this.$t('specimenIdentification.name_en'),
          value: 'name_en',
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
