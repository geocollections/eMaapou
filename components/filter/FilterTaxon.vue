<template>
  <filter-input-autocomplete
    :title="$t('filters.taxonHierarchy').toString()"
    query-field="taxon"
    :query-function="querySuggestions"
    :init-selection="selected"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ item.taxon }}
    </template>
    <template #suggestion="{ item }">
      {{ item.taxon }}
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterTaxon',
  components: { FilterInputAutocomplete },
  props: {
    selected: {
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
        `https://api.geoloogia.info/solr/taxon?q=${search}&rows=${options.rows}&start=${options.start}&fl=id,hierarchy_string,taxon`
      )
    }
    return { querySuggestions }
  },
})
</script>
