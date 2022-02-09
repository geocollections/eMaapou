<template>
  <base-data-table
    v-bind="$attrs"
    :headers="filteredHeaders"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'analysis-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.sample_number="{ item }">
      <nuxt-link
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_id"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality_id } })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
      <nuxt-link
        v-else-if="item.site_id"
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.site_id } })"
      >
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </nuxt-link>
    </template>
    <template #item.thickness="{ item }">
      {{
        !item.depth_interval || !item.depth
          ? null
          : round(item.depth_interval - item.depth, 3)
      }}
    </template>
    <template #item.method="{ item }">
      {{
        $translate({
          et: item.analysis_method,
          en: item.analysis_method_en,
        })
      }}
    </template>
    <template #item.method_details="{ item }">
      {{
        $translate({
          et: item.method_details,
          en: item.method_details_en,
        })
      }}
    </template>
    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ item.date ? $formatDate(item.date) : null }}
      </div>
      <div v-else>{{ item.date_free }}</div>
    </template>
  </base-data-table>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_ANALYSIS } from '~/constants'
export default {
  name: 'DataTableAnalysis',
  components: { BaseDataTable },
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
    hideDepth: Boolean,
    hideLocality: Boolean,
    hideSample: Boolean,
  },
  data() {
    return {
      localHeaders: cloneDeep(HEADERS_ANALYSIS),
      module: 'analysis',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'analysis' }),
    filteredHeaders() {
      return this.$_headers.filter((item) => {
        if (item.value.includes('depth')) return !this.hideDepth
        else if (item.value === 'locality') return !this.hideLocality
        else if (item.value === 'sample_number') return !this.hideSample
        else return item
      })
    },
  },
  methods: {
    round,
  },
}
</script>
