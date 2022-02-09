<template>
  <base-data-table
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.preparation_number="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'preparation-id', params: { id: item.id } })"
      >
        {{ item.preparation_number }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_en"
        class="text-link"
        :to="
          localePath({
            name: 'locality-id',
            params: { id: item.locality_id },
          })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.depth="{ item }">
      <span>{{ item.depth }}</span>
    </template>
    <template #item.stratigraphy="{ item }">
      <span v-if="item.stratigraphy_id || item.lithostratigraphy_id">
        <nuxt-link
          v-if="item.stratigraphy_id"
          class="text-link"
          :to="
            localePath({
              name: 'stratigraphy-id',
              params: { id: item.stratigraphy_id },
            })
          "
        >
          {{
            $translate({
              et: item.stratigraphy,
              en: item.stratigraphy_en,
            })
          }}
        </nuxt-link>

        <span v-if="item.lithostratigraphy_id"> | </span>
        <nuxt-link
          v-if="item.lithostratigraphy_id"
          class="text-link"
          :to="
            localePath({
              name: 'stratigraphy-id',
              params: { id: item.lithostratigraphy_id },
            })
          "
        >
          {{
            $translate({
              et: item.lithostratigraphy,
              en: item.lithostratigraphy_en,
            })
          }}
        </nuxt-link>
      </span>
    </template>
  </base-data-table>
</template>

<script>
import { mapState } from 'vuex'
import { round, cloneDeep } from 'lodash'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_PREPARATION } from '~/constants'
export default {
  name: 'DataTablePreparation',
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
  },
  data() {
    return {
      localHeaders: cloneDeep(HEADERS_PREPARATION),
      module: 'preparation',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'preparation' }),
  },
  methods: {
    round,
  },
}
</script>
