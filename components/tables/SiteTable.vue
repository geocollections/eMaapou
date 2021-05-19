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
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.name="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
      >
        {{
          $translate({
            et: item.name,
            en: item.name_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.area="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.area_id } })"
      >
        {{
          $translate({
            et: item.area_name,
            en: item.area_name_en,
          })
        }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import { mapState } from 'vuex'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'SiteTable',
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
        { text: this.$t('site.id'), value: 'id' },
        { text: this.$t('site.name'), value: 'name' },
        { text: this.$t('site.area'), value: 'area' },
        { text: this.$t('site.latitude'), value: 'latitude' },
        { text: this.$t('site.longitude'), value: 'longitude' },
        {
          text: this.$t('site.elevation'),
          value: 'z',
        },
        { text: this.$t('site.depth'), value: 'depth' },
      ],
    }
  },
  computed: {
    ...mapState('tableHeaders', {
      tableHeaders(state) {
        return state.site.tableHeaders
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
