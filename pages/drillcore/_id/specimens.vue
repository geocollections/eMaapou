<template>
  <table-wrapper
    :items="specimens"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.id="{ item }">
      <a class="text-link" @click="$openGeoDetail('specimen', item.id)">
        {{ item.id }}
      </a>
    </template>
    <template #item.kind="{ item }">
      {{
        $translate({
          et: item.specimen_kind,
          en: item.specimen_kind_en,
        })
      }}
    </template>
    <template #item.thickness="{ item }">
      {{
        !item.depth_interval || !item.depth
          ? null
          : round(item.depth_interval - item.depth, 3)
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <a
        class="text-link"
        @click="$openGeoDetail('stratigraphy', item.stratigraphy_id)"
      >
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </a>
    </template>
    <template #item.taxon="{ item }">
      <a
        class="text-link"
        @click="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </a>
    </template>
  </table-wrapper>
</template>

<script>
import { round, isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'

export default {
  components: { TableWrapper },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      specimens: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },

      headers: [
        { text: this.$t('specimen.id'), value: 'id' },
        { text: this.$t('specimen.number'), value: 'specimen_number' },
        { text: this.$t('specimen.depth'), value: 'depth' },
        { text: this.$t('specimen.depthInterval'), value: 'depth_interval' },
        { text: this.$t('specimen.stratigraphy'), value: 'stratigraphy' },
        // {
        //   text: this.$t('specimen.thickness'),
        //   value: 'thickness',
        //   sortable: false,
        //   class: 'static-cell-header',
        //   cellClass: 'static-cell',
        // },
        { text: this.$t('specimen.kind'), value: 'kind' },
        { text: this.$t('specimen.fossilGroup'), value: 'fossilgroup' },
        { text: this.$t('specimen.taxon'), value: 'taxon' },
      ],
      queryFields: {
        id: () => 'id',
        specimen_number: () => 'specimen_number',
        depth: () => 'depth',
        depth_interval: () => 'depth_interval',
        fossilgroup: () => 'fossilgroup',
        kind: () =>
          this.$i18n.locale === 'et' ? 'specimen_kind' : 'specimen_kind_en',
        stratigraphy: () =>
          this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
        taxon: () => 'taxon',
      },
    }
  },
  methods: {
    round,
    async handleUpdate(options) {
      const specimenResponse = await this.$services.sarvSolr.getResourceList(
        'specimen',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
          },
          queryFields: this.queryFields,
        }
      )

      this.specimens = specimenResponse.items
      this.count = specimenResponse.count
    },
  },
}
</script>
