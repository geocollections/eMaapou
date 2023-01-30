<template>
  <filter-input-autocomplete
    :title="titleComputed"
    :query-field="$i18n.locale === 'et' ? 'name' : 'name_en'"
    :query-function="querySuggestions"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ $i18n.locale == 'et' ? item.name : item.name_en }}
    </template>
    <template #suggestion="{ item }">
      {{ $i18n.locale == 'et' ? item.name : item.name_en }}
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  useContext,
} from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterSample',
  components: { FilterInputAutocomplete },
  props: {
    value: {
      type: Array as PropType<any[]>,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { $axios, i18n } = useContext()

    const querySuggestions = (
      search: string,
      options = { rows: 10, start: 0 }
    ) => {
      return $axios.$get(
        `https://api.geoloogia.info/solr/rock?q=${search}&fq=hierarchy_strings:*&rows=${options.rows}&start=${options.start}&fl=id,name,name_en,hierarchy_strings`
      )
    }

    const titleComputed = computed(() => {
      if (props.title.length < 1)
        return i18n.t('filters.rockHierarchy').toString()
      return props.title
    })
    return { querySuggestions, titleComputed }
  },
})
</script>
