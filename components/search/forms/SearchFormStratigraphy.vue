<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
          <v-expansion-panels accordion flat tile multiple>
            <filter-stratigraphy v-model="stratigraphyHierarchy" />

            <filter-input-text
              v-model="index"
              :title="$t('filters.index').toString()"
            />
            <filter-input-text
              v-model="age"
              :title="$t('filters.age').toString()"
            />
            <filter-input-autocomplete-static
              v-model="type"
              :title="$t('filters.type').toString()"
              :items="typeSuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.text, en: item.text_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.text, en: item.text_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
            <filter-input-autocomplete-static
              v-model="rank"
              :title="$t('filters.rank').toString()"
              :items="rankSuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.text, en: item.text_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.text, en: item.text_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
            <filter-input-autocomplete-static
              v-model="scope"
              :title="$t('filters.scope').toString()"
              :items="scopeSuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.text, en: item.text_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.text, en: item.text_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
          </v-expansion-panels>
        </v-card>
      </search-fields-wrapper>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import {
  useHydrateFilterStatic,
  useHydrateFilterStratigraphy,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
export default defineComponent({
  name: 'SearchFormStratigraphy',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterStratigraphy,
    FilterInputText,
    FilterInputAutocompleteStatic,
  },
  setup(_props, { emit }) {
    const { $accessor, i18n, $axios } = useContext()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const query = computed({
      get: () => $accessor.search.stratigraphy.query,
      set: (val) => {
        $accessor.search.stratigraphy.setQuery(val)
      },
    })
    const stratigraphyHierarchy = useFilter(
      'stratigraphy',
      'stratigraphyHierarchy',
      handleSearch
    )
    const index = useFilter('stratigraphy', 'index', handleSearch)
    const age = useFilter('stratigraphy', 'age', handleSearch)
    const rank = useFilter('stratigraphy', 'rank', handleSearch)
    const scope = useFilter('stratigraphy', 'scope', handleSearch)
    const type = useFilter('stratigraphy', 'type', handleSearch)
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const state = reactive({
      rankSuggestions: [] as any[],
      scopeSuggestions: [] as any[],
      typeSuggestions: [] as any[],
    })
    useFetch(async () => {
      const rankSortField =
        i18n.locale === 'et' ? 'stratigraphy_rank' : 'stratigraphy_rank_en'
      state.rankSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/stratigraphy?q=%2A&start=0&rows=0&facet=true&facet.pivot=rank,stratigraphy_rank,stratigraphy_rank_en&facet.limit=200&facet.sort=${rankSortField}`
        )
      ).facet_counts.facet_pivot[
        'rank,stratigraphy_rank,stratigraphy_rank_en'
      ].map((rank: any) => {
        return {
          id: rank.value,
          text: rank.pivot[0].value,
          text_en: rank.pivot[0].pivot[0].value,
        }
      })
      const scopeSortField =
        i18n.locale === 'et' ? 'stratigraphy_scope' : 'stratigraphy_scope_en'
      state.scopeSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/stratigraphy?q=%2A&start=0&rows=0&facet=true&facet.pivot=scope,stratigraphy_scope,stratigraphy_scope_en&facet.limit=200&facet.sort=${scopeSortField}`
        )
      ).facet_counts.facet_pivot[
        'scope,stratigraphy_scope,stratigraphy_scope_en'
      ].map((scope: any) => {
        return {
          id: scope.value,
          text: scope.pivot[0].value,
          text_en: scope.pivot[0].pivot[0].value,
        }
      })
      const typeSortField =
        i18n.locale === 'et' ? 'stratigraphy_type' : 'stratigraphy_type_en'
      state.typeSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/stratigraphy?q=%2A&start=0&rows=0&facet=true&facet.pivot=type,stratigraphy_type,stratigraphy_type_en&facet.limit=200&facet.sort=${typeSortField}`
        )
      ).facet_counts.facet_pivot[
        'type,stratigraphy_type,stratigraphy_type_en'
      ].map((scope: any) => {
        return {
          id: scope.value,
          text: scope.pivot[0].value,
          text_en: scope.pivot[0].pivot[0].value,
        }
      })

      await hydrateFilterStratigraphy(
        stratigraphyHierarchy,
        'stratigraphyHierarchy'
      )
      hydrateFilterStatic(type, 'type', state.typeSuggestions, Number)
      hydrateFilterStatic(rank, 'rank', state.rankSuggestions, Number)
      hydrateFilterStatic(scope, 'scope', state.scopeSuggestions, Number)
    })
    return {
      ...toRefs(state),
      query,
      stratigraphyHierarchy,
      index,
      age,
      rank,
      scope,
      type,
      handleReset,
      handleSearch,
    }
  },
})
</script>
