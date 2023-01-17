<template>
  <filter-input-autocomplete
    :title="$t('filters.rockHierarchy').toString()"
    :query-field="$i18n.locale === 'et' ? 'name' : 'name_en'"
    :query-function="querySuggestions"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ $i18n.locale == 'et' ? item.name : item.name }}
    </template>
    <template #suggestion="{ item }">
      {{ $i18n.locale == 'et' ? item.name : item.name }}
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
        `https://api.geoloogia.info/solr/rock?q=${search}&rows=${options.rows}&start=${options.start}&fl=id,name,name_en`
      )
    }
    return { querySuggestions }
  },
})
</script>
