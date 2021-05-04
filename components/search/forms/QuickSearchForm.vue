<template>
  <v-form class="text-center" @submit.prevent="$emit('submit')">
    <global-search show-button />
  </v-form>
</template>
<script>
import GlobalSearch from '~/components/search/GlobalSearch'

export default {
  name: 'QuickSearchForm',
  components: { GlobalSearch },
  props: {},
}
</script>
