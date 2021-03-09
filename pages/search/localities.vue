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
  </external-search-table-wrapper>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import ExternalSearchTableWrapper from '@/components/tables/ExternalSearchTableWrapper'
export default {
  components: { ExternalSearchTableWrapper },
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
    ...mapActions('locality', ['quickSearchLocalities']),
    async handleUpdate(options) {
      await this.quickSearchLocalities(options.tableOptions)
    },
  },
}
</script>
