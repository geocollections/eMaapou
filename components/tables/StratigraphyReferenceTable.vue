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
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
    <template #item.year="{ item }">
      <div v-if="item.reference">
        {{ item.reference.year }}
      </div>
    </template>
    <template #item.content="{ item }">
      {{ $translate({ et: item.content, en: item.content_en }) }}
    </template>
  </table-wrapper-test>
</template>

<script>
import { cloneDeep } from 'lodash'
import ExternalLink from '../ExternalLink.vue'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_STRATIGRAPHY_REFERENCE } from '~/constants'
export default {
  name: 'StratigraphyReferenceTable',
  components: { TableWrapperTest, ExternalLink },
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
      localHeaders: cloneDeep(HEADERS_STRATIGRAPHY_REFERENCE),
    }
  },
}
</script>
