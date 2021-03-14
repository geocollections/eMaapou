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
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.number="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.number }}
      </nuxt-link>
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
    <template #item.date_collected="{ item }">
      {{
        item.date_collected
          ? new Date(item.date_collected).toISOString().split('T')[0]
          : null
      }}
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality_id } })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
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
    ...mapState('sample', ['options', 'items', 'count', 'headers']),
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
    ...mapActions('sample', ['quickSearchSamples']),
    async handleUpdate(options) {
      await this.quickSearchSamples(options.tableOptions)
    },
  },
}
</script>
