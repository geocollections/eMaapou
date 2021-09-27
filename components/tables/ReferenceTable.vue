<template>
  <table-wrapper
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
        v-if="item.id"
        @click.native="$openGeology('reference', item.id)"
      >
        {{ item.reference }}
      </external-link>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.journal__journal_name">
        {{ item.journal__journal_name }}
      </div>
      <div v-else-if="item.book">{{ item.book }}</div>
    </template>

    <template #item.doi="{ item }">
      <external-link
        v-if="item.doi"
        @click.native="$openWindow(`https://doi.org/${item.doi}`)"
      >
        {{ item.doi }}
      </external-link>
    </template>
  </table-wrapper>
</template>

<script>
import { cloneDeep } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_REFERENCE } from '~/constants'
export default {
  name: 'ReferenceTable',
  components: { ExternalLink, TableWrapper },
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
      localHeaders: cloneDeep(HEADERS_REFERENCE),
    }
  },
}
</script>
