<template>
  <external-search-table-wrapper
    :external-search="search"
    :items="items"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
      >
        {{ item.id }}
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
        sortBy: ['id'],
        sortDesc: [true],
      },
      headers: [
        { text: this.$t('site.id'), value: 'id' },
        { text: this.$t('site.name'), value: 'name' },
        { text: this.$t('site.latitude'), value: 'latitude' },
        { text: this.$t('site.longitude'), value: 'longitude' },
      ],
      queryFields: {
        id: () => 'id_numeric',
        name: () => 'name',
        project: () =>
          this.$i18n.locale === 'et' ? 'project__name' : 'project__name_en',
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
      const siteResponse = await this.$services.sarvSolr.getResourceList(
        'site',
        {
          ...options,
          search: this.search,
          queryFields: this.queryFields,
        }
      )
      this.options = options
      this.items = siteResponse.items
      this.count = siteResponse.count
    },
  },
}
</script>
