<template>
  <external-search-table-wrapper
    :external-search="search"
    :items="items"
    :headers="headers"
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
        { text: this.$t('preparation.id'), value: 'id' },
        {
          text: this.$t('preparation.preparation_number'),
          value: 'preparation_number',
        },
        { text: this.$t('preparation.locality'), value: 'locality' },
        { text: this.$t('preparation.depth'), value: 'depth' },
        {
          text: this.$t('preparation.stratigraphyAndLithostratigraphy'),
          value: 'stratigraphy',
        },
        { text: this.$t('preparation.agent'), value: 'agent' },
        { text: this.$t('preparation.mass'), value: 'mass' },
      ],
      queryFields: {
        id: () => 'id',
        preparation_number: () => 'preparation_number',
        locality: () =>
          this.$i18n.locale === 'et' ? 'locality' : 'locality_en',
        depth: () => 'depth',
        stratigraphy: () =>
          this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
        agent: () => 'agent',
        mass: () => 'mass',
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
        'preparation',
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
