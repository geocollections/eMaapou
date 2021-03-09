<template>
  <div>
    <external-search-table-wrapper
      :external-search="search"
      :items="items"
      :headers="translatedHeaders"
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ExternalSearchTableWrapper from '@/components/tables/ExternalSearchTableWrapper'
export default {
  components: { ExternalSearchTableWrapper },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('drillcore', ['options', 'items', 'count', 'headers']),
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
      if (
        mutation.type === 'landing/updateField' &&
        mutation.payload.path === 'search'
      ) {
        this.handleUpdate({ ...this.options, search: mutation.payload.value })
      }
    })
  },
  methods: {
    ...mapActions('drillcore', ['quickSearchDrillcores']),
    async handleUpdate(options) {
      await this.quickSearchDrillcores(options.tableOptions)
    },
  },
}
</script>
