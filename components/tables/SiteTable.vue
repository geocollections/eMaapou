<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <a class="text-link" @click="$openNuxtWindow('site-id', { id: item.id })">
        {{ item.id }}
      </a>
    </template>
    <template #item.name="{ item }">
      <a class="text-link" @click="$openNuxtWindow('site-id', { id: item.id })">
        {{
          $translate({
            et: item.name,
            en: item.name_en,
          })
        }}
      </a>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'SiteTable',
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
        { text: this.$t('site.id'), value: 'id' },
        { text: this.$t('site.name'), value: 'name' },
        { text: this.$t('site.coordx'), value: 'x' },
        { text: this.$t('site.coordy'), value: 'y' },
        {
          text: this.$t('site.elevation'),
          value: 'z',
        },
        { text: this.$t('site.depth'), value: 'depth' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
