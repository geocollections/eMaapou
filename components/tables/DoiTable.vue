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
    <template #item.identifier="{ item }">
      <external-link
        v-if="item.identifier"
        @click.native="
          $openWindow(`http://doi.geocollections.info/${item.identifier}`)
        "
        >{{ item.identifier }}</external-link
      >
    </template>

    <template #item.datacite_created="{ item }">
      <div v-if="item.datacite_created">
        <div>
          {{ $formatDate(item.datacite_created) }}
        </div>
        <div
          v-if="
            item.datacite_updated &&
            item.datacite_created !== item.datacite_updated
          "
        >
          ({{ $formatDate(item.datacite_updated) }})
        </div>
      </div>
    </template>
  </table-wrapper-test>
</template>

<script>
import { cloneDeep } from 'lodash'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import ExternalLink from '~/components/ExternalLink'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_DOI } from '~/constants'
export default {
  name: 'DoiTable',
  components: { ExternalLink, TableWrapperTest },
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
      localHeaders: cloneDeep(HEADERS_DOI),
    }
  },
}
</script>
