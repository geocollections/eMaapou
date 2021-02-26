<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <h1 class="text-center">{{ $t('title') }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          color="deep-orange darken-2"
          append-icon="mdi-magnify"
          :label="$t('common.search')"
          hide-details
          clearable
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
              :to="
                localePath({ name: 'drillcore-id', params: { id: item.id } })
              "
            >
              {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
            </nuxt-link>
          </template>
        </external-search-table-wrapper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { debounce } from 'lodash'
import ExternalSearchTableWrapper from '~/components/tables/ExternalSearchTableWrapper.vue'

export default {
  components: { ExternalSearchTableWrapper },
  data() {
    return {
      search: '',
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
  head() {
    return {
      title: this.$t('title'),
    }
  },
  methods: {
    async handleUpdate(options) {
      const drillcoreResponse = await this.$services.sarvREST.getResourceList(
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
    handleSearch: debounce(function () {
      this.handleUpdate(this.options)
    }, 500),
  },
}
</script>
