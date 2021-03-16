<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.drillcore="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'drillcore-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'DrillcoreTable',
  components: { TableWrapper },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    externalOptions: {
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
        { text: this.$t('drillcore.name'), value: 'drillcore' },
        { text: this.$t('drillcore.depth'), value: 'depth' },
        { text: this.$t('drillcore.boxes'), value: 'boxes' },
        { text: this.$t('drillcore.boxNumbers'), value: 'box_numbers' },
        { text: this.$t('drillcore.year'), value: 'year' },
        { text: this.$t('drillcore.storage'), value: 'core_repository' },
        { text: this.$t('drillcore.acronym'), value: 'acronym' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
