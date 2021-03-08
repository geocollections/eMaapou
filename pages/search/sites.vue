<template>
  <external-search-table-wrapper
    :external-search="search"
    :items="items"
    :headers="translatedHeaders"
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
import { mapState, mapActions } from 'vuex'
import ExternalSearchTableWrapper from '@/components/tables/ExternalSearchTableWrapper'
export default {
  components: { ExternalSearchTableWrapper },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('site', ['options', 'items', 'count', 'headers']),
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        }
      })
    },
  },
  created() {
    this.$store.subscribe((mutation, _) => {
      if (mutation.type === 'landing/updateSearch') {
        this.handleUpdate({ ...this.options, search: mutation.payload })
      }
    })
  },
  methods: {
    ...mapActions('site', ['searchSites']),
    async handleUpdate(options) {
      await this.searchSites(options.tableOptions)
    },
  },
}
</script>
