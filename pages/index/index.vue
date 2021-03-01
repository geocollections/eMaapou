<template>
  <external-search-table-wrapper
    :external-search="search"
    :items="items"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.drillcore="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'drillcore-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
      </nuxt-link>
    </template>
  </external-search-table-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import ExternalSearchTableWrapper from '@/components/tables/ExternalSearchTableWrapper'
export default {
  components: { ExternalSearchTableWrapper },
  data() {
    return {
      items: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      headers: [
        { text: this.$t('drillcore.name'), value: 'drillcore' },
        { text: this.$t('drillcore.depth'), value: 'depth' },
        { text: this.$t('drillcore.boxes'), value: 'boxes' },
        { text: this.$t('drillcore.boxNumbers'), value: 'box_numbers' },
        { text: this.$t('drillcore.storage'), value: 'storage__location' },
        { text: this.$t('drillcore.year'), value: 'year' },
        { text: this.$t('drillcore.remarks'), value: 'remarks' },
      ],
      queryFields: {
        drillcore: () =>
          this.$i18n.locale === 'et' ? 'drillcore' : 'drillcore_en',
        depth: () => 'depth',
        boxes: () => 'boxes',
        box_numbers: () => 'box_numbers',
        storage__location: () => 'storage__location',
        year: () => 'year',
        remarks: () => 'remarks',
      },
    }
  },
  computed: {
    ...mapState('landing', ['search']),
  },
  created() {
    this.$store.subscribe((mutation, _) => {
      if (mutation.type === 'landing/updateSearch') {
        this.handleUpdate({ ...this.options, search: mutation.payload })
      }
    })
  },
  methods: {
    async handleUpdate(options) {
      const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
        'drillcore',
        {
          ...options,
          search: this.search,
          queryFields: this.queryFields,
        }
      )
      this.options = options
      this.items = drillcoreResponse.items
      this.count = drillcoreResponse.count
    },
  },
}
</script>
