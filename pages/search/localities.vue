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
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.country="{ item }">
      {{ $translate({ et: item.country, en: item.country_en }) }}
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
    ...mapState('locality', ['options', 'items', 'count', 'headers']),
    // TODO: This functions is reused alot. Make it a plugin.
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
    ...mapActions('locality', ['quickSearchLocalities']),
    async handleUpdate(options) {
      await this.quickSearchLocalities(options.tableOptions)
    },
  },
}
</script>
