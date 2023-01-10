<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-input-autocomplete-static
            v-model="country"
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
            locality-overlay
            :items="$accessor.search.locality.items"
          />
          <filter-reference v-model="reference" />
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
import InputSearch from '~/components/input/InputSearch.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterReference from '~/components/filter/FilterReference.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import { useHydrateFilterReference } from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
export default defineComponent({
  name: 'SearchFormLocality',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    FilterMap,
    InputSearch,
    FilterReference,
    FilterInputAutocompleteStatic,
  },
  setup(_props, { emit }) {
    const { $accessor, $axios, i18n } = useContext()
    const route = useRoute()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const query = computed({
      get: () => $accessor.search.locality.query,
      set: (val) => {
        $accessor.search.locality.setQuery(val)
      },
    })

    const country = useFilter('locality', 'country', handleSearch)
    const reference = useFilter('locality', 'reference', handleSearch)
    const map = useFilter('locality', 'map', handleSearch)
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
        country.value = state.countrySuggestions.filter((country) =>
          countryIds.includes(country.id)
        )
      }

      if (route.value.query.references) {
        reference.value = (
          await hydrateFilterReference(
            (route.value.query.references as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
    })
    return {
      ...toRefs(state),
      query,
      reference,
      country,
      map,
      handleReset,
      handleSearch,
    }
  },
})
</script>
