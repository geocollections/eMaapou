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
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        v-if="item.stratigraphy"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy.id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy.stratigraphy,
            en: item.stratigraphy.stratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.type="{ item }">
      <div v-if="item.stratotype_type">
        {{
          $translate({
            et: item.stratotype_type.value,
            en: item.stratotype_type.value_en,
          })
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
  </table-wrapper>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
import { HEADERS_STRATOTYPE } from '~/constants'
export default {
  name: 'StratotypeTable',
  components: { ExternalLink, TableWrapper },
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
      localHeaders: cloneDeep(HEADERS_STRATOTYPE),
    }
  },
  methods: {
    round,
  },
}
</script>
