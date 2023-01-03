<template>
  <input-autocomplete-new
    :title="$t('filters.reference').toString()"
    query-field="reference"
    :query-function="querySuggestions"
    :init-selection="selected"
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
  </input-autocomplete-new>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import InputAutocompleteNew from './InputAutocompleteNew.vue'
export default defineComponent({
  name: 'InputAutocompleteNewReference',
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
        `https://api.geoloogia.info/solr/reference?q=${search}&rows=${options.rows}&start=${options.start}&fl=id,reference,title`
      )
    }
    return { querySuggestions }
  },
})
</script>
