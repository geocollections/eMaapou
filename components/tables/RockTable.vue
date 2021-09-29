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
    <template #item.id="{ item }">
      <external-link
        v-if="item.id"
        @click.native="$openWindow(`https://kivid.info/${item.id}`)"
      >
        {{ item.id }}
      </external-link>
    </template>

    <template #item.formula="{ item }">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="item.formula_html" v-html="item.formula_html" />
      <div v-else>{{ item.formula }}</div>
    </template>

    <template #item.in_estonia="{ item }">
      <boolean-indicator :value="item.is_estonia" />
    </template>

    <template #item.mindat_id="{ item }">
      <external-link
        v-if="item.mindat_id"
        @click.native="
          $openWindow(`https://www.mindat.org/min-${item.mindat_id}.html`)
        "
      >
        {{ item.mindat_id }}
      </external-link>
    </template>
  </table-wrapper>
</template>

<script>
import { cloneDeep } from 'lodash'
import BooleanIndicator from '../BooleanIndicator.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_ROCK } from '~/constants'
export default {
  name: 'RockTable',
  components: { ExternalLink, TableWrapper, BooleanIndicator },
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
      localHeaders: cloneDeep(HEADERS_ROCK),
    }
  },
}
</script>
