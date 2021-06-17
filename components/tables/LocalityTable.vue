<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="useDynamicHeaders ? dynamicHeaders : headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.country="{ item }">
      {{ $translate({ et: item.country, en: item.country_en }) }}
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import { mapState } from 'vuex'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'LocalityTable',
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
    useDynamicHeaders: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headers: [
        { text: this.$t('locality.id'), value: 'id' },
        { text: this.$t('locality.name'), value: 'locality' },
        { text: this.$t('locality.country'), value: 'country' },
        { text: this.$t('locality.latitude'), value: 'latitude' },
        { text: this.$t('locality.longitude'), value: 'longitude' },
      ],
    }
  },
  computed: {
    ...mapState('table_headers', {
      tableHeaders(state) {
        return state.locality.tableHeaders
      },
    }),

    dynamicHeaders() {
      return this.tableHeaders.reduce((prev, item) => {
        if (item.show) {
          prev.push({ ...item, text: this.$t(item.text) })
        }
        return prev
      }, [])
    },
  },
  methods: {
    round,
  },
}
</script>
