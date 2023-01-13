<template>
  <filter-input-autocomplete
    :title="label"
    :query-field="$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en'"
    :query-function="querySuggestions"
    :value="value"
    v-on="$listeners"
  >
    <template #selection="{ item }">
      {{ $i18n.locale === 'et' ? item.stratigraphy : item.stratigraphy_en }}
    </template>
    <template #suggestion="{ item }">
      {{ $i18n.locale === 'et' ? item.stratigraphy : item.stratigraphy_en }}
    </template>
  </filter-input-autocomplete>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import FilterInputAutocomplete from './input/FilterInputAutocomplete.vue'
export default defineComponent({
  name: 'FilterStratigraphy',
  components: { FilterInputAutocomplete },
  props: {
    value: {
      type: Array as PropType<any[]>,
      required: true,
    },
    label: {
      type: String,
      default() {
        return this.$i18n.t('filters.stratigraphyHierarchy').toString()
      },
    },
    litho: {
      type: Boolean,
      default: false,
    },
    chrono: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { $axios } = useContext()

    const querySuggestions = (
      search: string,
      options = { rows: 10, start: 0 }
    ) => {
      let typeFilter = ''
      if (props.litho) typeFilter = '&fq=type:2'
      else if (props.chrono) typeFilter = '&fq=type:1'
      return $axios.$get(
        `https://api.geoloogia.info/solr/stratigraphy?q=${search}${typeFilter}&rows=${options.rows}&start=${options.start}&fl=id,hierarchy_string,stratigraphy,stratigraphy_en`
      )
    }
    return { querySuggestions }
  },
})
</script>
