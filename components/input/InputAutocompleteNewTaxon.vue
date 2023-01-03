<template>
  <input-autocomplete-new
    title="Taxon hierarchy"
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
  </input-autocomplete-new>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import InputAutocompleteNew from './InputAutocompleteNew.vue'
export default defineComponent({
  name: 'InputAutocompleteNewTaxon',
  components: { InputAutocompleteNew },
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
