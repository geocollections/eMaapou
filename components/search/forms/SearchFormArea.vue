<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-input-text
            v-model="name"
            :title="$t('filters.name').toString()"
          />
          <filter-input-autocomplete-static
            v-model="county"
            :title="$t('filters.county').toString()"
            :items="countySuggestions"
            :filter-field="$translate({ et: 'county', en: 'county_en' })"
          >
            <template #selection="{ item }">
              <div>
                {{ $translate({ et: item.county, en: item.county_en }) }}
              </div>
            </template>
            <template #suggestion="{ item }">
              <div>
                {{ $translate({ et: item.county, en: item.county_en }) }}
              </div>
            </template>
          </filter-input-autocomplete-static>
          <filter-input-autocomplete-static
            v-model="type"
            :title="$t('filters.areaType').toString()"
            :items="typeSuggestions"
            :filter-field="$translate({ et: 'area_type', en: 'area_type_en' })"
          >
            <template #selection="{ item }">
              <div>
                {{ $translate({ et: item.area_type, en: item.area_type_en }) }}
              </div>
            </template>
            <template #suggestion="{ item }">
              <div>
                {{ $translate({ et: item.area_type, en: item.area_type_en }) }}
              </div>
            </template>
          </filter-input-autocomplete-static>
        </v-expansion-panels>
      </v-card>

      <!-- <input-text v-model="name" :label="$t(filters.byIds.name.label)" /> -->
      <!--
        NOTE: Search on estonian county names. These don't contain spaces and therefore don't break the search.
        This probably won't be a problem in the future.
       -->
      <!-- <input-autocomplete
        v-model="county"
        :items="counties"
        :item-text="$i18n.locale === 'et' ? 'maakond' : 'maakond_en'"
        :item-value="'maakond'"
        :label="$t(filters.byIds.county.label)"
      /> -->
      <!-- NOTE: Same as with counties above. But this might be a problem when new types are added. -->
      <!-- <input-autocomplete
        v-model="type"
        :items="types"
        :item-text="$i18n.locale === 'et' ? 'name' : 'name_en'"
        :item-value="'name'"
        :label="$t(filters.byIds.type.label)"
      /> -->
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
// import InputText from '~/components/input/InputText.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import { useFilter } from '~/composables/useFilter'
// import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
export default defineComponent({
  name: 'SearchFormArea',
  components: {
    // InputText,
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterInputText,
    FilterInputAutocompleteStatic,
    // InputAutocomplete,
  },
  setup(_props, { emit }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $accessor, i18n, $axios } = useContext()
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
      get: () => $accessor.search.area.query,
      set: (val) => {
        $accessor.search.area.setQuery(val)
      },
    })
    const name = useFilter('area', 'name', handleSearch)
    const type = useFilter('area', 'type', handleSearch)
    const county = useFilter('area', 'county', handleSearch)
    const state = reactive({
      countySuggestions: [] as any[],
      typeSuggestions: [] as any[],
    })
    useFetch(async () => {
      // // NOTE: enable when index has maakond_id and area_type_id field
      // const countySortField = i18n.locale === 'et' ? 'maakond' : 'maakond_en'
      // state.countySuggestions = (
      //   await $axios.$get(
      //     `https://api.geoloogia.info/solr/area?q=%2A&start=0&rows=0&facet=true&facet.pivot=maakond_id,maakond,maakond_en&facet.limit=100&facet.sort=${countySortField}`
      //   )
      // ).facet_counts.facet_pivot['maakond_id,maakond,maakond_en'].map(
      //   (repository: any) => {
      //     return {
      //       id: repository.value,
      //       county: repository.pivot[0].value,
      //       county_en: repository.pivot[0].pivot[0].value,
      //     }
      //   }
      // )
      // if (route.value.query.county) {
      //   const countyIds = (route.value.query.county as string)
      //     .split(',')
      //     .map(Number)
      //   county.value = state.countySuggestions.filter((county) =>
      //     countyIds.includes(county.id)
      //   )
      // }
      // const typeSortField = i18n.locale === 'et' ? 'maakond' : 'maakond_en'
      // state.typeSuggestions = (
      //   await $axios.$get(
      //     `https://api.geoloogia.info/solr/area?q=%2A&start=0&rows=0&facet=true&facet.pivot=area_type_id,area_type,area_type_en&facet.limit=100&facet.sort=${typeSortField}`
      //   )
      // ).facet_counts.facet_pivot['area_type_id,area_type,area_type_en'].map(
      //   (repository: any) => {
      //     return {
      //       id: repository.value,
      //       area_type: repository.pivot[0].value,
      //       area_type_en: repository.pivot[0].pivot[0].value,
      //     }
      //   }
      // )
      // if (route.value.query.type) {
      //   const typeIds = (route.value.query.type as string)
      //     .split(',')
      //     .map(Number)
      //   county.value = state.typeSuggestions.filter((type) =>
      //     typeIds.includes(type.id)
      //   )
      // }
    })
    return {
      ...toRefs(state),
      query,
      name,
      county,
      type,
      handleReset,
      handleSearch,
      handleMapUpdate,
    }
  },
})
</script>
