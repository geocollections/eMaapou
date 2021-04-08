<template>
  <table-wrapper
    v-bind="{ showSearch, onlyTable }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality__id } })
        "
      >
        {{
          $translate({
            et: item.locality__locality,
            en: item.locality__locality_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.type="{ item }">
      {{
        $translate({
          et: item.stratotype_type__value,
          en: item.stratotype_type__value_en,
        })
      }}
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference__id"
        @click.native="$openGeology('reference', item.reference__id)"
      >
        {{ item.reference__reference }}
      </external-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import ExternalLink from '../ExternalLink.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'StratigraphyStratotypeTable',
  components: { TableWrapper, ExternalLink },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    onlyTable: {
      type: Boolean,
      default: false,
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
        { text: this.$t('stratotype.locality'), value: 'locality' },
        { text: this.$t('stratotype.type'), value: 'type' },
        { text: this.$t('stratotype.depthTop'), value: 'depth_top' },
        { text: this.$t('stratotype.depthBase'), value: 'depth_base' },
        { text: this.$t('stratotype.reference'), value: 'reference' },
        { text: this.$t('stratotype.remarks'), value: 'remarks' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
