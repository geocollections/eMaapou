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
    <!-- Todo: Uncomment when preparation detail view is done -->
    <!--    <template #item.preparation_number="{ item }">-->
    <!--      <nuxt-link-->
    <!--        class="text-link"-->
    <!--        :to="localePath({ name: 'preparation-id', params: { id: item.id } })"-->
    <!--      >-->
    <!--        {{ item.preparation_number }}-->
    <!--      </nuxt-link>-->
    <!--    </template>-->
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({
            name: 'locality-id',
            params: { id: item.locality_id },
          })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.depth="{ item }">
      <div>
        <span>{{ item.depth }}</span>
        <span v-if="item.depth_interval">({{ item.depth_interval }})</span>
      </div>
    </template>
    <!-- Todo: Add lithostratigraphy -->
    <template #item.stratigraphy="{ item }">
      <a
        class="text-link"
        @click="$openGeoDetail('stratigraphy', item.stratigraphy_id)"
      >
        {{ $translate({ et: item.stratigraphy, en: item.stratigraphy_en }) }}
      </a>
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
    ...mapState('preparation', ['options', 'items', 'count', 'headers']),
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
    ...mapActions('preparation', ['quickSearchPreparations']),
    async handleUpdate(options) {
      await this.quickSearchPreparations(options.tableOptions)
    },
  },
}
</script>
