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
        :to="
          localePath({
            name: 'analysis-id',
            params: { id: item.id },
          })
        "
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.sample_number="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({
            name: 'sample-id',
            params: { id: item.sample_id },
          })
        "
      >
        {{ item.sample_number }}
      </nuxt-link>
    </template>
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
    <template #item.analysis_method="{ item }">
      <div>
        {{
          $translate({ et: item.analysis_method, en: item.analysis_method_en })
        }}
      </div>
    </template>
    <template #item.lab="{ item }">
      <div>
        {{ $translate({ et: item.lab, en: item.lab_en }) }}
      </div>
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
        { text: this.$t('analysis.id'), value: 'id' },
        {
          text: this.$t('analysis.sampleNumber'),
          value: 'sample_number',
        },
        { text: this.$t('analysis.locality'), value: 'locality' },
        { text: this.$t('analysis.depth'), value: 'depth' },
        { text: this.$t('analysis.stratigraphy'), value: 'stratigraphy' },
        { text: this.$t('analysis.method'), value: 'analysis_method' },
        { text: this.$t('analysis.lab'), value: 'lab' },
      ],
      queryFields: {
        id: () => 'id',
        sample_number: () => 'sample_number',
        locality: () =>
          this.$i18n.locale === 'et' ? 'locality' : 'locality_en',
        depth: () => 'depth',
        stratigraphy: () =>
          this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
        analysis_method: () =>
          this.$i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en',
        lab: () => 'lab',
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
      const localityResponse = await this.$services.sarvSolr.getResourceList(
        'analysis',
        {
          ...options,
          search: this.search,
          queryFields: this.queryFields,
        }
      )
      this.options = options
      this.items = localityResponse.items
      this.count = localityResponse.count
    },
  },
}
</script>
