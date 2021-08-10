<template>
  <table-wrapper
    expandable
    :items="items"
    :headers="headers"
    :count="count"
    :options="options"
    v-on="$listeners"
  >
    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #expanded-item="{ headers, item }">
      <td class="py-2" :colspan="headers.length">
        <v-row no-gutters>
          <v-col class="pr-2 pb-4 pt-2">
            {{ item.description }}
          </v-col>
          <v-col cols="12" md="6">
            <v-simple-table dense class="custom-table">
              <template #default>
                <tbody>
                  <data-row
                    :title="$t('localityDescription.zeroLevel')"
                    :value="item.zero_level"
                  />
                  <data-row
                    :title="$t('localityDescription.authorFree')"
                    :value="item.author_free"
                  />
                  <link-data-row
                    :title="$t('localityDescription.reference')"
                    :value="item.reference__reference"
                    @link-click="$openGeology('reference', item.reference)"
                  />
                  <data-row
                    :title="$t('localityDescription.year')"
                    :value="item.year"
                  />
                  <data-row
                    :title="$t('localityDescription.stratigraphyFree')"
                    :value="item.stratigraphy_free"
                  />
                  <data-row
                    :title="$t('localityDescription.rockEt')"
                    :value="item.rock__name"
                  />
                  <data-row
                    :title="$t('localityDescription.rockEn')"
                    :value="item.rock__name_en"
                  />
                  <data-row
                    :title="$t('localityDescription.remarks')"
                    :value="item.remarks"
                  />
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </td>
    </template>
    <template #item.rock="{ item }">
      {{ $translate({ et: item.rock__name, en: item.rock__name_en }) }}
    </template>
    <template #item.thickness="{ item }">
      {{
        !item.depth_base || !item.depth_top
          ? null
          : Math.abs(round(item.depth_base - item.depth_top, 3))
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        v-if="item.stratigraphy"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy },
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
    <template #item.author="{ item }">
      <a
        v-if="item.reference"
        :class="{ 'is-preferred': !item.is_preferred, 'text-link': true }"
        @click="$openGeology('reference', item.reference)"
      >
        {{ item.reference__reference }}
      </a>
      <div
        v-else-if="item.agent__agent"
        :class="{ 'is-preferred': !item.is_preferred }"
      >
        {{ item.agent__agent }}
      </div>
      <div v-else :class="{ 'is-preferred': !item.is_preferred }">
        {{ item.author_free }}
      </div>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import DataRow from '../DataRow.vue'
import LinkDataRow from '../LinkDataRow.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'DescriptionTable',
  components: { TableWrapper, DataRow, LinkDataRow },
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
        {
          text: this.$t('localityDescription.description'),
          value: 'data-table-expand',
          align: 'center',
        },
        { text: this.$t('localityDescription.depthTop'), value: 'depth_top' },
        { text: this.$t('localityDescription.depthBase'), value: 'depth_base' },
        {
          text: this.$t('localityDescription.thickness'),
          value: 'thickness',
          sortable: false,
          class: 'static-cell-header',
          cellClass: 'static-cell',
        },
        {
          text: this.$t('localityDescription.rock'),
          value: 'rock',
        },
        {
          text: this.$t('localityDescription.stratigraphy'),
          value: 'stratigraphy',
        },
        {
          text: this.$t('localityDescription.author'),
          value: 'author',
          sortable: false,
        },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
