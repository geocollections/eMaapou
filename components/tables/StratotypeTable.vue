<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy__id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en,
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
      <a
        class="text-link"
        @click="$openGeology('reference', item.reference__id)"
        >{{ item.reference__reference }}</a
      >
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'StratotypeTable',
  components: { TableWrapper },
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
        { text: this.$t('stratotype.stratigraphy'), value: 'stratigraphy' },
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
