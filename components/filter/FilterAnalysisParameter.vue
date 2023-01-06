<template>
  <filter-input-autocomplete
    :title="$t('filters.analysisParameter').toString()"
    query-field="parameter"
    :query-function="querySuggestions"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ item.parameter }}
    </template>
    <template #suggestion="{ item }">
      {{ item.parameter }}
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterAnalysisParameter',
  components: { FilterInputAutocomplete },
  props: {
    value: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup() {
    const { $axios } = useContext()

    const querySuggestions = (
      search: string,
      options = { rows: 10, start: 0 }
    ) => {
      return $axios.$get(
        `https://api.geoloogia.info/solr/analysis_parameter?q=${search}&fq=is_null=false&rows=${options.rows}&start=${options.start}&fl=id,parameter,parameter_index`
      )
    }
    return { querySuggestions }
  },
})
</script>
