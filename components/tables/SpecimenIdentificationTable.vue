<template>
  <table-wrapper-test
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
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
      <div v-if="item.agent">
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
      <div v-if="item.identification_type">
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
  </table-wrapper-test>
</template>

<script>
import { cloneDeep } from 'lodash'
import ExternalLink from '../ExternalLink.vue'
import BooleanIndicator from '../BooleanIndicator.vue'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SPECIMEN_IDENTIFICATION } from '~/constants'
export default {
  name: 'SpecimenIdentificationTable',
  components: { TableWrapperTest, ExternalLink, BooleanIndicator },
  mixins: [headersMixin],
  props: {
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
      localHeaders: cloneDeep(HEADERS_SPECIMEN_IDENTIFICATION),
    }
  },
}
</script>
