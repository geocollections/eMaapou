<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-input-autocomplete-static
            v-model="countries"
            :title="$t('filters.country').toString()"
            :items="countrySuggestions"
            :filter-field="$translate({ et: 'country', en: 'country_en' })"
          >
            <template #selection="{ item }">
              <div>
                {{ $translate({ et: item.country, en: item.country_en }) }}
              </div>
            </template>
            <template #suggestion="{ item }">
              <div>
                {{ $translate({ et: item.country, en: item.country_en }) }}
              </div>
            </template>
          </filter-input-autocomplete-static>

          <filter-map
            v-model="map"
            borehole-overlay
            :items="$accessor.search.drillcore.items"
          />
          <filter-input-autocomplete-static
            v-model="repositories"
            :title="$t('filters.drillcoreRepository').toString()"
            :items="repositorySuggestions"
            :filter-field="
              $translate({ et: 'repository', en: 'repository_en' })
            "
          >
            <template #selection="{ item }">
              <div>
                {{
                  $translate({ et: item.repository, en: item.repository_en })
                }}
              </div>
            </template>
            <template #suggestion="{ item }">
              <div>
                {{
                  $translate({ et: item.repository, en: item.repository_en })
                }}
              </div>
            </template>
          </filter-input-autocomplete-static>

          <filter-input-range
            v-model="boxes"
            :label="$t('filters.drillcoreBoxes').toString()"
          />
          <filter-institution v-model="institutions" />
        </v-expansion-panels>
      </v-card>
      <!-- <input-text v-model="name" :label="$t(filters.byIds.name.label)" />
      <input-text
        v-model="repository"
        :label="$t(filters.byIds.repository.label)"
      />
      <input-text v-model="country" :label="$t(filters.byIds.country.label)" />
      <input-text v-model="storage" :label="$t(filters.byIds.storage.label)" />
      <input-range v-model="boxes" :label="$t(filters.byIds.boxes.label)" /> -->
    </search-fields-wrapper>

    <!-- <search-map
      borehole-overlay
      :active="geoJSON !== null"
      :items="items"
      class="mt-2"
      @update="handleMapUpdate"
    />

    <search-institution-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="handleInstitutionsUpdate"
    /> -->
  </v-form>
</template>

<script lang="ts">
import isEmpty from 'lodash/isEmpty'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
export default defineComponent({
  name: 'SearchFormDrillcore',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterInputAutocompleteStatic,
    FilterInputRange,
    FilterInstitution,
    FilterMap,
  },
  setup(_props, { emit }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $accessor, $axios, i18n } = useContext()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const route = useRoute()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const handleMapUpdate = () => {
      emit('update')
    }

    const query = computed({
      get: () => $accessor.search.drillcore.query,
      set: (val) => {
        $accessor.search.drillcore.setQuery(val)
      },
    })

    const boxes = computed({
      get: () => $accessor.search.drillcore.filters.byIds.boxes.value,
      set: (val) => {
        $accessor.search.drillcore.setFilterValue({
          key: 'boxes',
          value: val,
        })
        handleSearch()
      },
    })
    const countries = computed({
      get: () => $accessor.search.drillcore.filters.byIds.country.value,
      set: (val) => {
        $accessor.search.drillcore.setFilterValue({
          key: 'country',
          value: val,
        })
        handleSearch()
      },
    })
    const repositories = computed({
      get: () => $accessor.search.drillcore.filters.byIds.repository.value,
      set: (val) => {
        $accessor.search.drillcore.setFilterValue({
          key: 'repository',
          value: val,
        })
        handleSearch()
      },
    })
    const map = computed({
      get: () => $accessor.search.drillcore.filters.byIds.map.value,
      set: (val) => {
        $accessor.search.drillcore.setFilterValue({
          key: 'map',
          value: val,
        })
        handleMapUpdate()
      },
    })
    const institutions = computed({
      get: () => $accessor.search.globalFilters.byIds.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const state = reactive({
      countrySuggestions: [] as any[],
      repositorySuggestions: [] as any[],
    })
    useFetch(async () => {
      // NOTE: enable when `country_id` is added to drillcore index
      // const sortField = i18n.locale === 'et' ? 'country' : 'country_en'
      // state.countrySuggestions = (
      //   await $axios.$get(
      //     `https://api.geoloogia.info/solr/drillcore?q=%2A&start=0&rows=0&facet=true&facet.pivot=country_id,country,country_en&facet.limit=200&facet.sort=${sortField}`
      //   )
      // ).facet_counts.facet_pivot['country_id,country,country_en'].map(
      //   (country: any) => {
      //     return {
      //       id: country.value,
      //       country: country.pivot[0].value,
      //       country_en: country.pivot[0].pivot[0].value,
      //     }
      //   }
      // )
      // NOTE: uncomment when `core_repository_id` is added to index
      // const repositorySortField =
      //   i18n.locale === 'et' ? 'country' : 'country_en'
      // state.repositorySuggestions = (
      //   await $axios.$get(
      //     `https://api.geoloogia.info/solr/drillcore?q=%2A&start=0&rows=0&facet=true&facet.pivot=core_repository_id,core_repository,core_repository_en&facet.limit=100&facet.sort=${repositorySortField}`
      //   )
      // ).facet_counts.facet_pivot[
      //   'core_repository_id,core_repository,core_repository_en'
      // ].map((repository: any) => {
      //   return {
      //     id: repository.value,
      //     country: repository.pivot[0].value,
      //     country_en: repository.pivot[0].pivot[0].value,
      //   }
      // })
      // if (route.value.query.repositories) {
      //   const countryIds = (route.value.query.repositories as string)
      //     .split(',')
      //     .map(Number)
      //   countries.value = state.repositorySuggestions.filter((repository) =>
      //     countryIds.includes(repository.id)
      //   )
      // }
    })
    return {
      ...toRefs(state),
      query,
      countries,
      repositories,
      boxes,
      map,
      institutions,
      handleReset,
      handleSearch,
      handleMapUpdate,
      isEmpty,
    }
  },
  // computed: {
  //   ...mapState('search/drillcore', ['filters', 'items']),
  //   ...mapFields('search/drillcore', {
  //     name: 'filters.byIds.name.value',
  //     repository: 'filters.byIds.repository.value',
  //     country: 'filters.byIds.country.value',
  //     boxes: 'filters.byIds.boxes.value',
  //     storage: 'filters.byIds.storage.value',
  //     query: 'query',
  //   }),
  //   ...mapFields('search', {
  //     institution: 'globalFilters.byIds.institutions.value',
  //     geoJSON: 'globalFilters.byIds.geoJSON.value',
  //   }),
  //   ...mapGetters('search/drillcore', ['hasActiveFilters']),
  // },
  // methods: {
  //   handleInstitutionsUpdate(newInstitutions: any[]) {
  //     this.institution = newInstitutions
  //     this.$emit('update')
  //   },
  // },
})
</script>
