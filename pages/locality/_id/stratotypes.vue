<template>
  <table-wrapper
    :items="stratotypes"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.stratigraphy="{ item }">
      <a
        class="text-link"
        @click="$openGeoDetail('stratigraphy', item.stratigraphy__id)"
      >
        {{
          $translate({
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en,
          })
        }}
      </a>
    </template>
    <template #item.type="{ item }">
      {{
        $translate({
          et: item.stratotype_type__value,
          en: item.stratotype_type__value_en,
        })
      }}
    </template>
    <template #item.reference="{ item }">
      <a
        class="text-link"
        @click="$openGeology('reference', item.reference__id)"
        >{{ item.reference__reference }}</a
      >
    </template>
  </table-wrapper>
</template>

<script>
import { isNil } from 'lodash'
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
      stratotypes: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: ['depth_top', 'depth_base'],
        sortDesc: [false, true],
      },
      headers: [
        { text: this.$t('stratotype.stratigraphy'), value: 'stratigraphy' },
        { text: this.$t('stratotype.type'), value: 'type' },
        { text: this.$t('stratotype.depthTop'), value: 'depth_top' },
        { text: this.$t('stratotype.depthBase'), value: 'depth_base' },
        { text: this.$t('stratotype.reference'), value: 'reference' },
        { text: this.$t('stratotype.remarks'), value: 'remarks' },
      ],
      queryFields: {
        stratigraphy: () =>
          this.$i18n.locale === 'et'
            ? 'stratigraphy__stratigraphy'
            : 'stratigraphy__stratigraphy_en',
        type: () =>
          this.$i18n.locale === 'et'
            ? 'stratotype_type__value'
            : 'stratotype_type__value_en',
        reference: () => 'reference__reference',
        remarks: () => 'remarks',
        depth_top: () => 'depth_top',
        depth_base: () => 'depth_base',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
      const stratotypeResponse = await this.$services.sarvREST.getResourceList(
        'stratigraphy_stratotype',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            locality__id: this.locality,
          },
          queryFields: this.queryFields,
        }
      )
      this.stratotypes = stratotypeResponse.items
      this.count = stratotypeResponse.count
    },
  },
}
</script>
