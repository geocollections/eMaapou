<template>
  <filter-input-autocomplete
    :title="$t('filters.dataset').toString()"
    query-field="title"
    :query-function="querySuggestions"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ item.title }}
    </template>
    <template #suggestion="{ item }">
      {{ item.title }}
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterDataset',
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
        `https://api.geoloogia.info/solr/dataset?q=${search}&rows=${options.rows}&start=${options.start}&fl=id,title`
      )
    }
    return { querySuggestions }
  },
})
</script>
