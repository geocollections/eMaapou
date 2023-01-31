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
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.number="{ item }">
      <nuxt-link
        v-if="item.number"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.number }}
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
        {{ $translate({ et: item.site_name, en: item.site_name_en }) }}
      </nuxt-link>
    </template>
    <template #item.stratigraphy="{ item }">
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
    </template>
    <template #item.lithostratigraphy="{ item }">
      <nuxt-link
        v-if="item.lithostratigraphy"
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
    </template>
    <template #item.date_collected="{ item }">
      {{ item.date_collected ? $formatDate(item.date_collected) : null }}
    </template>
    <template #item.image="{ item }">
      <thumbnail-image
        v-if="item.image_preview_url"
        :preview-src="item.image_preview_url"
        :src="item.image_url"
        class="my-1"
      />
    </template>
  </base-data-table>
</template>

<script>
import round from 'lodash/round'
import cloneDeep from 'lodash/cloneDeep'
import { mapState } from 'vuex'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SAMPLE } from '~/constants'
import ThumbnailImage from '~/components/thumbnail/ThumbnailImage.vue'
export default {
  name: 'DataTableSample',
  components: { BaseDataTable, ThumbnailImage },
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
      localHeaders: cloneDeep(HEADERS_SAMPLE),
      module: 'sample',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'sample' }),
  },
  methods: {
    round,
  },
}
</script>
