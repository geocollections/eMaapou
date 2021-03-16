<template>
  <expandable-table-wrapper
    :items="items"
    :headers="headers"
    :count="count"
    :init-options="options"
    v-on="$listeners"
  >
    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #expanded-item="{ headers, item }">
      <td class="py-2" :colspan="headers.length">{{ item.description }}</td>
    </template>
    <template #item.rock="{ item }">
      {{ $translate({ et: item.rock__name, en: item.rock__name_en }) }}
    </template>
    <template #item.thickness="{ item }">
      {{
        !item.depth_base || !item.depth_top
          ? null
          : round(item.depth_base - item.depth_top, 3)
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <a
        class="text-link"
        @click="$openGeoDetail('stratigraphy', item.stratigraphy)"
      >
        {{
          $translate({
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en,
          })
        }}
      </a>
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
  </expandable-table-wrapper>
</template>

<script>
import { round } from 'lodash'
import ExpandableTableWrapper from '~/components/tables/ExpandableTableWrapper.vue'
export default {
  name: 'DescriptionTable',
  components: { ExpandableTableWrapper },
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
          text: this.$t('localityDescription.description'),
          value: 'data-table-expand',
          align: 'center',
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
