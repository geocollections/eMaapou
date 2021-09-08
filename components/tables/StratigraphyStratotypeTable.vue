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
        v-if="item.locality"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality.id } })
        "
      >
        {{
          $translate({
            et: item.locality.locality,
            en: item.locality.locality_en,
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
