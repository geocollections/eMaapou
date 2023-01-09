<template>
  <filter-input-autocomplete
    :title="$t('filters.reference').toString()"
    :query-function="querySuggestions"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ item.reference }}
      <span class="font-weight-light font-italic">{{ item.title }}</span>
    </template>
    <template #suggestion="{ item }">
      {{ item.reference }}
      <span class="font-weight-light font-italic">{{ item.title }}</span>
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterReference',
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
        `https://api.geoloogia.info/solr/reference?defType=edismax&qf=reference^2.0+title^0.5&q=${search}&rows=${options.rows}&start=${options.start}&fl=id,reference,title`
      )
    }
    return { querySuggestions }
  },
})
</script>
