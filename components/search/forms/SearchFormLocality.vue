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
          <search-map
            locality-overlay
            :items="$accessor.search.locality.items"
            @update="handleMapUpdate"
          />
          <filter-reference v-model="references" />
        </v-expansion-panels>
      </v-card>
    </search-fields-wrapper>
  </v-form>
</template>

<script lang="ts">
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
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterReference from '~/components/filter/FilterReference.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import { useHydrateFilterReference } from '~/composables/useHydrateFilter'
export default defineComponent({
  name: 'SearchFormLocality',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
    FilterReference,
    FilterInputAutocompleteStatic,
  },
  setup(_props, { emit }) {
    const { $accessor, $axios, i18n } = useContext()
    const route = useRoute()
    const query = computed({
      get: () => $accessor.search.locality.query,
      set: (val) => {
        $accessor.search.locality.setQuery(val)
      },
    })

    const countries = computed({
      get: () => $accessor.search.locality.filters.byIds.countries.value,
      set: (val) => {
        $accessor.search.locality.setFilterValue({
          key: 'countries',
          value: val,
        })
        handleSearch()
      },
    })

    const references = computed({
      get: () => $accessor.search.locality.filters.byIds.references.value,
      set: (val) => {
        $accessor.search.locality.setFilterValue({
          key: 'references',
          value: val,
        })
        handleSearch()
      },
    })
    const state = reactive({
      countrySuggestions: [] as any[],
    })
    const hydrateFilterReference = useHydrateFilterReference()
    useFetch(async () => {
      const sortField = i18n.locale === 'et' ? 'country' : 'country_en'
      state.countrySuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/locality?q=%2A&start=0&rows=0&facet=true&facet.pivot=country_id,country,country_en&facet.limit=200&facet.sort=${sortField}`
        )
      ).facet_counts.facet_pivot['country_id,country,country_en'].map(
        (country: any) => {
          return {
            id: country.value,
            country: country.pivot[0].value,
            country_en: country.pivot[0].pivot[0].value,
          }
        }
      )

      if (route.value.query.countries) {
        const countryIds = (route.value.query.countries as string)
          .split(',')
          .map(Number)
        countries.value = state.countrySuggestions.filter((country) =>
          countryIds.includes(country.id)
        )
      }

      if (route.value.query.references) {
        references.value = (
          await hydrateFilterReference(
            (route.value.query.references as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
    })
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const handleMapUpdate = () => {
      emit('update')
    }
    return {
      ...toRefs(state),
      query,
      references,
      countries,
      handleReset,
      handleSearch,
      handleMapUpdate,
    }
  },
})
</script>
