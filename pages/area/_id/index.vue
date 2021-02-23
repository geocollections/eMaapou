<template>
  <table-wrapper
    :items="sites"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
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
import { isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'

export default {
  components: { TableWrapper },
  props: {
    area: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      sites: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
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
      queryFields: {
        id: () => 'id',
        site: () => (this.$i18n.locale === 'et' ? 'name' : 'name_en'),
        x: () => 'x',
        y: () => 'y',
        z: () => 'z',
        depth: () => 'depth',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
      const solrResponse = await this.$services.sarvSolr.getResourceList(
        'site',
        {
          ...options,
          isValid: isNil(this.area),
          defaultParams: {
            fq: `area_id:${this.area}`,
          },
          queryFields: this.queryFields,
        }
      )

      this.sites = solrResponse.items
      this.count = solrResponse.count
    },
  },
}
</script>
