<template>
  <table-wrapper
    :show-search="false"
    external-options
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
  </table-wrapper>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableWrapper from '@/components/tables/TableWrapper'
export default {
  components: { TableWrapper },
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
  watch: {
    search: {
      handler(value) {
        this.handleUpdate({ ...this.options, search: value })
      },
    },
  },
  methods: {
    ...mapActions('site', ['quickSearchSites']),
    async handleUpdate(options) {
      await this.quickSearchSites(options.tableOptions)
    },
  },
}
</script>
