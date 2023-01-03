<template>
  <filter-input-autocomplete
    :title="$t('filters.locality').toString()"
    :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'"
    :query-function="querySuggestions"
    :init-selection="selected"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ $i18n.locale == 'et' ? item.locality : item.locality_en }}
    </template>
    <template #suggestion="{ item }">
      {{ $i18n.locale == 'et' ? item.locality : item.locality_en }}
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterLocality',
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
        `https://api.geoloogia.info/solr/locality?q=${search}&rows=${options.rows}&start=${options.start}&fl=locality,locality_en,id`
      )
    }
    return { querySuggestions }
  },
})
</script>
