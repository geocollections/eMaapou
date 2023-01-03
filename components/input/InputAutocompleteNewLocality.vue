<template>
  <input-autocomplete-new
    title="Locality"
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
  </input-autocomplete-new>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import InputAutocompleteNew from './InputAutocompleteNew.vue'
export default defineComponent({
  name: 'InputAutocompleteNewLocality',
  components: { InputAutocompleteNew },
  props: {
    selected: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup() {
    const { $axios } = useContext()

    const querySuggestions = (search: string) => {
      return $axios.$get(
        `https://api.geoloogia.info/solr/locality?q=${search}&rows=10&fl=locality,locality_en,id`
      )
    }
    return { querySuggestions }
  },
})
</script>
