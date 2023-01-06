<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-input-range
            v-model="depth"
            :label="$t('filters.depth').toString()"
            interval-labels="intervals.depth"
            :step="0.01"
          />
          <filter-input-autocomplete-static
            v-model="method"
            :title="$t('filters.method').toString()"
            :items="methodSuggestions"
            :filter-field="$translate({ et: 'method', en: 'method_en' })"
          >
            <template #selection="{ item }">
              <div>
                {{ $translate({ et: item.method, en: item.method_en }) }}
              </div>
            </template>
            <template #suggestion="{ item }">
              <div>
                {{ $translate({ et: item.method, en: item.method_en }) }}
              </div>
            </template>
          </filter-input-autocomplete-static>
          <filter-input-autocomplete-static
            v-model="lab"
            :title="$t('filters.lab').toString()"
            :items="labSuggestions"
            :filter-field="$translate({ et: 'lab', en: 'lab_en' })"
          >
            <template #selection="{ item }">
              <div>
                {{ $translate({ et: item.lab, en: item.lab_en }) }}
              </div>
            </template>
            <template #suggestion="{ item }">
              <div>
                {{ $translate({ et: item.lab, en: item.lab_en }) }}
              </div>
            </template>
          </filter-input-autocomplete-static>
          <filter-sample v-model="sample" />
          <filter-locality v-model="locality" />
          <filter-map v-model="map" :items="$accessor.search.analysis.items" />
          <filter-input-text
            v-model="agent"
            :title="$t('filters.agent').toString()"
          />
          <filter-institution v-model="institutions" />
        </v-expansion-panels>
      </v-card>
      <!-- <input-text v-model="id" :label="$t(filters.byIds.id.label)" />
      <input-range v-model="depth" :label="$t(filters.byIds.depth.label)" />
      <input-text v-model="method" :label="$t(filters.byIds.method.label)" />
      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />
      <input-text v-model="sample" :label="$t(filters.byIds.sample.label)" />
      <input-text v-model="agent" :label="$t(filters.byIds.agent.label)" />
      <input-text v-model="lab" :label="$t(filters.byIds.lab.label)" /> -->
      <!-- <input-autocomplete-stratigraphy
        v-model="stratigraphy"
        return-object
        :label="$t(filters.byIds.stratigraphy.label)"
      />
      <input-text v-model="dataset" :label="$t(filters.byIds.dataset.label)" /> -->
    </search-fields-wrapper>

    <!-- <search-map
      :items="items"
      class="mt-2"
      :active="geoJSON !== null"
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
// import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrateFilterLocality,
  useHydrateFilterSample,
} from '~/composables/useHydrateFilter'
import FilterSample from '~/components/filter/FilterSample.vue'
export default defineComponent({
  name: 'SearchFormAnalysis',
  components: {
    // SearchInstitutionFilter,
    // InputText,
    SearchFieldsWrapper,
    SearchActions,
    // SearchMap,
    InputSearch,
    // InputRange,
    // InputAutocompleteStratigraphy,
    FilterInputRange,
    FilterInputAutocompleteStatic,
    FilterLocality,
    FilterMap,
    FilterInstitution,
    FilterInputText,
    FilterSample,
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
    const handleMapUpdate = () => {
      emit('update')
    }

    const query = computed({
      get: () => $accessor.search.analysis.query,
      set: (val) => {
        $accessor.search.analysis.setQuery(val)
      },
    })
    const depth = computed({
      get: () => $accessor.search.analysis.filters.byIds.depth.value,
      set: (val) => {
        $accessor.search.analysis.setFilterValue({
          key: 'depth',
          value: val,
        })
        handleSearch()
      },
    })
    const method = computed({
      get: () => $accessor.search.analysis.filters.byIds.method.value,
      set: (val) => {
        $accessor.search.analysis.setFilterValue({
          key: 'method',
          value: val,
        })
        handleSearch()
      },
    })
    const lab = computed({
      get: () => $accessor.search.analysis.filters.byIds.lab.value,
      set: (val) => {
        $accessor.search.analysis.setFilterValue({
          key: 'lab',
          value: val,
        })
        handleSearch()
      },
    })
    const agent = computed({
      get: () => $accessor.search.analysis.filters.byIds.agent.value,
      set: (val) => {
        $accessor.search.analysis.setFilterValue({
          key: 'agent',
          value: val,
        })
        handleSearch()
      },
    })

    const locality = computed({
      get: () => $accessor.search.analysis.filters.byIds.locality.value,
      set: (val) => {
        $accessor.search.analysis.setFilterValue({
          key: 'locality',
          value: val,
        })
        handleSearch()
      },
    })
    const sample = computed({
      get: () => $accessor.search.analysis.filters.byIds.sample.value,
      set: (val) => {
        $accessor.search.analysis.setFilterValue({
          key: 'sample',
          value: val,
        })
        handleMapUpdate()
      },
    })
    const map = computed({
      get: () => $accessor.search.analysis.filters.byIds.map.value,
      set: (val) => {
        $accessor.search.analysis.setFilterValue({
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
      methodSuggestions: [] as any[],
      labSuggestions: [] as any[],
    })
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterSample = useHydrateFilterSample()
    useFetch(async () => {
      const methodSortField =
        i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en'
      state.methodSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/analysis?q=%2A&start=0&rows=0&facet=true&facet.pivot=method,analysis_method,analysis_method_en&facet.limit=200&facet.sort=${methodSortField}`
        )
      ).facet_counts.facet_pivot[
        'method,analysis_method,analysis_method_en'
      ].map((method: any) => {
        return {
          id: method.value,
          method: method.pivot[0].value,
          method_en: method.pivot[0].pivot[0].value,
        }
      })
      const labSortField = i18n.locale === 'et' ? 'lab' : 'lab_en'
      state.labSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/analysis?q=%2A&start=0&rows=0&facet=true&facet.pivot=lab_id,lab,lab_en&facet.limit=200&facet.sort=${labSortField}`
        )
      ).facet_counts.facet_pivot['lab_id,lab,lab_en'].map((lab: any) => {
        return {
          id: lab.value,
          lab: lab.pivot[0].value,
          lab_en: lab.pivot[0].pivot[0].value,
        }
      })
      if (route.value.query.methods) {
        const methodIds = (route.value.query.methods as string)
          .split(',')
          .map(Number)
        method.value = state.methodSuggestions.filter((method) =>
          methodIds.includes(method.id)
        )
      }
      if (route.value.query.labs) {
        const methodIds = (route.value.query.labs as string)
          .split(',')
          .map(Number)
        lab.value = state.labSuggestions.filter((lab) =>
          methodIds.includes(lab.id)
        )
      }

      if (route.value.query.localities) {
        locality.value = (
          await hydrateFilterLocality(
            (route.value.query.localities as string).split(',').map(Number)
          )
        ).data.response.docs
      }
      if (route.value.query.sample) {
        sample.value = (
          await hydrateFilterSample(
            (route.value.query.sample as string).split(',').map(Number)
          )
        ).data.response.docs
      }
    })
    return {
      ...toRefs(state),
      isEmpty,
      handleReset,
      handleSearch,
      handleMapUpdate,
      depth,
      query,
      method,
      locality,
      map,
      institutions,
      lab,
      agent,
      sample,
    }
  },
})
</script>
