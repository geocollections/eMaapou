<template>
  <v-form class="text-center" @submit.prevent="$emit('submit')">
    <global-search />
    <search-button v-if="showButton" />
  </v-form>
</template>
<script>
import SearchButton from '~/components/search/SearchButton'
import GlobalSearch from '~/components/search/GlobalSearch'

export default {
  name: 'QuickSearchForm',
  components: { SearchButton, GlobalSearch },
  props: {
    showButton: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
