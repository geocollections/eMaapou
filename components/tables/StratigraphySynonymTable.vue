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
    <template #item.language="{ item }">
      <div v-if="item.language">
        {{
          $translate({ et: item.language.value, en: item.language.value_en })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
  </table-wrapper-test>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import ExternalLink from '~/components/ExternalLink'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_STRATIGRAPHY_SYNONYM } from '~/constants'
export default {
  name: 'StratigraphySynonymTable',
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
      localHeader: cloneDeep(HEADERS_STRATIGRAPHY_SYNONYM),
    }
  },
  methods: {
    round,
  },
}
</script>
