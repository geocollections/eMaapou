<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="translatedHeaders"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id_l="{ item }">
      <nuxt-link
        v-if="item.id_l"
        class="text-link"
        :to="localePath({ name: 'analysis-id', params: { id: item.id_l } })"
      >
        {{ item.id_l }}
      </nuxt-link>
    </template>
    <template #item.analysis_method="{ item }">
      {{
        $translate({ et: item.analysis_method, en: item.analysis_method_en })
      }}
    </template>
    <template #item.sample_number="{ item }">
      <nuxt-link
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number || item.sample_id }}
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
        {{ item.site }}
      </nuxt-link>
    </template>
    <template #item.stratigraphy="{ item }">
      <div class="d-flex flex-row justify-space-between">
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

        <div
          v-if="item.stratigraphy_id && item.lithostratigraphy_id"
          class="px-1 font-weight-bold"
        >
          |
        </div>

        <nuxt-link
          v-if="item.lithostratigraphy_id"
          class="text-link font-italic"
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
      </div>
    </template>
    <template #item.depth="{ item }">
      <span v-if="item.depth && item.depth_interval"
        >{{ item.depth }} - {{ item.depth_interval }} m</span
      >
      <span v-else>{{ item.depth }}</span>
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference_id"
        @click.native="$openGeology('reference', item.reference_id)"
      >
        {{ item.reference }}
      </external-link>
      <div v-else>{{ item.reference_str }}</div>
    </template>
    <template #item.dataset_id="{ item }">
      <nuxt-link
        v-if="item.dataset_id"
        class="text-link"
        :to="
          localePath({ name: 'dataset-id', params: { id: item.dataset_id } })
        "
      >
        {{ item.dataset_id }}
      </nuxt-link>
    </template>
    <template #item.analysis_id="{ item }">
      <nuxt-link
        v-if="item.analysis_id"
        class="text-link"
        :to="
          localePath({ name: 'analysis-id', params: { id: item.analysis_id } })
        "
      >
        {{ item.analysis_id }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import { mapState } from 'vuex'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'AnalyticalDataTable',
  components: { ExternalLink, TableWrapper },
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
  computed: {
    ...mapState('analyticalData', ['tableHeaders']),

    translatedHeaders() {
      return this.tableHeaders.map((header) => {
        return {
          ...header,
          text: header.translate ? this.$t(header.text) : header.text,
        }
      })
    },
  },
  methods: {
    round,
  },
}
</script>
