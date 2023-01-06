<template>
  <filter-input-autocomplete
    :title="$t('filters.sample').toString()"
    query-field="number"
    :query-function="querySuggestions"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ item.number }}
    </template>
    <template #suggestion="{ item }">
      {{ item.number }}
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterSample',
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
        `https://api.geoloogia.info/solr/sample?q=${search}&rows=${options.rows}&start=${options.start}&fl=id,number`
      )
    }
    return { querySuggestions }
  },
})
</script>
